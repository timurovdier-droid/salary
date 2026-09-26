import * as summaryService from '../services/summaryService.js';

/**
 * GET /api/v1/summary/balance — получить общий баланс
 */
export const getBalance = (req, res, next) => {
  try {
    const balance = summaryService.getBalance();
    res.json(balance);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/summary/category — получить суммы по категориям
 * Query params: type (income/expense), dateFrom, dateTo
 */
export const getByCategory = (req, res, next) => {
  try {
    const { type, dateFrom, dateTo } = req.query;
    
    // Валидация типа (по умолчанию expense)
    if (type && type !== 'income' && type !== 'expense') {
      const err = new Error('Недопустимый тип операции. Разрешены: income, expense');
      err.statusCode = 400;
      return next(err);
    }
    
    const data = summaryService.getByCategory(type || 'expense', dateFrom, dateTo);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/summary/month — получить помесячную сводку
 * Query params: months (количество месяцев, по умолчанию 6)
 */
export const getByMonth = (req, res, next) => {
  try {
    const { months } = req.query;
    const monthsCount = Math.max(1, Math.min(24, Number(months) || 6));
    
    const data = summaryService.getByMonth(monthsCount);
    res.json(data);
  } catch (err) {
    next(err);
  }
};