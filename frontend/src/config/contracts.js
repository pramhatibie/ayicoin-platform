/**
 * Ayicoin Platform Contract Configuration
 * @dev Auto-generated - CORRECT TokenFactory: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
 */

const CONTRACT_ADDRESSES = {
  localhost: {
    tokenFactory: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  },
  sepolia: {
    tokenFactory: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  },
  mainnet: {
    tokenFactory: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  }
};

export const CONFIG = {
  getContractAddress: (contractName) => {
    const networkId = parseInt(window.ethereum?.chainId) || 31337;
    return CONTRACT_ADDRESSES.localhost[contractName]; // Always use localhost for now
  },
  
  getCurrentNetwork: () => {
    const networkId = parseInt(window.ethereum?.chainId) || 31337;
    const networks = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet', 
      31337: 'Local Hardhat Network'
    };
    
    return {
      networkId,
      networkName: networks[networkId] || 'Unknown Network'
    };
  }
};

// Token Factory ABI
export const TOKEN_FACTORY_ABI = [
  "function createToken(string name_, string symbol_, uint256 initialSupply_) external returns (address)",
  "function getUserTokenCount(address user) external view returns (uint256)",
  "function getUserTokens(address user) external view returns (address[])",
  "function getTokenInfo(address tokenAddress) external view returns (tuple(address tokenAddress, string name, string symbol, uint256 initialSupply, uint256 maxSupply, uint256 creationTime, address owner, bool isActive))",
  "function getPlatformStats() external view returns (uint256 totalTokens, uint256 platformFee, address platformOwner)",
  "function isTokenVerified(address tokenAddress) external view returns (bool)",
  "event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 supply, uint256 maxSupply, address indexed owner, uint256 timestamp)"
];

export default CONTRACT_ADDRESSES;