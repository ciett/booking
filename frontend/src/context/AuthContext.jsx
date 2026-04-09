import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('booking_token');
    const userInfo = localStorage.getItem('booking_user');
    
    if (token && userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        localStorage.removeItem('booking_token');
        localStorage.removeItem('booking_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem('booking_token', token);
    localStorage.setItem('booking_user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('booking_token');
    localStorage.removeItem('booking_user');
    localStorage.removeItem('booking_user_id');
    localStorage.removeItem('booking_name');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('booking_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}