// scripts/find-real-contract.js
const { ethers } = require("hardhat");

async function main() {
  const factoryAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  console.log("🔍 Finding what's actually deployed...");
  
  // Try common function patterns
  const commonFunctions = [
    // ERC20 functions
    "function name() view returns (string)",
    "function symbol() view returns (string)", 
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    
    // Ownable functions
    "function owner() view returns (address)",
    "function getOwner() view returns (address)",
    
    // Factory functions  
    "function createToken(string, string, uint256) returns (address)",
    "function getPlatformStats() returns (uint256, uint256, address)",
    
    // Generic functions
    "function version() view returns (string)",
    "function getAddress() view returns (address)"
  ];

  for (const func of commonFunctions) {
    try {
      const contract = new ethers.Contract(factoryAddress, [func], ethers.provider);
      const funcName = func.split('(')[0].replace('function ', '');
      const result = await contract[funcName]();
      console.log(`✅ ${funcName}:`, result);
    } catch (e) {
      // Function doesn't exist
    }
  }

  // Check if it's an ERC20 token
  console.log("\n🧪 Checking if it's an ERC20 token...");
  try {
    const erc20ABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)"
    ];
    
    const token = new ethers.Contract(factoryAddress, erc20ABI, ethers.provider);
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    
    console.log("🎯 It's an ERC20 token!");
    console.log("Name:", name);
    console.log("Symbol:", symbol); 
    console.log("Decimals:", decimals);
    console.log("Total Supply:", totalSupply.toString());
  } catch (e) {
    console.log("Not an ERC20 token");
  }

  // Check transaction history
  console.log("\n📋 Checking deployment transaction...");
  const provider = ethers.provider;
  const blockNumber = await provider.getBlockNumber();
  console.log("Current block:", blockNumber);
  
  // Get recent blocks to find deployment
  for (let i = blockNumber; i > blockNumber - 10; i--) {
    const block = await provider.getBlock(i);
    if (block && block.transactions.length > 0) {
      for (const txHash of block.transactions) {
        const tx = await provider.getTransaction(txHash);
        if (tx && tx.to === null) { // Contract creation
          const receipt = await provider.getTransactionReceipt(txHash);
          if (receipt.contractAddress === factoryAddress) {
            console.log("🎉 Found deployment transaction!");
            console.log("Tx hash:", txHash);
            console.log("Deployer:", tx.from);
            console.log("Block:", i);
            break;
          }
        }
      }
    }
  }
}

main().catch(console.error);