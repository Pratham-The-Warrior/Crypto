import express from "express";
import { getPrediction } from "../services/openaiService.js";

const router = express.Router();

router.post("/predict", async (req, res) => {
  // Log everything you get from the frontend
  console.log("📩 Received prediction request:", req.body);

  const { name, current_price, price_change_percentage_24h, change_24h } =
    req.body;

  // Accept either "price_change_percentage_24h" or "change_24h"
  const change = price_change_percentage_24h ?? change_24h;

  // ✅ Validate inputs
  if (!name || current_price === undefined || change === undefined) {
    console.log("❌ Missing required fields:", { name, current_price, change });
    return res.status(400).json({
      error: "Missing required fields",
      received: { name, current_price, change },
    });
  }

  try {
    const prediction = await getPrediction({
      name,
      current_price,
      price_change_percentage_24h: change,
    });

    console.log(`✅ Prediction for ${name}:`, prediction);

    res.json({ prediction });
  } catch (error) {
    console.error("🔥 Prediction route error:", error.message);
    res
      .status(500)
      .json({ error: "Prediction failed", details: error.message });
  }
});

export default router;
