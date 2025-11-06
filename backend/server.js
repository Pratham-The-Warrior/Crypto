import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import openaiRoute from "./routes/openaiRoute.js";
import binanceRoute from "./routes/BinanceRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ====== Routes ======
app.use("/api/openai", openaiRoute);
app.use("/api/binance", binanceRoute);

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
