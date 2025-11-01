// scripts/deploy-fresh.js
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔄 Fresh deployment starting...");
  
  // Clear existing deployments
  const deploymentsDir = "./deployments/localhost";
  if (fs.existsSync(deploymentsDir)) {
    fs.rmSync(deploymentsDir, { recursive: true });
    console.log("🧹 Cleared existing deployments");
  }

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  // Deploy TokenFactory
  console.log("📦 Deploying TokenFactory...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy();
  
  await tokenFactory.waitForDeployment();
  const factoryAddress = await tokenFactory.getAddress();
  
  console.log("✅ TokenFactory deployed to:", factoryAddress);

  // Test immediately
  console.log("🧪 Immediate test...");
  const tx = await tokenFactory.createToken(
    "QuickTest", 
    "QT", 
    ethers.parseUnits("1000", 18)
  );
  
  const receipt = await tx.wait();
  console.log("✅ Test token deployed! Tx:", receipt.hash);

  // Get the actual ABI from the contract
  const contractArtifact = await artifacts.readArtifact("TokenFactory");
  
  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    tokenFactory: factoryAddress,
    deployer: deployer.address,
    abi: contractArtifact.abi,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "deployment-latest.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to deployment-latest.json");
  
  // Update frontend config
  await updateFrontendConfig(factoryAddress, contractArtifact.abi);
}

async function updateFrontendConfig(factoryAddress, abi) {
  try {
    const configPath = "./frontend/src/config/contracts.js";
    
    const configContent = `/**
 * Ayicoin Platform Contract Configuration
 * @dev Auto-generated - Contract: ${factoryAddress}
 */

export const CONFIG = {
  getContractAddress: (contractName) => {
    const networkId = parseInt(window.ethereum?.chainId) || 31337;
    return "${factoryAddress}"; // Using same address for all networks for testing
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

// Export ABI for direct use
export const TOKEN_FACTORY_ABI = ${JSON.stringify(abi, null, 2)};

export default CONFIG;
`;

    fs.writeFileSync(configPath, configContent, "utf8");
    console.log("✅ Frontend config updated with new ABI");
    
  } catch (error) {
    console.log("⚠️ Could not update frontend config:", error.message);
  }
}

main().catch(console.error);