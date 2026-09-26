import db from '../db/connection.js';
import { randomUUID } from 'crypto';

// Вспомогательная функция для маппинга snake_case из БД в camelCase для JSON
const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    comment: row.comment,
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Получить расход по ID
 */
export const getById = (id) => {
  const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
  const row = stmt.get(id);
  return mapRow(row);
};

/**
 * Получить список расходов с пагинацией и фильтрами
 */
export const getAllExpenses = (options = {}) => {
  // Значения по умолчанию для пагинации
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(options.limit) || 10));
  const offset = (page - 1) * limit;

  const { category, dateFrom, dateTo } = options;

  // Динамическое построение WHERE
  let whereClause = 'WHERE 1=1';
  const params = [];

  if (category) {
    whereClause += ' AND category = ?';
    params.push(category);
  }
  if (dateFrom) {
    whereClause += ' AND date >= ?';
    params.push(dateFrom);
  }
  if (dateTo) {
    whereClause += ' AND date <= ?';
    params.push(dateTo);
  }

  // Получение общего количества записей для пагинации
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM expenses ${whereClause}`);
  const { total } = countStmt.get(...params);

  // Получение данных с пагинацией
  const dataStmt = db.prepare(`
    SELECT * FROM expenses 
    ${whereClause} 
    ORDER BY date DESC, created_at DESC 
    LIMIT ? OFFSET ?
  `);
  
  const rows = dataStmt.all(...params, limit, offset);

  return {
    data: rows.map(mapRow),
    total,
    page,
    limit
  };
};

/**
 * Создать новый расход
 */
export const createExpense = (data) => {
  const id = randomUUID();
  const stmt = db.prepare(`
    INSERT INTO expenses (id, amount, date, category, comment, is_recurring)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, 
    data.amount, 
    data.date, 
    data.category, 
    data.comment || '', 
    data.isRecurring ? 1 : 0
  );
  
  return getById(id);
};

/**
 * Обновить существующий расход
 */
export const updateExpense = (id, data) => {
  const stmt = db.prepare(`
    UPDATE expenses 
    SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  
  const result = stmt.run(
    data.amount, 
    data.date, 
    data.category, 
    data.comment || '', 
    data.isRecurring ? 1 : 0, 
    id
  );
  
  // Если ни одна строка не была обновлена, значит запись не найдена
  if (result.changes === 0) return null;
  
  return getById(id);
};

/**
 * Удалить расход по ID
 */
export const deleteExpense = (id) => {
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};