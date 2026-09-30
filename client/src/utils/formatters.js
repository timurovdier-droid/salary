/**
 * Форматирование суммы с валютой "сум"
 * @param {number} amount - сумма
 * @param {boolean} showSign - показывать знак + или -
 * @returns {string} отформатированная строка
 */
export const formatAmount = (amount, showSign = false) => {
  const value = amount ?? 0;
  const formatted = value.toLocaleString('ru-RU');
  
  if (showSign) {
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}${formatted} сум`;
  }
  
  return `${formatted} сум`;
};

/**
 * Форматирование даты в длинный читаемый формат
 * @param {string} dateString - строка даты (ISO или другая)
 * @returns {string} отформатированная дата, например "26 сентября 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

/**
 * Форматирование даты в короткий формат (для списков)
 * @param {string} dateString - строка даты
 * @returns {string} отформатированная дата, например "26.09.2026"
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

/**
 * Форматирование даты для графиков (месяц и год)
 * @param {string} dateString - строка даты
 * @returns {string} отформатированная дата, например "Сен 2026"
 */
export const formatMonthYear = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

/**
 * Получение ключа месяца для группировки (YYYY-MM)
 * @param {string} dateString - строка даты
 * @returns {string} ключ месяца, например "2026-09"
 */
export const getMonthKey = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  } catch (e) {
    return '';
  }
};

/**
 * Получение сегодняшней даты в формате YYYY-MM-DD
 * @returns {string} сегодняшняя дата
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};