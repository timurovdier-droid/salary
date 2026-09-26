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
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Получить доход по ID
 */
export const getById = (id) => {
  const stmt = db.prepare('SELECT * FROM incomes WHERE id = ?');
  const row = stmt.get(id);
  return mapRow(row);
};

/**
 * Получить список доходов с пагинацией и фильтрами
 */
export const getAllIncomes = (options = {}) => {
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
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM incomes ${whereClause}`);
  const { total } = countStmt.get(...params);

  // Получение данных с пагинацией
  const dataStmt = db.prepare(`
    SELECT * FROM incomes 
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
 * Создать новый доход
 */
export const createIncome = (data) => {
  const id = randomUUID();
  const stmt = db.prepare(`
    INSERT INTO incomes (id, amount, date, category, comment)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(id, data.amount, data.date, data.category, data.comment || '');
  
  return getById(id);
};

/**
 * Обновить существующий доход
 */
export const updateIncome = (id, data) => {
  const stmt = db.prepare(`
    UPDATE incomes 
    SET amount = ?, date = ?, category = ?, comment = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  
  const result = stmt.run(data.amount, data.date, data.category, data.comment || '', id);
  
  // Если ни одна строка не была обновлена, значит запись не найдена
  if (result.changes === 0) return null;
  
  return getById(id);
};

/**
 * Удалить доход по ID
 */
export const deleteIncome = (id) => {
  const stmt = db.prepare('DELETE FROM incomes WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};