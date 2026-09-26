import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/incomeController.js';
import { validateTransaction } from '../middleware/validate.js';

const router = Router();

// GET /api/v1/incomes — получить список доходов
router.get('/', getAll);

// GET /api/v1/incomes/:id — получить доход по ID
router.get('/:id', getById);

// POST /api/v1/incomes — создать новый доход (с валидацией)
router.post('/', validateTransaction('income'), create);

// PUT /api/v1/incomes/:id — обновить доход (с валидацией)
router.put('/:id', validateTransaction('income'), update);

// DELETE /api/v1/incomes/:id — удалить доход
router.delete('/:id', remove);

export default router;