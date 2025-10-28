import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState({});

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

  // 🔮 OPENAI PREDICTION FUNCTION (calls backend)
  const getPrediction = async (coin) => {
    try {
      const response = await fetch("http://localhost:5000/api/openai/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: coin.name,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
        }),
      });

      const data = await response.json();
      const result = data.prediction?.trim() || "Neutral";

      setPredictions((prev) => ({
        ...prev,
        [coin.id]: result,
      }));
    } catch (error) {
      console.error("Prediction failed:", error);
      setPredictions((prev) => ({
        ...prev,
        [coin.id]: "Neutral",
      }));
    }
  };

  //  Fetch predictions ONLY for the top 10 visible coins
  useEffect(() => {
    const topTenCoins = displayCoin.slice(0, 10);
    topTenCoins.forEach((coin) => {
      if (!predictions[coin.id]) {
        getPrediction(coin);
      }
    });
  }, [displayCoin]);

  //  Helper function to show colored symbols
  const renderPrediction = (prediction) => {
    switch (prediction?.toLowerCase()) {
      case "up":
        return <span className="prediction up">🔼 Up</span>;
      case "down":
        return <span className="prediction down">🔽 Down</span>;
      case "neutral":
      default:
        return <span className="prediction neutral">⚪ Flat</span>;
    }
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

            {/* 🟢 Show prediction only for top 10 coins */}
            <p>
              {index < 10
                ? predictions[item.id]
                  ? renderPrediction(predictions[item.id])
                  : "⏳ Loading..."
                : "—"}
            </p>

            <p className="market-cap">
              {currency.symbol}
              {item.market_cap?.toLocaleString() ?? "N/A"}
            </p>
          </Link>
        ))}

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
