import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Настраиваем профиль нагрузки (Ramp-up -> Fixed -> Ramp-down)
  stages: [
    { duration: '30s', target: 215 }, // Плавный разгон до 50 виртуальных юзеров
    { duration: '1m', target: 215 },  // Держим нагрузку стабильно 1 минуту
    { duration: '30s', target: 0 },  // Плавное затухание
  ],
  // Задаем те самые пороги качества (Thresholds)
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% запросов должны быть быстрее 500мс
    http_req_failed: ['rate==0'],     // Ошибок должно быть строго 0%
  },
};

export default function () {
  // Выполняем GET-запрос к твоему лендингу
  const res = http.get('https://antonfedotov.com'); 
  
  // Проверяем, что сервер ответил кодом 200 (Всё ОК)
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  // Пауза 1 секунда между запросами каждого пользователя (имитация реального поведения)
  sleep(1);
}