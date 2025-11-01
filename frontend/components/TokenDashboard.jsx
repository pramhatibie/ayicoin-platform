import { useTheme } from '../context/ThemeContext';

export const TokenDashboard = () => {
  const theme = useTheme();

  // Fake data untuk demo
  const tokenMetrics = {
    price: '$0.42',
    marketCap: '$4.2M',
    volume: '$125K',
    holders: '1,042',
    priceChange: '+5.2%'
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    }}>
      {/* Price Card */}
      <div style={{
        background: theme.surface,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: theme.textSecondary }}>Price</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.accent }}>{tokenMetrics.price}</div>
        <div style={{ 
          fontSize: '12px', 
          color: tokenMetrics.priceChange.includes('+') ? '#3fb950' : '#f85149'
        }}>
          {tokenMetrics.priceChange}
        </div>
      </div>

      {/* Market Cap */}
      <div style={{
        background: theme.surface,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: theme.textSecondary }}>Market Cap</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{tokenMetrics.marketCap}</div>
      </div>

      {/* Volume */}
      <div style={{
        background: theme.surface,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: theme.textSecondary }}>24h Volume</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{tokenMetrics.volume}</div>
      </div>

      {/* Holders */}
      <div style={{
        background: theme.surface,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: theme.textSecondary }}>Holders</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{tokenMetrics.holders}</div>
      </div>
    </div>
  );
};