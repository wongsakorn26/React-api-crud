import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Button, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

export default function Userupdate() {
    const { id } = useParams();

    const [cus_id, setCus_id] = useState('');
    const [cus_pwd, setCus_pwd] = useState('');
    const [cus_mail, setCus_mail] = useState('');
    const [cus_port, setCus_port] = useState('');

    useEffect(() => {

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(process.env.REACT_APP_API_URL +  "/users/" + id, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((result) => {
                // Assuming result is an object containing user data
                setCus_id(result['cus_id']);
                setCus_pwd(result['cus_pwd']);
                setCus_mail(result['cus_mail']);
                setCus_port(result['cus_port']);
            })
            .catch((error) => console.error('Error fetching user data:', error));

    }, [id]);

    const handleSubmit = event => {
        event.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "cus_id": cus_id,
            "cus_pwd": cus_pwd,
            "cus_mail": cus_mail,
            "cus_port": cus_port
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:2000/update/" + id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                alert(result['message']);

                window.location.href = '/data';

            })
            .catch((error) => console.error(error));
    };

    return (
        <React.Fragment>
            {/* <h1>{cus_id}</h1>
            <h1>{cus_pwd}</h1>
            <h1>{cus_mail}</h1>
            <h1>{cus_port}</h1> */}
            <CssBaseline />
            <Container maxWidth="lg" sx={{ p: 2 }}>
                <Typography variant='h6' gutterBottom component='div'>
                    Update User
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField id="cus_id" label="Your ID" variant="outlined"
                                fullWidth required
                                onChange={(e) => setCus_id(e.target.value)}
                                value={cus_id} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="cus_pwd" label="Password" variant="outlined"
                                fullWidth required onChange={(e) => setCus_pwd(e.target.value)}
                                value={cus_pwd} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="cus_mail" label="Email" variant="outlined"
                                fullWidth required onChange={(e) => setCus_mail(e.target.value)}
                                value={cus_mail} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="cus_port" label="Port" variant="outlined"
                                fullWidth required onChange={(e) => setCus_port(e.target.value)}
                                value={cus_port} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' variant="contained" fullWidth>Update</Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </React.Fragment>
    );
}
