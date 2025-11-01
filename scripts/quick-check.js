// scripts/quick-check.js
const { ethers } = require("hardhat");

async function main() {
  const factoryAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  // Check contract code
  const code = await ethers.provider.getCode(factoryAddress);
  console.log("Contract code length:", code.length);
  console.log("Is contract deployed?", code !== "0x");
  
  if (code === "0x") {
    console.log("❌ CONTRACT NOT DEPLOYED at this address!");
    return;
  }
  
  console.log("✅ Contract exists!");
  
  // Try to interact with it
  try {
    const factory = await ethers.getContractAt("TokenFactory", factoryAddress);
    console.log("✅ Contract instance created");
    
    // Try the simplest function
    const owner = await factory.owner();
    console.log("Contract owner:", owner);
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
