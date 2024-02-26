import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useNavigate } from "react-router-dom";

const User = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // กรณีไม่มี token ให้ทำการ redirect ไปยังหน้า login
            navigate('/');
            return;
        }
        UserGet();
    }, []);

    const UserGet = () => {
        fetch("http://localhost:2000/users")
            .then(res => res.json())
            .then((result) => {
                setItems(result);
            })
            .catch((error) => console.error(error));
    }

    const UserDelete = id => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "id": id
        });

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:2000/delete", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                alert(result['message']);
                UserGet();
            })
            .catch((error) => console.error(error));
    }

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ p: 2 }}>
                <Paper sx={{ p: 2 }}>
                    <Box display="flex">
                        <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ fontSize: 'h6.fontSize', m: 1 }}>User</Box>
                        </Box>
                        <Box>
                            <Link href="/">
                                <Button onClick={logout} variant="contained" sx={{
                                    backgroundColor: '#ff0000', color: 'white', '&:hover': {
                                        backgroundColor: '#ff4444',
                                    },
                                }}>Log Out</Button>
                            </Link>
                            {/* <Link href="create">
                                <Button variant="contained" sx={{
                                    backgroundColor: '#5677fc', color: 'white', '&:hover': {
                                        backgroundColor: '#303f9f',
                                    },
                                }}>Create</Button>
                            </Link> */}
                        </Box>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="center">Password</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">Port</TableCell>
                                    <TableCell align="right">Regis_time</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.cus_id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.cus_pwd}
                                        </TableCell>
                                        <TableCell align="right">{row.cus_mail}</TableCell>
                                        <TableCell align="right">{row.cus_port}</TableCell>
                                        <TableCell align="right">{row.regis_time}</TableCell>
                                        <TableCell align="right">
                                            <ButtonGroup variant="outlined" aria-label="Basic button group">
                                                <Link href={'/update/' + row.id}>
                                                    <Button>Edit</Button>
                                                </Link>
                                                <Button onClick={() => UserDelete(row.id)}>DEL</Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </React.Fragment>
    );
}

export default User;
