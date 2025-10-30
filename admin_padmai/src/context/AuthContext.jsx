import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    const savedToken = localStorage.getItem('token');
    
    if (authStatus === 'true' && savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try backend API first
      const response = await api.login(email, password);
      
      if (response.success && response.data.token) {
        setIsAuthenticated(true);
        setToken(response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', response.data.token);
        return true;
      }
    } catch (error) {
      console.error('Backend login failed:', error);
    }
    
    // Fallback to hardcoded credentials
    if (email === 'admin@gmail.com' && password === 'Test@1234') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
