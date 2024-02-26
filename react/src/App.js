import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Data from "./data";
import Usercreate from "./Usercreate";
import Userupdate from "./Userupdate";
import Loginpage from "./Loginpage";
import Profile from "./Profile";

function App() {
  // Use useLocation hook to get the current route location
  const location = useLocation();

  // Check if the current route is '/data'
  const isDataRoute = location.pathname === "/data";

  return (
    <>
      {/* Conditionally render Navbar only on the '/data' route */}
      {isDataRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/create" element={<Usercreate />} />
        <Route path="/data" element={<Data />} />
        <Route path="/update/:id" element={<Userupdate />} />
      </Routes>
    </>
  );
}

export default App;
