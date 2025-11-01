import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Theme styles
  const theme = {
    isDark,
    background: isDark ? '#0d1117' : '#ffffff',
    surface: isDark ? '#161b22' : '#f6f8fa',
    text: isDark ? '#ffffff' : '#1f2328',
    textSecondary: isDark ? '#8b949e' : '#656d76',
    accent: '#58a6ff',
    success: '#238636',
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{
        background: theme.background,
        color: theme.text,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};