import { getIncomes, getIncomesByPeriod, getCurrentMonthIncomes } from './incomeService';
import { getExpenses, getExpensesByPeriod, getCurrentMonthExpenses } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { getMonthKey } from '../utils/formatters';

/**
 * Получить общий баланс (доходы - расходы)
 * @returns {number} баланс
 */
export const getBalance = () => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const totalIncome = incomes.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  
  return totalIncome - totalExpense;
};

/**
 * Получить баланс за определённый период
 * @param {string} dateFrom - начальная дата (YYYY-MM-DD)
 * @param {string} dateTo - конечная дата (YYYY-MM-DD)
 * @returns {Object} объект с totalIncome, totalExpense и balance
 */
export const getBalanceForPeriod = (dateFrom, dateTo) => {
  const incomes = getIncomesByPeriod(dateFrom, dateTo);
  const expenses = getExpensesByPeriod(dateFrom, dateTo);
  
  const totalIncome = incomes.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  };
};

/**
 * Получить баланс за текущий месяц
 * @returns {Object} объект с totalIncome, totalExpense и balance
 */
export const getCurrentMonthBalance = () => {
  const incomes = getCurrentMonthIncomes();
  const expenses = getCurrentMonthExpenses();
  
  const totalIncome = incomes.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  };
};

/**
 * Получить данные по категориям для круговой диаграммы
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {string} dateFrom - начальная дата (опционально)
 * @param {string} dateTo - конечная дата (опционально)
 * @returns {Array} массив объектов { name, value } для графика
 */
export const getByCategory = (type = 'expense', dateFrom, dateTo) => {
  const transactions = type === 'income' 
    ? getIncomesByPeriod(dateFrom, dateTo)
    : getExpensesByPeriod(dateFrom, dateTo);
  
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  // Группировка сумм по категориям
  const grouped = {};
  transactions.forEach(transaction => {
    const categoryId = transaction.category || 'other';
    grouped[categoryId] = (grouped[categoryId] ?? 0) + (transaction.amount ?? 0);
  });
  
  // Преобразование в формат для графика
  return categories
    .map(cat => ({
      name: cat.label,
      value: grouped[cat.id] ?? 0
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
};

/**
 * Получить помесячную сводку для столбчатого графика
 * @param {number} monthsCount - количество месяцев (по умолчанию 6)
 * @returns {Array} массив объектов { month, income, expense }
 */
export const getMonthlySummary = (monthsCount = 6) => {
  const now = new Date();
  const result = [];
  
  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dateFrom = `${year}-${month}-01`;
    
    // Последний день месяца
    const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
    const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    
    const incomes = getIncomesByPeriod(dateFrom, dateTo);
    const expenses = getExpensesByPeriod(dateFrom, dateTo);
    
    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount ?? 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + (item.amount ?? 0), 0);
    
    // Форматирование месяца для отображения (например, "Сен 2026")
    const monthLabel = date.toLocaleDateString('ru-RU', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    result.push({
      month: monthLabel,
      income: totalIncome,
      expense: totalExpense
    });
  }
  
  return result;
};

/**
 * Получить последние N транзакций (доходы + расходы)
 * @param {number} limit - количество транзакций (по умолчанию 5)
 * @returns {Array} массив последних транзакций, отсортированных по дате
 */
export const getRecentTransactions = (limit = 5) => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const all = [...incomes, ...expenses]
    .sort((a, b) => {
      // Сортировка по дате (новые сначала)
      const dateCompare = (b.date || '').localeCompare(a.date || '');
      if (dateCompare !== 0) return dateCompare;
      // Если даты равны, сортируем по времени создания
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    })
    .slice(0, limit);
  
  return all;
};