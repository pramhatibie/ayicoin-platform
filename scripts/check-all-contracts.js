// scripts/check-all-contracts.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking All Contracts on Local Network");
  
  const contractsToCheck = [
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", // Our mystery contract
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat default #1
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Hardhat default #2  
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Hardhat default #3
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"  // Hardhat default #4
  ];

  // Check each contract
  for (const addr of contractsToCheck) {
    console.log(`\n📋 Checking ${addr}:`);
    
    const code = await ethers.provider.getCode(addr);
    console.log("Code size:", code.length, "bytes");
    
    if (code === "0x") {
      console.log("❌ No contract");
      continue;
    }
    
    // Try TokenFactory ABI
    try {
      const factory = await ethers.getContractAt("TokenFactory", addr);
      const stats = await factory.getPlatformStats();
      console.log("✅ TOKEN FACTORY FOUND!");
      console.log("Platform stats:", {
        totalTokens: stats.totalTokens.toString(),
        platformFee: stats.platformFee.toString(),
        owner: stats.platformOwner
      });
      
      // Test token creation
      const [deployer] = await ethers.getSigners();
      const userTokens = await factory.getUserTokens(deployer.address);
      console.log("Deployer tokens:", userTokens.length);
      
    } catch (e) {
      console.log("Not a TokenFactory:", e.message);
    }
    
    // Check events from this contract
    const logs = await ethers.provider.getLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: addr
    });
    console.log(`Events: ${logs.length}`);
  }
  
  // Now let's decode the 3 events from our mystery contract
  console.log("\n🎯 Decoding events from 0x5FC8d...:");
  const mysteryContract = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const logs = await ethers.provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: mysteryContract
  });
  
  // Try to decode with TokenFactory ABI
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const iface = TokenFactory.interface;
  
  for (let i = 0; i < logs.length; i++) {
    console.log(`\nEvent ${i + 1}:`);
    try {
      const parsedLog = iface.parseLog(logs[i]);
      console.log("✅ Decoded as TokenFactory event:", parsedLog.name);
      console.log("Args:", parsedLog.args);
    } catch (e) {
      console.log("❌ Could not decode with TokenFactory ABI");
      console.log("Raw log:", {
        topics: logs[i].topics,
        data: logs[i].data
      });
    }
  }
}

main().catch(console.error);