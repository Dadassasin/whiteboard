'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '@/app/lib/clientAuth';
import { toast } from 'react-toastify'; // Импорт функции для уведомлений

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      router.push('/dashboard'); // Перенаправляем на dashboard, если токен валиден
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        toast.success('Успешный вход!'); // Уведомление об успешном входе
        router.push('/dashboard');
      } else if (response.status === 400 || response.status === 401) {
        setErrorMessage(data.errors ? data.errors.join(', ') : data.message);
        toast.error(data.message || 'Ошибка входа'); // Уведомление об ошибке
      } else {
        setErrorMessage(data.message || 'Ошибка входа');
        toast.error(data.message || 'Ошибка входа'); // Уведомление об ошибке
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка. Попробуйте позже.');
      toast.error('Произошла ошибка. Попробуйте позже.'); // Уведомление об ошибке
    }
  };

  return (
      <div className="flex min-h-screen font-sans items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Войти</h2>

          {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {errorMessage}
              </div>
          )}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Электронная почта
              </label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите вашу почту"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Пароль
              </label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ваш пароль"
                  required
              />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Войти
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
  );
}