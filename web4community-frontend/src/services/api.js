import axios from 'axios';
// URL base de nuestra API backend
const API_URL = 'http://localhost:5000/api';
// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor: se ejecuta ANTES de cada petición
// Agrega automáticamente el token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Interceptor: se ejecuta DESPUÉS de cada respuesta
// Maneja errores de autenticación (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
