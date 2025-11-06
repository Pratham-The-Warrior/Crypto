import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Track number of requests made
let requestCount = 0;
const MAX_REQUESTS = 20;

export const predictCrypto = async (coinName) => {
  if (requestCount >= MAX_REQUESTS) {
    console.warn("🚫 OpenAI request limit reached.");
    throw new Error(
      "OpenAI request limit reached (10 requests max). Please restart the server to reset."
    );
  }

  requestCount++;
  console.log(`🔮 OpenAI request #${requestCount} for: ${coinName}`);

  const prompt = `
You are an experienced quantitative cryptocurrency analyst with deep knowledge of market behavior, technical indicators, and investor psychology.

Your mission:
Predict the short-term (next 24 hours) price direction of the following cryptocurrency.

Guidelines:
- Weigh various factors differently in each analysis (e.g., momentum, news sentiment, liquidity, volatility, correlations with BTC or ETH, etc.).
- You may interpret market mood creatively — sometimes focus on technical signals, other times on psychological or macro patterns.
- Imagine you are reasoning through charts, order book dynamics, and trader behavior before deciding.
- Your reasoning should vary slightly each time, leading to diverse yet plausible predictions.
- Output strictly one word: **Up** or **Down** — no punctuation, no explanation.

Coin: ${coinName}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // more creative for diverse results
    });

    const prediction = response.choices[0].message.content.trim();
    console.log(`✅ Prediction for ${coinName}: ${prediction}`);
    return prediction;
  } catch (error) {
    console.error("🔥 OpenAI Prediction Error:", error);
    throw new Error("Failed to get prediction from OpenAI.");
  }
};

export const resetRequestCount = () => {
  requestCount = 0;
  console.log("🔄 OpenAI request count reset to 0.");
};

export default predictCrypto;
