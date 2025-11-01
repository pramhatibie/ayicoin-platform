import { useState, useEffect } from 'react';
import { Web3Provider, useWeb3 } from "../context/Web3Context";
import { CONFIG } from "../src/config/contracts";

// Component imports from frontend/components/
import { WalletConnect } from "../components/WalletConnect";
import { TokenDeployer } from "../components/TokenDeployer/TokenDeployer";
import AccountOverview from "../components/AccountOverview";
import MyDeployedTokens from "../components/MyDeployedTokens";
import Navigation from "../components/Navigation";
import "./App.css";

/**
 * Ayicoin Platform - Professional Web3 Token Factory
 * @dev Enterprise-grade token creation and management interface
 * @notice Create, deploy, and manage ERC20 tokens with institutional features
 */
function Dashboard() {
  const { account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [networkInfo, setNetworkInfo] = useState({});
  const [factoryAddress, setFactoryAddress] = useState('');

  // Initialize factory address and network info
  useEffect(() => {
    const address = CONFIG.getContractAddress('tokenFactory');
    setFactoryAddress(address);

    const updateNetworkInfo = () => {
      const { networkId, networkName } = CONFIG.getCurrentNetwork();
      const networkColors = {
        1: '#29b6af',
        11155111: '#ff4a8d', 
        31337: '#8b5cf6'
      };
      
      setNetworkInfo({
        name: networkName,
        color: networkColors[networkId] || '#666'
      });
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', updateNetworkInfo);
      updateNetworkInfo();
    }

    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('changeTab', handleTabChange);
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', updateNetworkInfo);
      }
      window.removeEventListener('changeTab', handleTabChange);
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="app-container">
        <Header networkInfo={networkInfo} />
        <WalletConnect />
        <Footer factoryAddress={factoryAddress} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header networkInfo={networkInfo} />
      
      <Navigation currentView={activeTab} setCurrentView={setActiveTab} />
      
      <main className="app-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard-layout">
            <AccountOverview />
            
            
            <div className="widget-card full-width">
              <MyDeployedTokens />
            </div>
          </div>
        )}

        {activeTab === 'deployer' && (
          <div className="deployer-container">
            <TokenDeployer />
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="tokens-container">
            <MyDeployedTokens />
          </div>
        )}

    
      </main>

      <Footer factoryAddress={factoryAddress} />
    </div>
  );
}

/**
 * Professional Header with Ayicoin Branding
 */
const Header = ({ networkInfo }) => (
  <header className="app-header">
    <div className="header-content">
      <div className="brand-section">
        <div className="brand-logo">
          <span className="logo-icon">🪙</span>
          <div className="brand-text">
            <h1 className="app-title">Ayicoin Platform</h1>
            <p className="app-subtitle">Enterprise Web3 Token Factory</p>
          </div>
        </div>
        {networkInfo.name && (
          <div className="network-badge" style={{ backgroundColor: networkInfo.color }}>
            {networkInfo.name}
          </div>
        )}
      </div>
      <div className="header-features">
        <div className="feature-tag">🚀 Multi-Chain Ready</div>
        <div className="feature-tag">🔒 Secure & Audited</div>
        <div className="feature-tag">⚡ Instant Deployment</div>
      </div>
    </div>
  </header>
);

/**
 * Professional Footer with Contract Info
 */
const Footer = ({ factoryAddress }) => (
  <footer className="app-footer">
    <div className="footer-content">
      <div className="footer-brand">
      <p>
  <strong>🚀 Ayicoin Platform</strong> - Create Institutional Tokens in Minutes, No Code Required
</p>
     
      </div>
      <div className="contract-info">
        <div className="contract-address">
          <span className="address-label">Factory Contract:</span>
          <code className="address-value">{factoryAddress}</code>
          <button 
            onClick={() => navigator.clipboard.writeText(factoryAddress)}
            className="copy-btn"
            title="Copy contract address"
          >
            📋
          </button>
        </div>
     
      </div>
    </div>
<div className="footer-bottom">
  <div style={{ 
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center'
  }}>
    {/* Main copyright line */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '1.1em' }}>🪙</span>
        <strong style={{ color: '#e2e8f0' }}>Ayicoin Labs</strong>
      </span>
      <span style={{ color: '#64748b' }}>•</span>
      <span style={{ color: '#94a3b8' }}>© 2025 All rights reserved</span>
    </div>
    
    {/* Mission statement */}
    <div style={{ 
      color: '#64748b', 
      fontSize: '0.9rem',
      fontStyle: 'italic'
    }}>
      Empowering creators in the global Web3 ecosystem
    </div>
  </div>
</div>
  </footer>
);

/**
 * Main Application Entry Point
 */
function App() {
  return (
    <Web3Provider>
      <Dashboard />
    </Web3Provider>
  );
}

export default App;