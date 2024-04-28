import requests, xmltodict
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)


api_base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
efetch_endpoint = f"{api_base_url}/efetch.fcgi"
esearch_endpoint = f"{api_base_url}/esearch.fcgi"

def esearch(term, retstart, retmax):
    params = {
        "db": "pubmed",
        "retstart": retstart,
        "retmax": retmax,
        "term": term,
        "retmode": "json"
    }
    response = requests.get(esearch_endpoint, params=params).json()
    return {
        "ids": response["esearchresult"]["idlist"],
        "count": response["esearchresult"]["count"]
    }

def efetch(ids):
    if len(ids) == 0:
        return []
    params = {
        "id": ",".join(ids),
        "db": "pubmed",
        "retmode": "xml"
    }
    response = requests.get(efetch_endpoint, params=params).content
    json_response = xmltodict.parse(response)
    results = []
    for item in json_response["PubmedArticleSet"]["PubmedArticle"]:
        if item == 'PubmedData':
            continue
        if item == "MedlineCitation":
            medline_citation = json_response["PubmedArticleSet"]["PubmedArticle"][item]
        else:
            medline_citation = item.get("MedlineCitation")
        if medline_citation is None:
            results.append({})
            continue
        title = medline_citation.get("Article",{}).get("ArticleTitle")
        if title is not None and not isinstance(title, str):
            title = title.get("#text")
        data = {
            "pmid": medline_citation.get("PMID", {}).get("#text"),
            "title": title,
            "publication_year": medline_citation.get("Article", {}).get("Journal", {}).get("JournalIssue", {}).get("PubDate", {}).get("Year"),
            "abstract": medline_citation.get("Article", {}).get("Abstract"),
            "journal": medline_citation.get("Article", {}).get("Journal"),
            "author_list": medline_citation.get("Article", {}).get("AuthorList", {}).get("Author")
        }
        results.append(data)
    return results

@app.route("/fetch-ids", methods = ["POST"])
def fetch_ids():
    input = request.json
    term = input.get("term", "").strip()
    if term == "":
        return {"results": [], "count": 0, "page": 0}
    retstart = input.get("retstart", 0)
    retmax = input.get("retmax", 20)
    search_result = esearch(term, retstart, retmax)
    basic_info = efetch(search_result["ids"])
    result = {
        "count": search_result["count"],
        "retstart": retstart,
        "data": []
    }
    for item in basic_info:
        data = {
            "pmid": item["pmid"],
            "title": item["title"],
            "publication_year": item["publication_year"]
        }
        result["data"].append(data)
    return result

@app.route("/fetch-info-from-id", methods=["GET"])
def get_article_from_id():
    ids = request.args.get("id")
    fields = request.args.get("fields", [])
    result = efetch(ids.split(","))
    modified_results = []
    for item in result:
        data = {}
        for field in item:
            if field in fields or len(fields) == 0:
                data[field] = item[field]
        modified_results.append(data)
    return modified_results

app.run('0.0.0.0', port=5000)

