import * as expenseService from '../services/expenseService.js';

/**
 * GET /api/v1/expenses — получить список расходов с пагинацией и фильтрами
 */
export const getAll = (req, res, next) => {
  try {
    const { page, limit, category, dateFrom, dateTo } = req.query;
    const result = expenseService.getAllExpenses({
      page,
      limit,
      category,
      dateFrom,
      dateTo
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/expenses/:id — получить расход по ID
 */
export const getById = (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = expenseService.getById(id);
    
    if (!expense) {
      const err = new Error('Расход не найден');
      err.statusCode = 404;
      return next(err);
    }
    
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/expenses — создать новый расход
 */
export const create = (req, res, next) => {
  try {
    const expense = expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/expenses/:id — обновить расход
 */
export const update = (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = expenseService.updateExpense(id, req.body);
    
    if (!expense) {
      const err = new Error('Расход не найден');
      err.statusCode = 404;
      return next(err);
    }
    
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/expenses/:id — удалить расход
 */
export const remove = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = expenseService.deleteExpense(id);
    
    if (!deleted) {
      const err = new Error('Расход не найден');
      err.statusCode = 404;
      return next(err);
    }
    
    // Возвращаем 204 No Content при успешном удалении
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};