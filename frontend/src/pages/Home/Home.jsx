import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [input, setInput] = useState("");

  const inputHandler = (event) => setInput(event.target.value);

  const searchHandler = (event) => {
    event.preventDefault();
    const coins = allCoin.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(coins);
  };

  useEffect(() => {
    if (input.trim() === "") {
      setDisplayCoin(allCoin.slice(0, visibleCount));
    }
  }, [allCoin, visibleCount, input]);

  const loadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="home">
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
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
      </motion.div>

      <div className="crypto-table">
        <div className="table-layout table-header">
          <p>#</p>
          <p>Crypto-Coins</p>
          <p>Price</p>
          <p>24hrs Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {displayCoin.map((item, index) => (
          <MotionLink
            to={`/coin/${item.id}`}
            className="table-layout"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
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
              className={
                item.price_change_percentage_24h > 0
                  ? "green"
                  : item.price_change_percentage_24h < 0
                    ? "red"
                    : ""
              }
            >
              {item.price_change_percentage_24h
                ? `${item.price_change_percentage_24h.toFixed(2)}% ${item.price_change_percentage_24h > 0 ? "🔼" : "🔽"
                }`
                : "0.00%"}
            </p>

            <p className="market-cap">
              {currency.symbol}
              {item.market_cap?.toLocaleString() ?? "N/A"}
            </p>
          </MotionLink>
        ))}

        {input.trim() === "" && visibleCount < allCoin.length && (
          <motion.div
            style={{ textAlign: "center", margin: "20px 0" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
