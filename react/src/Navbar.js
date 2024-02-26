import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';


export default function ButtonAppBar() {
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#222222' }}>
        <Toolbar>
          <Link href='/'><img style={{ height: '60px', width: '200px' }} src="./logo.png" alt="Description of the image" /></Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 4 }}>

          </Typography>
          
  
        
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}