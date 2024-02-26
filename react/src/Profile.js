import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Profile = () => {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [isLoaded, setIsLoaded] = useState(true);
    // เราให้ user เป็นอ็อบเจกต์ว่างเริ่มต้น
    const [user, setUser] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // กรณีไม่มี token ให้ทำการ redirect ไปยังหน้า login
            navigate('/');
            return;
        }

        // รายละเอียดเรื่องการเรียกใช้ API ควรมีการส่ง token อย่างเหมาะสม
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
                    // เพิ่มเงื่อนไขเพื่อตรวจสอบ cus_id เท่ากับ "admin" และนำทางไปยังหน้า "/data"
                if (result.userData[0].cus_id === "admin") {
                    navigate('/data');
                }
                } else if (result.status === 403) {
                    MySwal.fire({
                        html: <i>Token Forbidden</i>,
                        icon: 'error'
                    }).then(() => {
                        // หลังจากแจ้งเตือนแล้วให้ทำการ redirect ไปยังหน้า login
                        navigate('/');
                    })
                }
                console.log(result);
            })
            .catch((error) => console.error(error));

    }, []);

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    if (isLoaded) return (<div>Loading...</div>);
    else {
        return (
            <>
            <Navbar />
            <div>
                
                <div>{user.cus_id}</div>
                <div>{user.cus_mail}</div>
                <div>{user.cus_port}</div>
                <div>{user.regis_time}</div>
                <div><button onClick={logout}>logout</button></div>
            </div>
            </>
        )
    }
}

export default Profile;
