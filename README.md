# yale-assessment-Softwaredeveloper
 
Server is written using flask framework. Requests library is used to make API calls to the publications API. 
xmltodict library is used to convert the XML response to JSON. Server has two APIs. 
One POST API, it gives a paginated list of items containing ID, Title and Year based on search term by the user.
Second API, it gives the information particular to the list of IDs submitted by User. 

Frontend is written using React framework. For routing, react-router-dom library is used and for CSS react material UI library is used. For making API calls, axios library is used. A search box and a button is provided for the user to enter the keyword and fetch the relevant items. Clicking on any item will route the user to a detailed page containing more info about the publication.
