import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 15px',
        background: 'transparent',
        border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
        borderRadius: '8px',
        color: 'inherit',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 1000
      }}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};