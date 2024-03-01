import React, { useState, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Profile from "./Profile";

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // แปลงเป็น boolean

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isLoaded, setIsLoaded] = useState(true);
  // เราให้ user เป็นอ็อบเจกต์ว่างเริ่มต้น
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#222222' }}>
          <Toolbar>
            <img style={{ height: '60px', width: '200px' }} src="./logo.png" alt="Description of the image" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 4 }}>

            </Typography>
            <React.Fragment>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Link href="/payment" underline="none" >
                  <Typography sx={{ minWidth: 100, coler: '#ffff' }}>Pay</Typography>
                </Link>
                <Link href="/tradingViewWidget" underline="none" >
                <Typography sx={{ minWidth: 100 }}>View</Typography>
                </Link>
                <Link href="/product" underline="none" >
                <Typography sx={{ minWidth: 100 }}>Product</Typography>
                </Link>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>{user.cus_id[0]}</Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link href="/profile">
                  <MenuItem onClick={handleClose}>
                    <Avatar /> Profile
                  </MenuItem>
                </Link>
                {/* <Link href="/">
                  <MenuItem onClick={handleClose}>
                    <Avatar /> My acount
                  </MenuItem>
                </Link> */}
                {isAdmin ? (
                  <Link href="/data">
                    <MenuItem onClick={handleClose}>
                      <Avatar /> Admin
                    </MenuItem>
                  </Link>
                ) : null}
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>



          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}