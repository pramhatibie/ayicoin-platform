// scripts/deploy-ayicoin.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🎯 Deploying Ayicoin with account:", deployer.address);
  
  const Ayicoin = await ethers.getContractFactory("Ayicoin");
  const ayicoin = await Ayicoin.deploy(ethers.parseEther("1000000")); // 1 juta token
  
  await ayicoin.waitForDeployment();
  const address = await ayicoin.getAddress();
  
  console.log("✅ Ayicoin deployed to:", address);
  console.log("📝 Total Supply: 1,000,000 AYI");
  console.log("🔗 Simpan address ini untuk interaksi:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});