import React, { useContext, useEffect, useState } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";
import TradeForm from "../../components/TradeForm/TradeForm";

const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const Coin = () => {
  const { coinId } = useParams();
  const { currency } = useContext(CoinContext);

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [coinBinanceMap, setCoinBinanceMap] = useState({});
  const [canTrade, setCanTrade] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);

  // Balance states
  const [balances, setBalances] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(null);

  // === Fetch coin details ===
  const fetchCoinData = async () => {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
      const res = await fetch(url, {
        headers: { "x-cg-demo-api-key": COINGECKO_API_KEY },
      });
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error("Error fetching coin data:", err);
    }
  };

  // === Fetch historical chart ===
  const fetchHistoricalData = async () => {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=30`;
      const res = await fetch(url, {
        headers: { "x-cg-demo-api-key": COINGECKO_API_KEY },
      });
      const data = await res.json();
      setHistoricalData(data);
    } catch (err) {
      console.error("Error fetching historical data:", err);
    }
  };

  // === Fetch Binance mapping ===
  const fetchMapping = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/binance/coin-binance-map"
      );
      const data = await res.json();
      setCoinBinanceMap(data);
    } catch (err) {
      console.error("Failed to fetch coin-binance map:", err);
    }
  };

  // === Fetch balances ===
  const handleCheckBalance = async () => {
    setLoadingBalance(true);
    setBalanceError(null);
    try {
      const res = await fetch("http://localhost:5000/api/binance/balance");
      if (!res.ok) throw new Error("Failed to fetch balances");
      const data = await res.json();

      const nonZero = data.filter(
        (b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0
      );
      setBalances(
        nonZero.length > 0
          ? nonZero
          : [{ asset: "All", free: "0", locked: "0" }]
      );
    } catch (err) {
      setBalanceError(err.message);
    } finally {
      setLoadingBalance(false);
    }
  };

  // === Lifecycle ===
  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
    fetchMapping();
  }, [coinId, currency]);

  // === Determine if tradable ===
  useEffect(() => {
    if (coinData && Object.keys(coinBinanceMap).length > 0) {
      setCanTrade(!!coinBinanceMap[coinData.id]);
    }
  }, [coinData, coinBinanceMap]);

  const handleTradeClick = () => setShowTradeForm(true);

  if (!coinData || !historicalData)
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
      </div>

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Current Price</li>
          <li>
            {currency.symbol}
            {coinData.market_data.current_price[currency.name].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol}
            {coinData.market_data.market_cap[currency.name].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24hr High</li>
          <li>
            {coinData.market_data.high_24h[currency.name].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24hr Low</li>
          <li>
            {coinData.market_data.low_24h[currency.name].toLocaleString()}
          </li>
        </ul>

        <div className="trade-section">
          {canTrade && !showTradeForm && (
            <>
              <button className="trade-btn" onClick={handleTradeClick}>
                Trade {coinData.symbol.toUpperCase()} on Binance
              </button>
              <button
                className="balance-btn"
                onClick={handleCheckBalance}
                style={{ marginLeft: "10px" }}
              >
                {loadingBalance ? "Checking..." : "Check Balance"}
              </button>
            </>
          )}

          {showTradeForm && (
            <div className="trade-form-container">
              <TradeForm initialSymbol={coinBinanceMap[coinData.id]} />
            </div>
          )}

          {balanceError && (
            <p style={{ color: "red" }}>Error: {balanceError}</p>
          )}

          {balances.length > 0 && (
            <table className="balance-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Free</th>
                  <th>Locked</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((coin) => (
                  <tr key={coin.asset}>
                    <td>{coin.asset}</td>
                    <td
                      className={
                        parseFloat(coin.free) === 0 ? "zero-balance" : ""
                      }
                    >
                      {coin.free}
                    </td>
                    <td
                      className={
                        parseFloat(coin.locked) === 0 ? "zero-balance" : ""
                      }
                    >
                      {coin.locked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coin;
