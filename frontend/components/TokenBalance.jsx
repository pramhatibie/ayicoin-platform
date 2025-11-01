import { useWeb3 } from '../context/Web3Context';

export const TokenBalance = () => {
  const { account, balance, tokenName, tokenSymbol } = useWeb3();

  return (
    <div style={{
      background: '#161b22',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3>👤 Account Info</h3>
      <p><strong>Address:</strong> {account}</p>
      <p><strong>Balance:</strong> <span style={{color: '#58a6ff', fontSize: '24px'}}>{balance} {tokenSymbol}</span></p>
      <p><strong>Token:</strong> {tokenName} ({tokenSymbol})</p>
    </div>
  );
};