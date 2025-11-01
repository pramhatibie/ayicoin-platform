import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { Button } from './UI/Button';

export const TransferForm = () => {
  const { contract, tokenSymbol, refreshBalance } = useWeb3();
  const [transferAmount, setTransferAmount] = useState('10');
  const [transferTo, setTransferTo] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [transferLoading, setTransferLoading] = useState(false);

  const transferTokens = async () => {
    if (!contract) return;
    
    try {
      setTransferLoading(true);
      const tx = await contract.transfer(transferTo, ethers.parseUnits(transferAmount, 18));
      await tx.wait();
      
      alert(`Transfer berhasil! ${transferAmount} ${tokenSymbol} terkirim`);
      await refreshBalance(); // Refresh balance setelah transfer
      
    } catch (error) {
      console.error("Transfer gagal:", error);
      alert("Transfer gagal: " + error.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const quickTransfer = (amount) => {
    setTransferAmount(amount.toString());
  };

  return (
    <div style={{
      background: '#161b22',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3>🔄 Transfer Tokens</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Amount ({tokenSymbol}): </label>
        <input 
          type="number" 
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          style={{
            padding: '8px',
            margin: '0 10px',
            borderRadius: '5px',
            border: '1px solid #30363d',
            background: '#0d1117',
            color: 'white'
          }}
        />
        
        <div style={{ marginTop: '10px' }}>
          <strong>Quick Transfer:</strong>
          {[10, 50, 100, 500].map(amount => (
            <Button 
              key={amount}
              onClick={() => quickTransfer(amount)}
              variant="secondary"
              style={{ margin: '0 5px', padding: '5px 10px' }}
            >
              {amount}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>To Address: </label>
        <input 
          type="text" 
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          style={{
            padding: '8px',
            width: '400px',
            borderRadius: '5px',
            border: '1px solid #30363d',
            background: '#0d1117',
            color: 'white'
          }}
        />
      </div>

      <Button 
        onClick={transferTokens}
        disabled={transferLoading}
        variant="primary"
      >
        {transferLoading ? '🔄 Processing...' : `🚀 Transfer ${transferAmount} ${tokenSymbol}`}
      </Button>
    </div>
  );
};