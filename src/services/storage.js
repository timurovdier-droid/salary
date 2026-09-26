/**
 * Безопасная обёртка над localStorage
 * Обрабатывает случаи, когда localStorage недоступен или содержит невалидные данные
 */

// Ключи для хранения данных
export const STORAGE_KEYS = {
  INCOMES: 'incomes',
  EXPENSES: 'expenses'
};

/**
 * Получение данных из localStorage
 * @param {string} key - ключ хранилища
 * @param {*} defaultValue - значение по умолчанию, если данных нет
 * @returns {*} распарсенные данные или defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    const parsed = JSON.parse(item);
    return parsed ?? defaultValue;
  } catch (error) {
    console.error(`Ошибка чтения из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Сохранение данных в localStorage
 * @param {string} key - ключ хранилища
 * @param {*} value - данные для сохранения
 * @returns {boolean} true, если сохранение успешно
 */
export const saveToStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Ошибка записи в localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Удаление данных из localStorage
 * @param {string} key - ключ хранилища
 * @returns {boolean} true, если удаление успешно
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Очистка всех данных приложения
 * @returns {boolean} true, если очистка успешна
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Ошибка очистки localStorage:', error);
    return false;
  }
};

/**
 * Генерация уникального идентификатора
 * Использует crypto.randomUUID() если доступен, иначе fallback
 * @returns {string} уникальный ID
 */
export const generateId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (error) {
    console.warn('crypto.randomUUID недоступен, используем fallback');
  }
  
  // Fallback: генерация UUID v4 вручную
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Получение массива из localStorage с гарантией возврата массива
 * @param {string} key - ключ хранилища
 * @returns {Array} массив данных или пустой массив
 */
export const getArrayFromStorage = (key) => {
  const data = getFromStorage(key, []);
  return Array.isArray(data) ? data : [];
};