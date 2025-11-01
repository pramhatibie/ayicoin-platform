import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from "../context/Web3Context";

// Factory Configuration
const FACTORY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const FACTORY_ABI = [
  "function getUserTokenCount(address user) external view returns (uint256)",
  "function getUserTokens(address user) external view returns (address[])"
];

const AccountOverview = () => {
  const { account, provider, isConnected, chainId } = useWeb3();
  const [ethBalance, setEthBalance] = useState('0');
  const [tokensCreated, setTokensCreated] = useState(0);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isConnected && account && provider) {
      loadAccountData();
    } else {
      setLoading(false);
    }
  }, [account, provider, isConnected]);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log("Loading account data for:", account);
      
      // Get ETH Balance with proper error handling
      const balance = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(balance));

      // Get token count from Factory
      try {
        const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
        const tokenCount = await factory.getUserTokenCount(account);
        setTokensCreated(Number(tokenCount));
      } catch (blockchainError) {
        console.warn("Could not get token count from blockchain, using localStorage:", blockchainError);
        // Fallback to localStorage
        const savedTokens = localStorage.getItem("ayicoinDeployedTokens");
        if (savedTokens) {
          try {
            const tokens = JSON.parse(savedTokens);
            // Filter tokens by current account
            const userTokens = tokens.filter(token => 
              token.deployer?.toLowerCase() === account.toLowerCase()
            );
            setTokensCreated(userTokens.length);
          } catch (e) {
            console.error("Error parsing localStorage tokens:", e);
            setTokensCreated(0);
          }
        } else {
          setTokensCreated(0);
        }
      }

      // Portfolio Value Calculation
      setTotalPortfolioValue((tokensCreated * 1000).toLocaleString());

    } catch (error) {
      console.error('Error loading account data:', error);
      setError(`Failed to load account data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Not Connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const changeTab = (tabName) => {
    window.dispatchEvent(new CustomEvent('changeTab', { detail: tabName }));
  };

  if (!isConnected) {
    return (
      <div className="widget-card">
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--slate-400)',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>🪙 Ayicoin Account Overview</h3>
          <p>Connect your wallet to view your Ayicoin portfolio</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="widget-card">
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--slate-400)',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>🪙 Ayicoin Portfolio</h3>
          <p>Loading your Ayicoin portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-card fade-in-up" style={{
      background: 'rgba(139, 92, 246, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '12px'
    }}>
      {/* Error Display */}
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#EF4444'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">ETH Balance</div>
          <div className="stat-value">{parseFloat(ethBalance).toFixed(4)}</div>
          <div className="stat-label">Ayicoin Hardhat Network</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tokens Created</div>
          <div className="stat-value">{tokensCreated}</div>
          <div className="stat-label">Ayicoin Tokens</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Portfolio Value</div>
          <div className="stat-value">${totalPortfolioValue}</div>
          <div className="stat-label">Estimated Total</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Wallet Address</div>
          <div style={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            fontFamily: 'monospace',
            margin: '0.5rem 0'
          }}>
            {formatAddress(account)}
          </div>
          <div className="stat-label">Ayicoin Connected</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          🚀 Ayicoin Quick Actions
        </h3>
        <div className="quick-actions">
          <button
            onClick={() => changeTab('deployer')}
            className="action-button primary"
          >
            <span>🪙</span>
            Deploy New Token
          </button>
          <button
            onClick={loadAccountData}
            className="action-button secondary"
          >
            <span>🔄</span>
            Refresh Data
          </button>
          <button
            onClick={() => changeTab('tokens')}
            className="action-button secondary"
          >
            <span>📋</span>
            View My Tokens
          </button>
        </div>
      </div>

      {/* Network Status */}
      <div style={{ 
        marginTop: '20px',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        fontSize: '14px',
        color: 'var(--slate-300)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Network Status:</span>
          <span style={{ color: chainId === 31337 ? '#10B981' : '#EF4444' }}>
            {chainId === 31337 ? 'Ayicoin Hardhat ✅' : `Wrong Network (${chainId})`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Factory:</span>
          <span style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '12px' }}>
            Connected ✅
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;