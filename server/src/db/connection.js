import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

// Получаем директорию текущего модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Убеждаемся, что папка для базы данных существует (например, server/data)
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Инициализация подключения к SQLite
const db = new Database(config.dbPath);

// Включаем режим WAL (Write-Ahead Logging) для лучшей производительности
db.pragma('journal_mode = WAL');

// Чтение и выполнение SQL-скрипта для создания таблиц
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schemaSql);

console.log('База данных инициализирована, таблицы готовы к работе');

export default db;