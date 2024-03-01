import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
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
import { Grid, Typography, colors } from '@mui/material';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

const Profile = () => {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [isLoaded, setIsLoaded] = useState(true);
    const [user, setUser] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("http://localhost:2000/authuser", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'ok') {
                    setUser(result.userData[0]);
                    setIsLoaded(false);
                    // เช็คว่าเป็น admin หรือไม่ แล้วเก็บค่าลงใน localStorage
                    if (result.userData[0].cus_id === "admin") {
                        localStorage.setItem('isAdmin', 'true');
                    } else {
                        localStorage.removeItem('isAdmin');
                    }
                } else if (result.status === 403) {
                    MySwal.fire({
                        html: <i>Token Forbidden</i>,
                        icon: 'error'
                    }).then(() => {
                        navigate('/');
                    })
                }
            })
            .catch((error) => console.error(error));

    }, []);

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('isAdmin'); // ลบค่า isAdmin เมื่อออกจากระบบ
        navigate('/')
    }

    if (isLoaded) return (<div>Loading...</div>);
    else {
        return (
            <>
                <Navbar />
                <div>
                    <React.Fragment>
                        <CssBaseline />
                        <Container maxWidth="lg" sx={{ p: 2 }}>

                            <Paper
                                sx={{
                                    p: 2,
                                    margin: 'auto',
                                    maxWidth: 500,
                                    flexGrow: 1,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item>
                                    </Grid>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs container direction="column" spacing={2}>
                                            <Grid item xs>
                                                <Typography gutterBottom variant="subtitle1" component="div">
                                                    Standard license
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Email : {user.cus_mail}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Username  : {user.cus_id}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Port Number : {user.cus_port}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Regis_time : {user.regis_time}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Link href="/">
                                                    <Button onClick={logout} variant="contained" sx={{
                                                        backgroundColor: '#ff0000', color: 'white', '&:hover': {
                                                            backgroundColor: '#ff4444',
                                                        },
                                                    }}>Log Out</Button>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" component="div" sx={{ color: '#d8808b' }}>
                                                E TRADER USER's
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>

                        </Container>
                    </React.Fragment>
                </div >
            </>
        )
    }
}

export default Profile;
