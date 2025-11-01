// src/context/Web3Context.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  // Check if user is already connected
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          
          setAccount(accounts[0]);
          setProvider(provider);
          setChainId(network.chainId);
          setIsConnected(true);
          setConnectionError(null);
        }
      } catch (error) {
        console.error('Error checking connection status:', error);
        setConnectionError('Failed to check connection status');
      }
    }
  };

  // Simple alert function to replace toast
  const showMessage = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else if (type === 'success') {
      alert(`Success: ${message}`);
    }
  };

  // This function name matches what WalletConnect expects
  const connectToHardhat = async () => {
    if (!window.ethereum) {
      showMessage('Please install MetaMask to use this platform', 'error');
      return false;
    }

    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      console.log('Current network:', network);

      // Check if we're on Hardhat network (31337)
      if (network.chainId !== 31337) {
        try {
          // Try to switch to Hardhat network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7A69' }], // 31337 in hex
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x7A69',
                    chainName: 'Hardhat Local',
                    rpcUrls: ['http://127.0.0.1:8545'],
                    nativeCurrency: {
                      name: 'Ethereum',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                  },
                ],
              });
            } catch (addError) {
              console.error('Error adding Hardhat network:', addError);
              showMessage('Failed to add Hardhat network to MetaMask. Please add it manually.', 'error');
              setIsLoading(false);
              return false;
            }
          } else {
            console.error('Error switching to Hardhat network:', switchError);
            showMessage('Failed to switch to Hardhat network', 'error');
            setIsLoading(false);
            return false;
          }
        }
      }

      // Get updated network after switching
      const updatedNetwork = await provider.getNetwork();
      const updatedAccounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });

      console.log('Updated network:', updatedNetwork);
      console.log('Updated accounts:', updatedAccounts);

      setAccount(updatedAccounts[0]);
      setProvider(provider);
      setChainId(updatedNetwork.chainId);
      setIsConnected(true);
      setConnectionError(null);
      
      showMessage('Successfully connected to Hardhat network!', 'success');
      return true;

    } catch (error) {
      console.error('Error connecting wallet:', error);
      const errorMessage = error.message || 'Failed to connect wallet';
      setConnectionError(errorMessage);
      showMessage(errorMessage, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative function name for compatibility
  const connectWallet = connectToHardhat;

  const value = {
    account,
    provider,
    isConnected,
    isLoading,
    chainId,
    connectionError,
    connectToHardhat, // This is the function WalletConnect expects
    connectWallet,    // Alternative name for other components
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};