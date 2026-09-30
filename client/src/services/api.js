// Базовый URL API из переменных окружения
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Вспомогательная функция для формирования query-строки из объекта параметров
const buildQueryString = (params) => {
  if (!params) return '';
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
};

// Основная функция для выполнения HTTP-запросов
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  
  // Настройка заголовков по умолчанию
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Если сервер вернул HTTP-ошибку (4xx, 5xx)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error?.message || `HTTP Error: ${response.status}`;
      throw new Error(message);
    }

    // Обработка ответа без тела (например, 204 No Content при успешном удалении)
    if (response.status === 204) {
      return null;
    }

    const json = await response.json();

    // Если бэкенд вернул ошибку в теле ответа (наш кастомный формат)
    if (json.error) {
      throw new Error(json.error.message);
    }

    // Возвращаем поле data, если оно есть (иначе весь объект для гибкости)
    return json.data !== undefined ? json.data : json;
    
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${path}]:`, error);
    throw error;
  }
};

// Экспортируемые методы для удобного вызова
export const api = {
  get: (path, params) => request(`${path}${buildQueryString(params)}`),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};