import express from 'express';
import { getPriceComparison } from '../controllers/MarketController.js';

const router = express.Router();

router.get('/compare', getPriceComparison);

export default router;
