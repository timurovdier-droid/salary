import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Импорты роутеров
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';

// Создаём экземпляр Express
const app = express();

// Подключение middleware для CORS (разрешаем запросы с фронтенда)
app.use(cors(config.corsOptions));

// Парсинг JSON из тела запроса
app.use(express.json());

// Простой health-check эндпоинт для проверки работы сервера
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Подключение роутов с префиксом /api/v1
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// Обработчик ошибок должен быть ПОСЛЕДНИМ middleware
app.use(errorHandler);

export default app;