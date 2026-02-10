import api from './axiosConfig';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/user/login', credentials);
    if (response.data.token && response.data.user) {
      return response.data;
    }
    throw new Error('Invalid login response');
  },

  verifyToken: async (token) => {
    const response = await api.post('/authorization/verifyToken', { token });
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  }
};