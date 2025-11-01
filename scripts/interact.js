// scripts/interact.js
const hre = require("hardhat");

async function main() {
  const [deployer, addr1] = await hre.ethers.getSigners();

  // Alamat kontrak Ayicoin hasil deploy
  const ayicoinAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // Attach kontrak
  const Ayicoin = await hre.ethers.getContractFactory("Ayicoin");
  const ayicoin = await Ayicoin.attach(ayicoinAddress);

  // Cek balance sebelum transfer
  const deployerBalanceBefore = await ayicoin.balanceOf(deployer.address);
  const addr1BalanceBefore = await ayicoin.balanceOf(addr1.address);

  console.log("=== BALANCE SEBELUM TRANSFER ===");
  console.log("Deployer:", formatUnitsManual(deployerBalanceBefore, 18));
  console.log("Addr1  :", formatUnitsManual(addr1BalanceBefore, 18));

  // Transfer 100 token ke addr1
  const amount = parseUnitsManual("100", 18);
  console.log("Amount to transfer:", amount.toString());
  
  const tx = await ayicoin.connect(deployer).transfer(addr1.address, amount);
  await tx.wait();

  // Cek balance sesudah transfer
  const deployerBalanceAfter = await ayicoin.balanceOf(deployer.address);
  const addr1BalanceAfter = await ayicoin.balanceOf(addr1.address);

  console.log("=== BALANCE SESUDAH TRANSFER ===");
  console.log("Deployer:", formatUnitsManual(deployerBalanceAfter, 18));
  console.log("Addr1  :", formatUnitsManual(addr1BalanceAfter, 18));

  console.log("Transfer berhasil!");
}

// Fungsi manual untuk format units
function formatUnitsManual(value, decimals) {
  const valueStr = value.toString();
  if (valueStr.length <= decimals) {
    return '0.' + valueStr.padStart(decimals, '0');
  }
  const integerPart = valueStr.slice(0, -decimals);
  const decimalPart = valueStr.slice(-decimals).replace(/0+$/, '');
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}

// Fungsi manual untuk parse units
function parseUnitsManual(value, decimals) {
  const [integerPart, decimalPart = ''] = value.split('.');
  const fullDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integerPart + fullDecimal);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});