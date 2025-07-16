import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserId(decoded.id || decoded._id);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserId(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserId(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
    window.location.href = '/login'; // or use navigate if you have access
  };

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUserId(user?.id || user?._id || null);
  };

  const trackInteraction = (eventType, elementId, additionalData = {}) => {
    console.log('TRACKING EVENT:', {
      timestamp: new Date().toISOString(),
      userId: userId || 'undefined',
      eventType,
      elementId,
      currentPath: window.location.pathname,
      ...additionalData,
    });
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, userId, trackInteraction, handleLogout, handleLogin }}>
      {children}
    </AppContext.Provider>
  );
};