import { useState, useEffect } from 'react';
import { useWeb3 } from "../context/Web3Context";
import { ethers } from 'ethers';

// ✅ CORRECT FACTORY ADDRESS
const FACTORY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const FACTORY_ABI = [
  "function getUserTokenCount(address user) external view returns (uint256)",
  "function getUserTokens(address user) external view returns (address[])",
  "function getTokenInfo(address tokenAddress) external view returns (tuple(address tokenAddress, string name, string symbol, uint256 initialSupply, uint256 maxSupply, uint256 creationTime, address owner, bool isActive))"
];

const MyDeployedTokens = () => {
  const { account, provider, isConnected } = useWeb3();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isConnected && account && provider) {
      loadDeployedTokens();
    } else {
      setLoading(false);
    }
  }, [account, provider, isConnected]);

  const loadDeployedTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading deployed tokens for:", account);
      
      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      
      // Try to get tokens from blockchain first
      try {
        const tokenCount = await factory.getUserTokenCount(account);
        console.log("Token count from blockchain:", tokenCount.toString());
        
        if (tokenCount > 0) {
          const tokenAddresses = await factory.getUserTokens(account);
          console.log("Token addresses from blockchain:", tokenAddresses);
          
          const tokenDetails = await loadTokenDetails(factory, tokenAddresses);
          setTokens(tokenDetails);
        } else {
          // Fallback to localStorage
          await loadFromLocalStorage();
        }
      } catch (blockchainError) {
        console.warn("Blockchain method failed, trying localStorage:", blockchainError);
        await loadFromLocalStorage();
      }
      
    } catch (error) {
      console.error('Error loading deployed tokens:', error);
      setError(error.message);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = async () => {
    // ✅ CORRECT LOCALSTORAGE KEY
    const savedTokens = localStorage.getItem("ayicoinDeployedTokens");
    if (savedTokens) {
      try {
        const tokensData = JSON.parse(savedTokens);
        console.log("Tokens from localStorage:", tokensData);
        
        // Use the data directly from localStorage (already has name, symbol, etc.)
        const formattedTokens = tokensData.map(token => ({
          address: token.address,
          name: token.name || 'Unknown Token',
          symbol: token.symbol || 'UNKNOWN',
          totalSupply: token.supply || '0',
          balance: token.supply || '0', // Assuming deployer gets all supply
          decimals: 18,
          loaded: true,
          timestamp: token.timestamp,
          template: token.template || 'Custom',
          features: token.features || {}
        }));
        
        setTokens(formattedTokens);
      } catch (parseError) {
        console.error("Error parsing localStorage tokens:", parseError);
        setError("Failed to load tokens from storage");
        setTokens([]);
      }
    } else {
      setTokens([]);
    }
  };

  const loadTokenDetails = async (factory, addresses) => {
    const tokenPromises = addresses.map(async (address) => {
      try {
        console.log(`Loading token details for: ${address}`);
        
        // Try to get info from factory first (more reliable)
        try {
          const tokenInfo = await factory.getTokenInfo(address);
          return {
            address,
            name: tokenInfo.name || 'Unknown Token',
            symbol: tokenInfo.symbol || 'UNKNOWN',
            totalSupply: tokenInfo.initialSupply ? ethers.formatUnits(tokenInfo.initialSupply, 18) : '0',
            balance: tokenInfo.initialSupply ? ethers.formatUnits(tokenInfo.initialSupply, 18) : '0',
            decimals: 18,
            loaded: true,
            timestamp: tokenInfo.creationTime ? Number(tokenInfo.creationTime) * 1000 : Date.now(),
            template: 'Custom' // Default for blockchain-loaded tokens
          };
        } catch (factoryError) {
          console.warn(`Could not get token info from factory for ${address}, trying direct contract...`);
          
          // Fallback to direct token contract
          const tokenABI = [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function totalSupply() view returns (uint256)",
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)"
          ];

          const tokenContract = new ethers.Contract(address, tokenABI, provider);
          
          const [name, symbol, totalSupply, balance, decimals] = await Promise.allSettled([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.totalSupply(),
            tokenContract.balanceOf(account),
            tokenContract.decimals()
          ]);

          return {
            address,
            name: name.status === 'fulfilled' ? name.value : 'Unknown Token',
            symbol: symbol.status === 'fulfilled' ? symbol.value : 'UNKNOWN',
            totalSupply: totalSupply.status === 'fulfilled' 
              ? ethers.formatUnits(totalSupply.value, decimals.value || 18)
              : '0',
            balance: balance.status === 'fulfilled'
              ? ethers.formatUnits(balance.value, decimals.value || 18)
              : '0',
            decimals: decimals.status === 'fulfilled' ? decimals.value : 18,
            loaded: true,
            template: 'Custom'
          };
        }
      } catch (tokenError) {
        console.error(`Error loading token ${address}:`, tokenError);
        return {
          address,
          name: 'Failed to Load',
          symbol: 'ERROR',
          totalSupply: '0',
          balance: '0',
          decimals: 18,
          loaded: false,
          error: true,
          template: 'Unknown'
        };
      }
    });

    return Promise.all(tokenPromises);
  };

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  const getTemplateIcon = (templateName) => {
    const templateIcons = {
      'Meme Token': '🐶',
      'Utility Token': '🛠️',
      'Governance Token': '🗳️',
      'Stablecoin Template': '💰',
      'NFT Utility Token': '🎨',
      'GameFi Token': '🎮',
      'Custom': '🎨',
      'Unknown': '❓'
    };
    return templateIcons[templateName] || '🎨';
  };

  if (!isConnected) {
    return (
      <div className="token-list-container">
        <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          My Deployed Tokens
        </h2>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--slate-400)',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px'
        }}>
          <p>Please connect your wallet to view your deployed tokens</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="token-list-container">
        <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          My Deployed Tokens
        </h2>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--slate-400)',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px'
        }}>
          Loading your Ayicoin tokens...
        </div>
      </div>
    );
  }

  return (
    <div className="token-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: '1.8rem',
          fontWeight: '700',
          margin: 0
        }}>
          🪙 My Ayicoin Tokens
        </h2>
        <button
          onClick={loadDeployedTokens}
          className="action-button secondary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#ef4444'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {tokens.length > 0 ? (
        <div>
          <div className="token-list-header" style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            marginBottom: '1rem',
            fontWeight: '600',
            color: 'white'
          }}>
            <div>Token Information</div>
            <div>Template</div>
            <div>Total Supply</div>
            <div>My Balance</div>
            <div>Deployed</div>
          </div>
          
          <div className="token-list">
            {tokens.map((token, index) => (
              <div key={index} className="token-item">
                <div className="token-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.5em' }}>
                      {getTemplateIcon(token.template)}
                    </div>
                    <div>
                      <div className="token-name">{token.name}</div>
                      <div className="token-address">{formatAddress(token.address)}</div>
                    </div>
                  </div>
                  {token.error && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      Could not load token data
                    </div>
                  )}
                </div>
                <div>
                  <span 
                    style={{ 
                      background: 'rgba(139, 92, 246, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: '#e2e8f0'
                    }}
                  >
                    {token.template}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'white' }}>
                    {parseFloat(token.totalSupply).toLocaleString()}
                  </div>
                </div>
                <div className="token-balance">
                  <div className="balance-amount">
                    {parseFloat(token.balance).toLocaleString()}
                  </div>
                  <div className="balance-label">Tokens</div>
                </div>
                <div style={{ color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                  {formatDate(token.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            textAlign: 'center', 
            color: 'var(--slate-400)',
            fontSize: '0.9rem'
          }}>
            Showing {tokens.length} deployed Ayicoin tokens
          </div>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: 'var(--slate-400)',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪙</div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Ayicoin Tokens Found</h3>
          <p style={{ marginBottom: '2rem' }}>
            You haven't deployed any tokens yet. Create your first Ayicoin token using our templates!
          </p>
          
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'deployer' }))}
            className="action-button primary"
          >
            🚀 Deploy First Token
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDeployedTokens;