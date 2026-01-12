import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import marketRoute from "./routes/MarketRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();

// ====== Security & Performance Middleware ======
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // Request logging

// ====== Routes ======
app.use("/api/market", marketRoute);

// Health Check
app.use("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ====== Error Handling ======
app.use(errorMiddleware);

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Crypto Terminal Backend running on http://localhost:${PORT}`);
});
