import { api } from './api.js';

/**
 * Получить список доходов с фильтрацией и пагинацией
 */
export const getIncomes = async (filters = {}) => {
  const data = await api.get('/incomes', filters);
  // Добавляем поле type к каждой записи
  if (Array.isArray(data)) {
    return data.map(item => ({ ...item, type: 'income' }));
  }
  return data;
};

/**
 * Получить доход по ID
 */
export const getIncomeById = async (id) => {
  const data = await api.get(`/incomes/${id}`);
  if (data) {
    return { ...data, type: 'income' };
  }
  return data;
};

/**
 * Добавить новый доход
 */
export const addIncome = async (incomeData) => {
  // Удаляем поле type перед отправкой на бэкенд (оно там не нужно)
  const { type, ...dataToSend } = incomeData;
  return await api.post('/incomes', dataToSend);
};

/**
 * Обновить существующий доход
 */
export const updateIncome = async (id, updatedData) => {
  const { type, ...dataToSend } = updatedData;
  return await api.put(`/incomes/${id}`, dataToSend);
};

/**
 * Удалить доход по ID
 */
export const deleteIncome = async (id) => {
  await api.del(`/incomes/${id}`);
};