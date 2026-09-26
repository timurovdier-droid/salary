import { getArrayFromStorage, saveToStorage, generateId, STORAGE_KEYS } from './storage';

/**
 * Получить все доходы
 * @returns {Array} массив доходов
 */
export const getIncomes = () => {
  return getArrayFromStorage(STORAGE_KEYS.INCOMES);
};

/**
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Object|null} объект дохода или null
 */
export const getIncomeById = (id) => {
  if (!id) return null;
  
  const incomes = getIncomes();
  return incomes.find(income => income.id === id) ?? null;
};

/**
 * Добавить новый доход
 * @param {Object} incomeData - данные дохода (category, amount, date, comment)
 * @returns {Object} созданный объект дохода с ID
 */
export const addIncome = (incomeData) => {
  const incomes = getIncomes();
  
  const newIncome = {
    id: generateId(),
    type: 'income',
    category: incomeData.category || 'other',
    amount: parseFloat(incomeData.amount) || 0,
    date: incomeData.date || new Date().toISOString().split('T')[0],
    comment: incomeData.comment || '',
    createdAt: new Date().toISOString()
  };
  
  incomes.unshift(newIncome); // Добавляем в начало списка
  saveToStorage(STORAGE_KEYS.INCOMES, incomes);
  
  return newIncome;
};

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} updatedData - обновлённые данные
 * @returns {Object|null} обновлённый объект дохода или null, если не найден
 */
export const updateIncome = (id, updatedData) => {
  if (!id) return null;
  
  const incomes = getIncomes();
  const index = incomes.findIndex(income => income.id === id);
  
  if (index === -1) return null;
  
  const updatedIncome = {
    ...incomes[index],
    category: updatedData.category ?? incomes[index].category,
    amount: parseFloat(updatedData.amount) ?? incomes[index].amount,
    date: updatedData.date ?? incomes[index].date,
    comment: updatedData.comment ?? incomes[index].comment,
    updatedAt: new Date().toISOString()
  };
  
  incomes[index] = updatedIncome;
  saveToStorage(STORAGE_KEYS.INCOMES, incomes);
  
  return updatedIncome;
};

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {boolean} true, если удаление успешно
 */
export const deleteIncome = (id) => {
  if (!id) return false;
  
  const incomes = getIncomes();
  const filtered = incomes.filter(income => income.id !== id);
  
  if (filtered.length === incomes.length) return false; // Не найден
  
  saveToStorage(STORAGE_KEYS.INCOMES, filtered);
  return true;
};

/**
 * Получить доходы за определённый период
 * @param {string} dateFrom - начальная дата (YYYY-MM-DD)
 * @param {string} dateTo - конечная дата (YYYY-MM-DD)
 * @returns {Array} массив доходов за период
 */
export const getIncomesByPeriod = (dateFrom, dateTo) => {
  const incomes = getIncomes();
  
  return incomes.filter(income => {
    const incomeDate = income.date;
    if (dateFrom && incomeDate < dateFrom) return false;
    if (dateTo && incomeDate > dateTo) return false;
    return true;
  });
};

/**
 * Получить доходы за текущий месяц
 * @returns {Array} массив доходов за текущий месяц
 */
export const getCurrentMonthIncomes = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateFrom = `${year}-${month}-01`;
  const dateTo = `${year}-${month}-31`;
  
  return getIncomesByPeriod(dateFrom, dateTo);
};