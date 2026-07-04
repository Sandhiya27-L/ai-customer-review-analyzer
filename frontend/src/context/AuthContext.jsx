import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function getStoredUser() {
  const remember = localStorage.getItem('rememberMe') === 'true';
  const raw = remember
    ? localStorage.getItem('user')
    : sessionStorage.getItem('user') || localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function getStoredToken() {
  const remember = localStorage.getItem('rememberMe') === 'true';
  return remember
    ? localStorage.getItem('token')
    : sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (authData, rememberMe = false) => {
    const userData = {
      id: authData.userId,
      fullName: authData.fullName,
      email: authData.email,
    };

    localStorage.setItem('rememberMe', String(rememberMe));

    if (rememberMe) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('token', authData.token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setToken(authData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      const remember = localStorage.getItem('rememberMe') === 'true';
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
