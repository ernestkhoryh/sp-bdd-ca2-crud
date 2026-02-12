import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Attach token to authenticated requests (except login/register)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuthOpenRoute = config.url?.includes('/user/login') || config.url?.includes('/user/register');

  if (token && !isAuthOpenRoute) {
    const normalizedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    config.headers.Authorization = `Bearer ${normalizedToken}`;
  }

  return config;
});

// Response interceptor: Handle 401s globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('token');
      window.location.href = '/user/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default api;