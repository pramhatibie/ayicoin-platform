import { useState } from 'react';
import { colors } from '../colors.jsx';

export const ModernInput = ({ 
  label, 
  value, 
  onChange,
  placeholder,
  type = 'text',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <label
        style={{
          position: 'absolute',
          left: '12px',
          top: isFocused || value ? '-8px' : '12px',
          fontSize: isFocused || value ? '12px' : '16px',
          color: isFocused ? colors.brand.purple[500] : colors.slate[400],
          background: colors.slate[900],
          padding: '0 8px',
          transition: 'all 0.2s ease-in-out',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={isFocused ? placeholder : ''}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: `2px solid ${isFocused ? colors.brand.purple[500] : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '12px',
          color: 'white',
          fontSize: '16px',
          outline: 'none',
          transition: 'all 0.2s ease-in-out',
          ':focus': {
            borderColor: colors.brand.purple[500],
            boxShadow: `0 0 0 3px ${colors.brand.purple[500]}20`
          }
        }}
        {...props}
      />
    </div>
  );
};