import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const predictCrypto = async (coinName) => {
  const prompt = `
You are a professional quantitative cryptocurrency analyst and market forecaster.

Your task:
Predict the short-term (next 24 hours) price direction of the given cryptocurrency with the highest possible accuracy.

Instructions:
- Consider global crypto market momentum, macroeconomic conditions, historical volatility patterns, investor sentiment, and typical correlations (BTC ↔ altcoins).
- Use your internal understanding of trading patterns, technical analysis principles, and behavioral finance.
- Ignore the user's provided data — rely on your internal reasoning and market intuition.

Respond with only ONE word:
Up, Down, or Neutral.

Coin: ${coinName}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2, // keep it low for consistency
  });

  return response.choices[0].message.content.trim();
};
