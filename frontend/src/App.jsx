import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import Footer from "./components/Footer/Footer";
import Feature from "./pages/Features/Feature";
import SignUp from "./pages/signUp/signUp";
import SignIn from "./pages/SignIn/SignIn";
import Pricing from "./pages/Pricing/Pricing";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Feature />} />
        <Route path="/coin/:coinId" element={<Coin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
