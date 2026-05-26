import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Stub auth check
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ id: '1', username: 'demo', role: 'user' });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Stub login
    localStorage.setItem('access_token', 'demo_token');
    setUser({ id: '1', username: 'demo', role: 'user' });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
