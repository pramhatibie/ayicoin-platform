// scripts/check-contract.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking contract status...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Try to interact with the factory
  const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  try {
    const Factory = await ethers.getContractFactory("TokenFactory");
    const factory = Factory.attach(factoryAddress);
    
    console.log("✅ Contract found at:", factoryAddress);
    
    // Test a view function
    const stats = await factory.getPlatformStats();
    console.log("Platform stats:", stats);
    
    // Test token creation with minimal parameters
    console.log("🧪 Testing token creation...");
    const tx = await factory.createToken(
      "TestToken",
      "TEST",
      ethers.parseUnits("1000", 18)
    );
    
    console.log("⏳ Waiting for transaction...");
    const receipt = await tx.wait();
    console.log("✅ Test successful! Tx hash:", receipt.hash);
    
  } catch (error) {
    console.error("❌ Contract check failed:", error.message);
    
    if (error.message.includes("unrecognized-selector")) {
      console.log("🔴 ABI mismatch detected! Contract needs redeployment.");
    }
  }
}

main().catch(console.error);