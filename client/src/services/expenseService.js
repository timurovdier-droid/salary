import { api } from './api.js';

/**
 * Получить список расходов с фильтрацией и пагинацией
 * @param {Object} filters - параметры фильтрации (page, limit, category, dateFrom, dateTo)
 * @returns {Promise<Array>} массив расходов
 */
export const getExpenses = async (filters = {}) => {
  return await api.get('/expenses', filters);
};

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<Object>} объект расхода
 */
export const getExpenseById = async (id) => {
  return await api.get(`/expenses/${id}`);
};

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода (amount, date, category, comment, isRecurring)
 * @returns {Promise<Object>} созданный объект расхода
 */
export const addExpense = async (expenseData) => {
  return await api.post('/expenses', expenseData);
};

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} updatedData - обновлённые данные
 * @returns {Promise<Object>} обновлённый объект расхода
 */
export const updateExpense = async (id, updatedData) => {
  return await api.put(`/expenses/${id}`, updatedData);
};

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  await api.del(`/expenses/${id}`);
};