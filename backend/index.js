const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Binance = require("binance-api-node").default;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Binance Spot API
const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// ===== Manual Mapping: CoinGecko ID -> Binance Symbol =====
const coinBinanceMap = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  cardano: "ADAUSDT",
  solana: "SOLUSDT",
  ripple: "XRPUSDT",
  polkadot: "DOTUSDT",
  dogecoin: "DOGEUSDT",
  litecoin: "LTCUSDT",
  tron: "TRXUSDT",
  avalanche: "AVAXUSDT",
  chainlink: "LINKUSDT",
  stellar: "XLMUSDT",
};

// Endpoint to get the manual mapping
app.get("/api/coin-binance-map", (req, res) => {
  res.json(coinBinanceMap);
});

// 🪙 Get account balances
app.get("/api/balance", async (req, res) => {
  try {
    const account = await client.accountInfo();
    res.json(account.balances);
  } catch (error) {
    console.error("Balance Error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// 💰 Place market order
app.post("/api/order", async (req, res) => {
  const { symbol, side, quantity } = req.body;

  try {
    const order = await client.order({
      symbol,
      side,
      type: "MARKET",
      quantity,
    });
    res.json(order);
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
