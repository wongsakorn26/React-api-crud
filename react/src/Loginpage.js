import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Loginpage.css'; // Import CSS file

const Loginpage = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [inputs, setInputs] = useState({});
    // const apiUrl = process.env.REACT_APP_API_URL;
  // console.log(`API URL: ${apiUrl}`);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "cus_id": inputs.username,
      "cus_pwd": inputs.password
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/login", requestOptions);
      const result = await response.json();
      if (result.userData) {
        MySwal.fire({
          html: <i>Successful</i>,
          icon: 'success'
        }).then(() => {

            localStorage.setItem('token', result.accessToken);
            navigate('/profile');
          
         
        });
      } else {
        MySwal.fire({
          html: <i>Error</i>,
          icon: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        html: <i>Error</i>,
        icon: 'error'
      });
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={inputs.username || ""}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={inputs.password || ""}
          onChange={handleChange}
        />
        <input type="submit" value="Sign in" />
      </form>
      <div className="sign-up-link">
        <a href="./create">Sign up</a>
      </div>
    </div>
  )
}

export default Loginpage;
