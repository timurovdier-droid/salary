// Централизованный обработчик ошибок для Express
export const errorHandler = (err, req, res, next) => {
  // Логирование ошибки на сервере
  console.error(`[Error] ${req.method} ${req.url}:`, err.message || err);

  // Определяем статус код (по умолчанию 500)
  const statusCode = err.statusCode || 500;

  // Формируем единый формат ответа
  const errorResponse = {
    error: {
      code: statusCode,
      message: err.message || 'Внутренняя ошибка сервера',
    },
  };

  // Отправляем ответ клиенту
  res.status(statusCode).json(errorResponse);
};