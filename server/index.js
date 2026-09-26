import app from './src/app.js';
import { config } from './src/config/index.js';

// Запуск сервера
const server = app.listen(config.port, () => {
  console.log(`\n🚀 Сервер успешно запущен!`);
  console.log(` Порт: ${config.port}`);
  console.log(`🏥 Health check: http://localhost:${config.port}/health`);
  console.log(`💰 API Incomes: http://localhost:${config.port}/api/v1/incomes`);
  console.log(`💸 API Expenses: http://localhost:${config.port}/api/v1/expenses`);
  console.log(`📊 API Summary: http://localhost:${config.port}/api/v1/summary\n`);
});

// Обработка ошибок запуска (например, если порт уже занят)
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Ошибка: Порт ${config.port} уже используется.`);
    console.error('Завершите другой процесс или измените порт в server/src/config/index.js');
  } else {
    console.error('❌ Критическая ошибка запуска сервера:', error);
  }
  process.exit(1);
});