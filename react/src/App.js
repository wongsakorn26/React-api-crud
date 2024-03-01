import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Data from "./data";
import Usercreate from "./Usercreate";
import Userupdate from "./Userupdate";
import Loginpage from "./Loginpage";
import Profile from "./Profile";
import Payment from "./Payment";
import TradingViewWidget from "./TradingViewWidget";
import Product from "./Product";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/create" element={<Usercreate />} />
        <Route path="/data" element={<Data />} />
        <Route path="/update/:id" element={<Userupdate />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product" element={<Product />} />
        <Route path="/tradingViewWidget" element={<TradingViewWidget />} />
      </Routes>
    </>
  );
}

export default App;
