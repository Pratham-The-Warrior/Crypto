import express from "express";
import getPrediction from "../services/openaiService.js";

const router = express.Router();

router.post("/predict", async (req, res) => {
  const { name, current_price, price_change_percentage_24h, change_24h } =
    req.body;

  console.log("📩 Incoming /predict request:", req.body);

  // Support both "price_change_percentage_24h" and "change_24h"
  const change = price_change_percentage_24h ?? change_24h;

  // Validate required fields
  if (!name || current_price === undefined || change === undefined) {
    const missingFields = { name, current_price, change };
    console.warn("⚠️ Missing required fields:", missingFields);

    return res.status(400).json({
      error: "Missing required fields",
      received: missingFields,
    });
  }

  try {
    const prediction = await getPrediction({
      name,
      current_price,
      price_change_percentage_24h: change,
    });

    console.log(`✅ Prediction generated for ${name}:`, prediction);
    return res.json({ prediction });
  } catch (err) {
    console.error("🔥 Error in /predict route:", err);
    return res.status(500).json({
      error: "Prediction failed",
      details: err.message,
    });
  }
});

export default router;
