import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

// Функция-фабрика для создания middleware валидации
export const validateTransaction = (type) => {
  return (req, res, next) => {
    const { amount, date, category } = req.body;
    
    // Определяем список разрешённых категорий в зависимости от типа операции
    const allowedCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const categoryIds = allowedCategories.map(c => c.id);

    // Валидация суммы (должна быть числом и больше 0)
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      const err = new Error('Сумма должна быть положительным числом');
      err.statusCode = 400;
      return next(err);
    }

    // Валидация даты (формат YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      const err = new Error('Дата должна быть в формате YYYY-MM-DD');
      err.statusCode = 400;
      return next(err);
    }

    // Валидация категории
    if (!category || !categoryIds.includes(category)) {
      const err = new Error(`Недопустимая категория. Разрешены: ${categoryIds.join(', ')}`);
      err.statusCode = 400;
      return next(err);
    }

    // Если все проверки пройдены, передаём управление дальше
    next();
  };
};