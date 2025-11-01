export const Button = ({ 
    children, 
    onClick, 
    disabled = false, 
    variant = 'primary',
    ...props 
  }) => {
    const baseStyle = {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '5px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s'
    };
  
    const variants = {
      primary: {
        backgroundColor: '#238636',
        color: 'white'
      },
      secondary: {
        backgroundColor: '#21262d',
        color: 'white',
        border: '1px solid #30363d'
      }
    };
  
    return (
      <button 
        style={{ ...baseStyle, ...variants[variant] }}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };