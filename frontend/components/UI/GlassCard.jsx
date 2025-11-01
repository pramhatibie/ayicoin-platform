

export const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  );
};