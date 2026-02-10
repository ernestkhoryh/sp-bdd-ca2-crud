import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Attach token to ADMIN requests only
api.interceptors.request.use(config => {
  // Only add token to paths containing '/admin/'
  if (config.url?.includes('/user/')) {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401s globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/user/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default api;