import { getArrayFromStorage, saveToStorage, generateId, STORAGE_KEYS } from './storage';

/**
 * Получить все расходы
 * @returns {Array} массив расходов
 */
export const getExpenses = () => {
  return getArrayFromStorage(STORAGE_KEYS.EXPENSES);
};

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Object|null} объект расхода или null
 */
export const getExpenseById = (id) => {
  if (!id) return null;
  
  const expenses = getExpenses();
  return expenses.find(expense => expense.id === id) ?? null;
};

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода (category, amount, date, comment)
 * @returns {Object} созданный объект расхода с ID
 */
export const addExpense = (expenseData) => {
  const expenses = getExpenses();
  
  const newExpense = {
    id: generateId(),
    type: 'expense',
    category: expenseData.category || 'other',
    amount: parseFloat(expenseData.amount) || 0,
    date: expenseData.date || new Date().toISOString().split('T')[0],
    comment: expenseData.comment || '',
    createdAt: new Date().toISOString()
  };
  
  expenses.unshift(newExpense); // Добавляем в начало списка
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  
  return newExpense;
};

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} updatedData - обновлённые данные
 * @returns {Object|null} обновлённый объект расхода или null, если не найден
 */
export const updateExpense = (id, updatedData) => {
  if (!id) return null;
  
  const expenses = getExpenses();
  const index = expenses.findIndex(expense => expense.id === id);
  
  if (index === -1) return null;
  
  const updatedExpense = {
    ...expenses[index],
    category: updatedData.category ?? expenses[index].category,
    amount: parseFloat(updatedData.amount) ?? expenses[index].amount,
    date: updatedData.date ?? expenses[index].date,
    comment: updatedData.comment ?? expenses[index].comment,
    updatedAt: new Date().toISOString()
  };
  
  expenses[index] = updatedExpense;
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  
  return updatedExpense;
};

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {boolean} true, если удаление успешно
 */
export const deleteExpense = (id) => {
  if (!id) return false;
  
  const expenses = getExpenses();
  const filtered = expenses.filter(expense => expense.id !== id);
  
  if (filtered.length === expenses.length) return false; // Не найден
  
  saveToStorage(STORAGE_KEYS.EXPENSES, filtered);
  return true;
};

/**
 * Получить расходы за определённый период
 * @param {string} dateFrom - начальная дата (YYYY-MM-DD)
 * @param {string} dateTo - конечная дата (YYYY-MM-DD)
 * @returns {Array} массив расходов за период
 */
export const getExpensesByPeriod = (dateFrom, dateTo) => {
  const expenses = getExpenses();
  
  return expenses.filter(expense => {
    const expenseDate = expense.date;
    if (dateFrom && expenseDate < dateFrom) return false;
    if (dateTo && expenseDate > dateTo) return false;
    return true;
  });
};

/**
 * Получить расходы за текущий месяц
 * @returns {Array} массив расходов за текущий месяц
 */
export const getCurrentMonthExpenses = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateFrom = `${year}-${month}-01`;
  const dateTo = `${year}-${month}-31`;
  
  return getExpensesByPeriod(dateFrom, dateTo);
};