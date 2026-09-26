import { Router } from 'express';
import { getBalance, getByCategory, getByMonth } from '../controllers/summaryController.js';

const router = Router();

// GET /api/v1/summary/balance — получить общий баланс
router.get('/balance', getBalance);

// GET /api/v1/summary/category — получить суммы по категориям
router.get('/category', getByCategory);

// GET /api/v1/summary/month — получить помесячную сводку
router.get('/month', getByMonth);

export default router;