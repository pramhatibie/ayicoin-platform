import { GlassCard } from '../UI/GlassCard';

import { colors, gradients} from "./colors.jsx";

export const TokenPreview = ({ name = 'Ayicoin', symbol = 'AYI', supply = '1000000' }) => {
  return (
    <GlassCard style={{
      textAlign: 'center',
      margin: '20px 0',
      background: 'rgba(139, 92, 246, 0.1)',
      border: `1px solid ${colors.brand.purple[500]}20`
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0',
        color: colors.brand.purple[500],
        fontSize: '18px'
      }}>
        Token Preview
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: gradients.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          {symbol?.charAt(0) || 'A'}
        </div>
        
        <div style={{ textAlign: 'left' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: 'white'
          }}>
            {name || 'Your Token'}
          </div>
          <div style={{ 
            color: colors.slate[400],
            fontSize: '14px'
          }}>
            {symbol || 'SYMBOL'}
          </div>
        </div>
      </div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        color: colors.slate[300]
      }}>
        Total Supply: {parseInt(supply).toLocaleString()} {symbol || 'TOKENS'}
      </div>
    </GlassCard>
  );
};