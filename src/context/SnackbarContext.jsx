import React, { createContext, useState, useContext, useCallback } from 'react';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'info' });

  const showSnackbar = useCallback((message, type = 'info') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }));
    }, 2000);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.show && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: snackbar.type === 'error' ? '#F44336' : '#333',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '24px',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          fontSize: '1rem',
          fontWeight: '500',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
