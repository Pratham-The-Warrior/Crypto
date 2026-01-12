import ccxt from 'ccxt';

class MarketService {
    constructor() {
        this.exchanges = {
            binance: new ccxt.binance({ timeout: 5000 }),
            coinbase: new ccxt.coinbase({ timeout: 5000 }),
            kraken: new ccxt.kraken({ timeout: 5000 }),
            okx: new ccxt.okx({ timeout: 5000 }),
            gateio: new ccxt.gateio({ timeout: 5000 }),
            huobi: new ccxt.huobi({ timeout: 5000 }),
            kucoin: new ccxt.kucoin({ timeout: 5000 }),
            bybit: new ccxt.bybit({ timeout: 5000 }),
            mexc: new ccxt.mexc({ timeout: 5000 }),
            bitget: new ccxt.bitget({ timeout: 5000 })
        };
    }

    /**
     * Fetch ticker from a single exchange with safety
     */
    async fetchExchangeTicker(name, exchange, pair) {
        try {
            const ticker = await exchange.fetchTicker(pair);
            return {
                exchange: name,
                price: ticker.last,
                volume: ticker.quoteVolume || ticker.baseVolume,
                url: exchange.urls.www,
                success: true
            };
        } catch (error) {
            // console.error(`[MarketService] Error fetching from ${name}:`, error.message);
            return {
                exchange: name,
                price: null,
                error: error.message,
                success: false
            };
        }
    }

    /**
     * Aggregates prices from 10+ exchanges concurrently
     */
    async getPriceComparison(symbol) {
        const pair = `${symbol.toUpperCase()}/USDT`;

        const promises = Object.entries(this.exchanges).map(([name, exchange]) =>
            this.fetchExchangeTicker(name, exchange, pair)
        );

        const results = await Promise.all(promises);
        const validResults = results.filter(r => r.success && r.price !== null);

        // Sort by price (lowest first for best buy)
        validResults.sort((a, b) => a.price - b.price);

        return {
            symbol: symbol.toUpperCase(),
            bestPrice: validResults[0] || null,
            allPrices: results // Include failures so UI can show 'offline' status
        };
    }
}

export default new MarketService();
