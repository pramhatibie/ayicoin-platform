// src/components/WalletConnect.jsx
import { useWeb3 } from '../context/Web3Context';
import { Button } from './UI/Button';

export const WalletConnect = () => {
  const { connectToHardhat, isLoading, isConnected, connectionError } = useWeb3();

  const handleConnect = async () => {
    console.log('Connecting to Hardhat...');
    const success = await connectToHardhat();
    console.log('Connection result:', success, 'isConnected:', isConnected);
  };

  return (
    <div className="wallet-connect-container" style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      padding: '2rem'
    }}>
      <h2>Connect Your Wallet</h2>
      <p>Connect to Hardhat network to start creating tokens</p>
      
      <Button 
        onClick={handleConnect}
        disabled={isLoading}
        variant="primary"
        style={{ marginTop: '1rem' }}
      >
        {isLoading ? '🔄 Connecting...' : '🔗 Connect to Hardhat'}
      </Button>
      
      {isLoading && (
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Please check MetaMask for connection requests...
        </p>
      )}
      
      {connectionError && (
        <p style={{ marginTop: '1rem', color: 'red' }}>
          Error: {connectionError}
        </p>
      )}
    </div>
  );
};