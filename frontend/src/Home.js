import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, CircularProgress, Container, TableFooter } from '@mui/material';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

const Home = () => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const url = "http://localhost:5000/fetch-ids";
    
    const updateQuery = (event) => {
        setQuery(event.target.value);
    }

    const searchPublications = () => {
        if (query == '')
            return;
        setLoading(true);
        const requestBody = {
            "retmax": pageSize,
            "retstart": page,
            "term": query
        }
        axios.post(url, requestBody).then(res => {
            setCount(res.data.count);
            setData(res.data.data);
            setLoading(false);
            console.log(res.data.data)
        });
    }

    const openPublication = (id) => {
        console.log(id);
        navigate("/publication/" + id);
    }

    useEffect(() => {
        searchPublications();
    }, [page, pageSize]);

    const handleChangePage = (event, newPage) => {
        console.log(newPage);
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box component="section" sx={{ p: 2 }}>
            <Stack spacing={2} direction="row">
                <TextField id="standard-basic" label="Search" type="search" variant="standard" onChange={updateQuery} />
                <Button variant="contained" onClick={searchPublications}>Search</Button>
            </Stack>
            {
                loading && <CircularProgress sx={{ p: 2 }} ></CircularProgress>
            }
            {
                !loading && data?.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>PMID</TableCell>
                                <TableCell align="center">Title</TableCell>
                                <TableCell align="center">Publication Year</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => {
                                return <TableRow
                                    key={row.pmid}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={() => openPublication(row.pmid)}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.pmid}
                                    </TableCell>
                                    <TableCell align="right">{row.title}</TableCell>
                                    <TableCell align="right">{row.publication_year}</TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                        <TableFooter>
                            <TablePagination count={count} page={page} rowsPerPage={pageSize} 
                            onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}></TablePagination>
                        </TableFooter>
                    </Table>
                </TableContainer>
            }
        </Box>
    )
}

export default Home;