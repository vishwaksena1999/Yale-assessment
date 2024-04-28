import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const Publication = () => {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const url = "http://localhost:5000/fetch-info-from-id"

    const fetchPublication = () => {
        setLoading(true);
        axios.get(url + "?id=" + id).then(res => {
            setData(res.data[0]);
            setLoading(false);
        });
    };
    useEffect(() => {
        fetchPublication();
    }, [id]);
    return <Box component={"section"} sx={{ p: 2 }}>
        {
            loading && <CircularProgress></CircularProgress>
        }
        {
            !loading &&
            <Box component={"section"}>
                <h2>Title: {data.title}</h2>
                <h2>Publication year: {data.publication_year}</h2>
                <h2>Authors:</h2>
                {
                    data.author_list.map((author, index) => <h4 key={index}>{author.ForeName} {author.LastName}</h4>)
                }
                {
                    data.abstract?.AbstractText?.length > 0 &&
                    <Box component={"section"}>
                        <h2>Abstract</h2>
                        {
                            data.abstract.AbstractText.map((abstract, index) =>
                                <Box key={index}>
                                    <h4>{abstract["@Label"]}</h4>
                                    <h5>{abstract["#text"]}</h5>
                                </Box>
                            )
                        }
                    </Box>
                }
            </Box>
        }
    </Box>
    return <h2>Publication {id}</h2>
}

export default Publication;