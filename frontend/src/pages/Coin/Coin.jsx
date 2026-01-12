import React, { useContext, useEffect, useState } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";
import TradeForm from "../../components/TradeForm/TradeForm";
import { motion } from "framer-motion";

const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const Coin = () => {
  const { coinId } = useParams();
  const { currency, visualMode, setVisualMode } = useContext(CoinContext);

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [coinBinanceMap, setCoinBinanceMap] = useState({});
  const [canTrade, setCanTrade] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);

  // Balance states
  const [balances, setBalances] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(null);

  // Market Comparison State
  const [marketPrices, setMarketPrices] = useState([]);
  const [bestPrice, setBestPrice] = useState(null);
  const [loadingMarket, setLoadingMarket] = useState(false);

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

  // === Fetch Market Prices ===
  const fetchMarketPrices = async () => {
    if (!coinData) return;
    setLoadingMarket(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/market/compare?symbol=${coinData.symbol}`
      );
      const data = await res.json();
      if (data.allPrices) {
        setMarketPrices(data.allPrices);
        setBestPrice(data.bestPrice);
      }
    } catch (err) {
      console.error("Error fetching market prices:", err);
    } finally {
      setLoadingMarket(false);
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

  // === Determine if tradable & Fetch Market Prices ===
  useEffect(() => {
    if (coinData) {
      fetchMarketPrices();
      if (Object.keys(coinBinanceMap).length > 0) {
        setCanTrade(!!coinBinanceMap[coinData.id]);
      }
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
      <motion.div
        className="coin-name"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={coinData.image.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
        <button
          className="zen-toggle-btn"
          onClick={() => setVisualMode(visualMode === 'zen' ? 'normal' : 'zen')}
          title={visualMode === 'zen' ? "Exit Zen Mode" : "Dark Terminal Mode"}
        >
          {visualMode === 'zen' ? '✖ Exit' : '↗ Expand'}
        </button>
      </motion.div>

      {/* Top Section: Chart & Key Stats */}
      <div className="coin-content-grid">
        <motion.div
          className="coin-chart"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LineChart historicalData={historicalData} />
        </motion.div>

        <motion.div
          className="coin-stats-sidebar"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Current Price</span>
              <span className="stat-value">{currency.symbol}{coinData.market_data.current_price[currency.name].toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Market Cap</span>
              <span className="stat-value">{currency.symbol}{coinData.market_data.market_cap[currency.name].toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">24h High</span>
              <span className="stat-value">{coinData.market_data.high_24h[currency.name].toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">24h Low</span>
              <span className="stat-value">{coinData.market_data.low_24h[currency.name].toLocaleString()}</span>
            </div>
          </div>

          <div className="trade-actions-panel">
            <h3>Quick Actions</h3>

            <div className="action-buttons-grid">
              {/* Universal Actions */}
              <button className="action-btn" onClick={() => { fetchMarketPrices(); fetchCoinData(); }}>
                <span className="btn-icon">🔄</span> Refresh Data
              </button>

              <button className="action-btn" onClick={() => alert("Added to Watchlist (Simulator)")}>
                <span className="btn-icon">⭐</span> Watchlist
              </button>

              <button className="action-btn" onClick={() => alert("Price Alert Set (Simulator)")}>
                <span className="btn-icon">🔔</span> Set Alert
              </button>

              {/* Trade Actions - Conditional */}
              {canTrade && (
                <button className="action-btn primary" onClick={handleTradeClick}>
                  <span className="btn-icon">⚡</span> Trade Now
                </button>
              )}

              <button className="action-btn" onClick={handleCheckBalance}>
                <span className="btn-icon">💼</span> {loadingBalance ? "Checking..." : "My Wallet"}
              </button>
            </div>

            {showTradeForm && (
              <div className="embedded-trade-form">
                <TradeForm initialSymbol={coinBinanceMap[coinData.id]} />
              </div>
            )}

            {balanceError && <p className="error-msg">{balanceError}</p>}

            {balances.length > 0 && (
              <div className="mini-balance-list">
                <h4>Wallet Assets</h4>
                {balances.map((coin) => (
                  <div key={coin.asset} className="balance-row">
                    <span>{coin.asset}</span>
                    <span>{parseFloat(coin.free).toFixed(4)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Market Aggregator Section */}
      <motion.div
        className="market-terminal-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="market-terminal-header">
          <h2>Global Liquidity Aggregator</h2>
          <div className="live-pill">● Live Feed</div>
        </div>

        {loadingMarket ? (
          <div className="terminal-loading-state">
            <div className="loading-bar"></div>
            <span>Scanning 10+ CEX Nodes...</span>
          </div>
        ) : (
          <div className="aggregator-grid">
            {/* Best Price Spotlight */}
            {bestPrice && (
              <div className="spotlight-card">
                <div className="spotlight-label">Best Execution Price</div>
                <div className="spotlight-price">
                  {currency.symbol}{bestPrice.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="spotlight-exchange">
                  via {bestPrice.exchange.toUpperCase()}
                </div>
                <a href={bestPrice.url} target="_blank" rel="noopener noreferrer" className="execute-btn">
                  Execute Trade
                </a>
              </div>
            )}

            {/* Order Book / List */}
            <div className="order-book-panel">
              <div className="book-header">
                <span>Exchange</span>
                <span className="text-right">Price ({currency.symbol})</span>
                <span className="text-right">Volume</span>
                <span className="text-right">Action</span>
              </div>
              <div className="book-body">
                {marketPrices.map((market, index) => (
                  <div key={index} className={`book-row ${bestPrice && bestPrice.exchange === market.exchange ? 'best-row' : ''}`}>
                    <div className="col-ex">
                      <div className={`status-dot ${market.success ? 'online' : 'offline'}`}></div>
                      {market.exchange.toUpperCase()}
                    </div>
                    <div className="col-val text-right">
                      {market.success
                        ? market.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : '--'}
                    </div>
                    <div className="col-vol text-right">
                      {market.success && market.volume ? market.volume.toFixed(2) : '--'}
                    </div>
                    <div className="col-act text-right">
                      {market.success && (
                        <a href={market.url} target="_blank" rel="noopener noreferrer" className="link-arrow">↗</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Coin;
