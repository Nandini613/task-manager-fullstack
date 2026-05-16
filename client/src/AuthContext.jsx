import { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, expectedRole) => {
    const res = await api.post('/auth/login', { email, password, expectedRole });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    if (res.data.user.role === 'member') {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 3000);
    }
  };

  const register = async (name, email, password, role, secretKey) => {
    const res = await api.post('/auth/register', { name, email, password, role, secretKey });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    if (res.data.user.role === 'member') {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 3000);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, showWelcome }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
