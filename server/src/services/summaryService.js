import db from '../db/connection.js';

/**
 * Получить общий баланс (доходы - расходы)
 */
export const getBalance = () => {
  const incomeRow = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM incomes').get();
  const expenseRow = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses').get();
  
  const totalIncome = Number(incomeRow.total);
  const totalExpense = Number(expenseRow.total);
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  };
};

/**
 * Получить суммы по категориям для круговой диаграммы
 * @param {string} type - 'income' или 'expense'
 * @param {string} dateFrom - начальная дата (опционально)
 * @param {string} dateTo - конечная дата (опционально)
 */
export const getByCategory = (type, dateFrom, dateTo) => {
  const table = type === 'income' ? 'incomes' : 'expenses';
  
  let query = `SELECT category, SUM(amount) as total FROM ${table}`;
  const params = [];
  
  // Динамическое добавление фильтров по дате
  if (dateFrom || dateTo) {
    query += ' WHERE ';
    const conditions = [];
    if (dateFrom) { 
      conditions.push('date >= ?'); 
      params.push(dateFrom); 
    }
    if (dateTo) { 
      conditions.push('date <= ?'); 
      params.push(dateTo); 
    }
    query += conditions.join(' AND ');
  }
  
  query += ' GROUP BY category ORDER BY total DESC';
  
  return db.prepare(query).all(...params).map(row => ({
    name: row.category, // Для совместимости с recharts
    value: Number(row.total)
  }));
};

/**
 * Получить помесячную сводку для столбчатого графика
 * @param {number} monthsCount - количество последних месяцев
 */
export const getByMonth = (monthsCount = 6) => {
  // Получаем список уникальных месяцев из обеих таблиц
  const monthsStmt = db.prepare(`
    SELECT DISTINCT strftime('%Y-%m', date) as month FROM incomes
    UNION
    SELECT DISTINCT strftime('%Y-%m', date) as month FROM expenses
    ORDER BY month DESC LIMIT ?
  `);
  
  // reverse() чтобы идти от старых к новым (слева направо на графике)
  const months = monthsStmt.all(monthsCount).map(r => r.month).reverse();
  
  const result = [];
  
  for (const month of months) {
    // Получаем суммы за конкретный месяц
    const inc = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM incomes WHERE strftime('%Y-%m', date) = ?"
    ).get(month).total;
    
    const exp = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE strftime('%Y-%m', date) = ?"
    ).get(month).total;
    
    // Форматирование месяца для отображения (например, "сен 2026")
    const dateObj = new Date(`${month}-01`);
    const monthLabel = dateObj.toLocaleDateString('ru-RU', { 
      month: 'short', 
      year: 'numeric' 
    });

    result.push({
      month: monthLabel,
      income: Number(inc),
      expense: Number(exp)
    });
  }
  
  return result;
};