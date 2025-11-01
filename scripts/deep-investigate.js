// scripts/deep-investigate.js
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  console.log("🔍 Deep Investigation of Contract");
  
  // Get the deployment transaction details
  const txHash = "0x2e63b4bbbf969ef4113f6f4c2193d4d7cd51209af62f263897a9163d9dc17ac4";
  const tx = await ethers.provider.getTransaction(txHash);
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  
  console.log("📄 Deployment Transaction:");
  console.log("From:", tx.from);
  console.log("To:", tx.to); // Should be null for contract creation
  console.log("Input data length:", tx.data.length);
  console.log("Gas used:", receipt.gasUsed.toString());
  console.log("Contract address:", receipt.contractAddress);
  
  // Check what was in the deployment transaction data
  console.log("\n📦 Deployment Input Data (first 200 chars):");
  console.log(tx.data.substring(0, 200));
  
  // Try to find more functions by testing common patterns
  console.log("\n🧪 Testing more function patterns...");
  
  const testFunctions = [
    // Factory patterns
    "function createToken(string,string,uint256)",
    "function createToken(string,string,uint256,uint256)",
    "function createERC20(string,string,uint256)",
    
    // Ownable patterns  
    "function owner()",
    "function getOwner()",
    "function admin()",
    "function getAdmin()",
    
    // UUPS/Proxy patterns
    "function implementation()",
    "function getImplementation()",
    "function upgradeTo(address)",
    
    // Minimal patterns
    "function version()",
    "function getVersion()",
    "function initialize()"
  ];
  
  for (const func of testFunctions) {
    try {
      const contract = new ethers.Contract(contractAddress, [func], ethers.provider);
      const funcName = func.split('(')[0].replace('function ', '');
      const result = await contract[funcName]();
      console.log(`✅ ${func}:`, result);
    } catch (e) {
      // Function doesn't exist or failed
    }
  }
  
  // Check if it responds to any function call at all
  console.log("\n🔧 Testing fallback behavior...");
  try {
    // Try calling a non-existent function to see what happens
    const contract = new ethers.Contract(contractAddress, ["function doesNotExist()"], ethers.provider);
    await contract.doesNotExist();
  } catch (e) {
    console.log("Fallback error:", e.message);
  }
  
  // Check events from this contract
  console.log("\n📋 Checking contract events...");
  const logs = await ethers.provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: contractAddress
  });
  console.log(`Found ${logs.length} events from this contract`);
  
  // Check what other contracts exist
  console.log("\n🏗️  Checking for other deployed contracts...");
  const latestBlock = await ethers.provider.getBlockNumber();
  for (let i = 0; i <= latestBlock; i++) {
    const block = await ethers.provider.getBlock(i);
    if (block && block.transactions.length > 0) {
      for (const txHash of block.transactions) {
        const tx = await ethers.provider.getTransaction(txHash);
        if (tx && tx.to === null) {
          const receipt = await ethers.provider.getTransactionReceipt(txHash);
          if (receipt.contractAddress && receipt.contractAddress !== contractAddress) {
            console.log(`Found other contract: ${receipt.contractAddress} in block ${i}`);
          }
        }
      }
    }
  }
}

main().catch(console.error);