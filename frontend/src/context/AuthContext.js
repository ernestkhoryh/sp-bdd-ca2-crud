import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('auth_token');
    return token ? { token, user: null, loading: true } : { token: null, user: null, loading: false };
  });

  useEffect(() => {
    if (authState.token) {
      // Verify token with your backend's verifyToken endpoint
      authService.verifyToken(authState.token)
        .then(user => setAuthState(prev => ({ ...prev, user, loading: false })))
        .catch(() => logout());
    }
  }, [authState.token]);

  const login = async (credentials) => {
    const { token, user } = await authService.login(credentials); // Calls loginModelByCred
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token', token);
    setAuthState({ token, user, loading: false });
    return user;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('token');
    setAuthState({ token: null, user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);