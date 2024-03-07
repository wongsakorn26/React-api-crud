import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Button, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

export default function Usercreate() {
    

    const handleSubmit = event => {
        event.preventDefault()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "cus_id": cus_id,
            "cus_pwd": cus_pwd,
            "cus_mail": cus_mail,
            "cus_port": cus_port
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(process.env.REACT_APP_API_URL + "/add", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                alert(result['message'])
                window.location.href = '/Loginpage'

            })
            .catch((error) => console.error(error));
    }
    const [cus_id, setCus_id] = useState('');
    const [cus_pwd, setCus_pwd] = useState('');
    const [cus_mail, setCus_mail] = useState('');
    const [cus_port, setCus_port] = useState('');

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ p: 2 }}>
                <Typography variant='h6' gutterBottom component='div'>
                    Sign up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField id="cus_id" label="Username" variant="outlined"
                                fullWidth required onChange={(e) => setCus_id(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField id="cus_pwd" label="Password" variant="outlined"
                                fullWidth required onChange={(e) => setCus_pwd(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="cus_mail" label="Email" variant="outlined"
                                fullWidth required onChange={(e) => setCus_mail(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="cus_port" label="Your Port Number" variant="outlined"
                                fullWidth required onChange={(e) => setCus_port(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} >
                            <Button type='submit' variant="contained" fullWidth>Create</Button>
                        </Grid>

                    </Grid>
                </form>
            </Container>
        </React.Fragment>
    );
}