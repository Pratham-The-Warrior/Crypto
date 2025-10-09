import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Initially show 10 coins
  const [input, setInput] = useState("");

  const inputHandler = (event) => {
    setInput(event.target.value);
  };

  // search bar functionality added
  const searchHandler = (event) => {
    event.preventDefault();
    const coins = allCoin.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(coins);
  };

  useEffect(() => {
    // Only slice if not searching
    if (input.trim() === "") {
      setDisplayCoin(allCoin.slice(0, visibleCount));
    }
  }, [allCoin, visibleCount, input]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10); // Show 10 more coins
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>
          Largest <br /> Crypto Exchange
        </h1>
        <p>
          Welcome to the World's best cryptocurrency Exchange.
          <br />
          Sign up to explore more...
        </p>
        <form onSubmit={searchHandler}>
          <input
            onChange={inputHandler}
            list="coinlist"
            value={input}
            type="text"
            placeholder="Search Crypto Currencies..."
            required
          />
          <datalist id="coinlist">
            {allCoin.map((item, index) => (
              <option value={item.name} key={index} />
            ))}
          </datalist>
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        <div className="table-layout table-header">
          <p>#</p>
          <p>Crypto-Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24hrs Change</p>
          <p>Prediction</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {displayCoin.map((item, index) => (
          <Link to={`/coin/${item.id}`} className="table-layout" key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={item.name} />
              <p>{`${item.name} - ${item.symbol.toUpperCase()}`}</p>
            </div>
            <p>
              {currency.symbol}
              {item.current_price?.toLocaleString() ?? "N/A"}
            </p>
            <p
              className={item.price_change_percentage_24h > 0 ? "green" : "red"}
            >
              {item.price_change_percentage_24h
                ? item.price_change_percentage_24h.toFixed(2)
                : "0.00"}
              %
            </p>
            <p>Positive</p> {/* Added column cell */}
            <p className="market-cap">
              {currency.symbol}
              {item.market_cap?.toLocaleString() ?? "N/A"}
            </p>
          </Link>
        ))}

        {/* Load More Button */}
        {input.trim() === "" && visibleCount < allCoin.length && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
