import { colors, gradients } from '../colors.jsx';

export const ModernButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    opacity: disabled ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden'
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  };

  const variants = {
    primary: {
      background: gradients.primary,
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)',
      ':hover': !disabled && !loading ? {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px 0 rgba(139, 92, 246, 0.6)'
      } : {}
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      ':hover': !disabled && !loading ? {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-1px)'
      } : {}
    },
    ghost: {
      background: 'transparent',
      color: colors.brand.purple[500],
      ':hover': !disabled && !loading ? {
        background: 'rgba(139, 92, 246, 0.1)'
      } : {}
    }
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...(variants[variant][':hover'] || {})
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </button>
  );
};