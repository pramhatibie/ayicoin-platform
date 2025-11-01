import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useTheme } from '../context/ThemeContext';
import { Button } from './UI/Button';

export const StakingPanel = () => {
  const { balance, tokenSymbol } = useWeb3();
  const theme = useTheme();
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaked, setIsStaked] = useState(false);
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewards, setRewards] = useState('12.5');

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    // Simulate staking
    setIsStaked(true);
    setStakedBalance(stakeAmount);
    setStakeAmount('');
    
    alert(`🎉 Berhasil stake ${stakeAmount} ${tokenSymbol}!`);
  };

  const handleUnstake = () => {
    // Simulate unstaking
    setIsStaked(false);
    setStakedBalance('0');
    setRewards('0');
    
    alert(`✅ Berhasil unstake ${stakedBalance} ${tokenSymbol}!`);
  };

  const handleClaimRewards = () => {
    alert(`🎁 Claimed ${rewards} ${tokenSymbol} rewards!`);
    setRewards('0');
  };

  return (
    <div style={{
      background: theme.surface,
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`,
      marginBottom: '20px'
    }}>
      <h3 style={{ color: theme.accent, marginBottom: '20px' }}>🎯 Staking Rewards</h3>
      
      {!isStaked ? (
        // Stake Form
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label>Amount to Stake ({tokenSymbol}): </label>
            <input 
              type="number" 
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder={`Available: ${balance} ${tokenSymbol}`}
              style={{
                padding: '8px',
                margin: '0 10px',
                borderRadius: '5px',
                border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`,
                background: theme.background,
                color: theme.text,
                width: '200px'
              }}
            />
          </div>
          
          <div style={{ 
            background: theme.background, 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '15px',
            border: `1px solid ${theme.isDark ? '#30363d' : '#d0d7de'}`
          }}>
            <div><strong>APY:</strong> 15%</div>
            <div><strong>Lock Period:</strong> 7 days</div>
            <div><strong>Min Stake:</strong> 10 {tokenSymbol}</div>
          </div>

          <Button 
            onClick={handleStake}
            disabled={!stakeAmount || parseFloat(stakeAmount) < 10}
            variant="primary"
          >
            🚀 Stake {tokenSymbol}
          </Button>
        </div>
      ) : (
        // Staking Info
        <div>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: theme.textSecondary }}>Staked</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stakedBalance} {tokenSymbol}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: theme.textSecondary }}>Rewards</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3fb950' }}>{rewards} {tokenSymbol}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleClaimRewards} variant="primary">
              🎁 Claim Rewards
            </Button>
            <Button onClick={handleUnstake} variant="secondary">
              ⏏️ Unstake
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};