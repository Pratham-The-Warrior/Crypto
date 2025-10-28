// ✅ Use ESM syntax consistently (make sure package.json has "type": "module")
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Binance from "binance-api-node";
import openaiRoute from "./Routes/openaiRoute.js"; // OpenAI route

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ====== OpenAI Route ======
app.use("/api/openai", openaiRoute);

// ====== Binance Client Setup ======
const client = Binance.default({
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

// ===== API Endpoints =====

// ✅ Get the manual mapping
app.get("/api/coin-binance-map", (req, res) => {
  res.json(coinBinanceMap);
});

// ✅ Get account balances
app.get("/api/balance", async (req, res) => {
  try {
    const account = await client.accountInfo();
    res.json(account.balances);
  } catch (error) {
    console.error("Balance Error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// ✅ Place market order
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

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
