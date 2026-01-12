import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import Footer from "./components/Footer/Footer";
import Feature from "./pages/Features/Feature";
import SignUp from "./pages/signUp/signUp";
import SignIn from "./pages/SignIn/SignIn";
import NewsPage from "./pages/News/NewsPage";

import { useContext } from "react";
import { CoinContext } from "./context/CoinContext";

const App = () => {
  const { visualMode } = useContext(CoinContext);

  return (
    <div className="app">
      <div style={{ display: visualMode === 'zen' ? 'none' : 'block' }}>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Feature />} />
        <Route path="/coin/:coinId" element={<Coin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
