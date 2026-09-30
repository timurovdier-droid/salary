import app from './src/app.js';
import { config } from './src/config/index.js';

const server = app.listen(config.port, () => {
  console.log(`\n🚀 Сервер успешно запущен!`);
  console.log(` Порт: ${config.port}`);
  console.log(`🏥 Health check: http://localhost:${config.port}/health`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Ошибка: Порт ${config.port} уже используется.`);
  } else {
    console.error('❌ Критическая ошибка запуска сервера:', error);
  }
  process.exit(1);
});