import React from "react";
import "./Navbar.css";
import arrow_icon from "../../assets/arrow_icon.png";
import { CoinContext } from "../../context/CoinContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  };

  return (
    <div className="navbar">
      <Link to={`/`} className="logo-link">
        <div className="logo-container">
          <span className="logo-icon">💠</span>
          <h1 className="logo-text">Coin<span className="logo-accent">Hub</span></h1>
        </div>
      </Link>
      <ul>
        <li><Link to={`/`}>Home</Link></li>
        <li><Link to={`/features`}>Features</Link></li>
        <li><Link to={`/news`}>News</Link></li>
      </ul>
      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <Link to="/signup">
          <button className="signup-btn">
            Sign Up <img src={arrow_icon} alt="arrow icon" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
