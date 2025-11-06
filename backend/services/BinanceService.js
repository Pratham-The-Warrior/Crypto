import Binance from "binance-api-node";
import dotenv from "dotenv";

dotenv.config();

// Initialize Binance client
const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// Manual mapping: CoinGecko ID -> Binance Symbol
export const coinBinanceMap = {
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

// ===== Binance Service Functions =====

export const getAccountBalances = async () => {
  const account = await client.accountInfo();
  return account.balances;
};

export const placeMarketOrder = async (symbol, side, quantity) => {
  return await client.order({
    symbol,
    side,
    type: "MARKET",
    quantity,
  });
};
