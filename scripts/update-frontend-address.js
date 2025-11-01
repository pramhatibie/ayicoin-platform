// scripts/update-frontend-address.js
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔄 Updating frontend with correct factory address...");
  
  const correctAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const configPath = path.join(__dirname, "../frontend/src/config/contracts.js");
  
  const newConfig = `/**
 * Ayicoin Platform Contract Configuration
 * @dev Auto-generated - CORRECT TokenFactory: ${correctAddress}
 */

const CONTRACT_ADDRESSES = {
  localhost: {
    tokenFactory: "${correctAddress}",
  },
  sepolia: {
    tokenFactory: "${correctAddress}",
  },
  mainnet: {
    tokenFactory: "${correctAddress}",
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

export default CONTRACT_ADDRESSES;
`;

  fs.writeFileSync(configPath, newConfig, "utf8");
  console.log("✅ Frontend config updated with correct factory address!");
  console.log("📍 TokenFactory:", correctAddress);
  console.log("\n🚀 Restart your frontend development server to apply changes!");
}

main().catch(console.error);