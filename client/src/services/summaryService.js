import { api } from './api.js';
import { getIncomes } from './incomeService.js';
import { getExpenses } from './expenseService.js';

/**
 * Получить баланс за текущий месяц
 */
export const getCurrentMonthBalance = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateFrom = `${year}-${month}-01`;
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

  const balance = await api.get('/summary/balance', { dateFrom, dateTo });
  
  return balance || { totalIncome: 0, totalExpense: 0, balance: 0 };
};

/**
 * Получить данные по категориям для круговой диаграммы
 */
export const getByCategory = async (type = 'expense', dateFrom, dateTo) => {
  const params = { type };
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;

  const data = await api.get('/summary/category', params);
  
  return Array.isArray(data) ? data : [];
};

/**
 * Получить помесячную сводку для столбчатого графика
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  const data = await api.get('/summary/month', { months: monthsCount });
  
  return Array.isArray(data) ? data : [];
};

/**
 * Получить последние N транзакций (доходы + расходы)
 */
export const getRecentTransactions = async (limit = 5) => {
  const [incomes, expenses] = await Promise.all([
    getIncomes({ limit, page: 1 }),
    getExpenses({ limit, page: 1 })
  ]);

  // Теперь у каждой записи есть поле type, добавленное в сервисах
  const all = [...(incomes || []), ...(expenses || [])]
    .sort((a, b) => {
      const dateCompare = (b.date || '').localeCompare(a.date || '');
      if (dateCompare !== 0) return dateCompare;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    })
    .slice(0, limit);

  return all;
};