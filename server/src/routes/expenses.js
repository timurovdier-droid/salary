import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/expenseController.js';
import { validateTransaction } from '../middleware/validate.js';

const router = Router();

// GET /api/v1/expenses — получить список расходов
router.get('/', getAll);

// GET /api/v1/expenses/:id — получить расход по ID
router.get('/:id', getById);

// POST /api/v1/expenses — создать новый расход (с валидацией)
router.post('/', validateTransaction('expense'), create);

// PUT /api/v1/expenses/:id — обновить расход (с валидацией)
router.put('/:id', validateTransaction('expense'), update);

// DELETE /api/v1/expenses/:id — удалить расход
router.delete('/:id', remove);

export default router;