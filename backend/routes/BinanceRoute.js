import express from "express";
import {
  coinBinanceMap,
  getAccountBalances,
  placeMarketOrder,
} from "../services/BinanceService.js";

const router = express.Router();

// Get the manual mapping
router.get("/coin-binance-map", (req, res) => {
  res.json(coinBinanceMap);
});

// Get account balances
router.get("/balance", async (req, res) => {
  try {
    const balances = await getAccountBalances();
    res.json(balances);
  } catch (error) {
    console.error("❌ Binance Balance Error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// Place market order
router.post("/order", async (req, res) => {
  const { symbol, side, quantity } = req.body;

  if (!symbol || !side || !quantity) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  try {
    const order = await placeMarketOrder(symbol, side, quantity);
    res.json(order);
  } catch (error) {
    console.error("❌ Binance Order Error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

export default router;
