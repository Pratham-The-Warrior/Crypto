import MarketService from '../services/MarketService.js';

/**
 * Controller for Market related terminal data
 */
export const getPriceComparison = async (req, res, next) => {
    try {
        const { symbol } = req.query;

        if (!symbol) {
            return res.status(400).json({
                status: 'error',
                message: 'Query parameter "symbol" is required'
            });
        }

        const data = await MarketService.getPriceComparison(symbol);

        res.json(data);
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};
