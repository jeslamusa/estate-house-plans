import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  async function checkAuth() {
    try {
      const response = await api.get('/auth/me');
      setAdmin(response.data.admin);
    } catch (error) {
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, admin } = response.data;

      localStorage.setItem('adminToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(admin);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Export this **after** AuthContext is defined
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
