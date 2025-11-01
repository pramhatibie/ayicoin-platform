import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

// GANTI INI dengan address kontrak lu setelah deploy
const AYICOIN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// ABI minimal
const AYI_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)", 
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [contract, setContract] = useState(null);

  // Connect to Local Hardhat
  const connectToHardhat = async () => {
    try {
      // Hardhat local RPC
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = await provider.getSigner(0); // Account pertama
      
      const address = await signer.getAddress();
      setAccount(address);
      
      // Setup contract
      const ayiContract = new ethers.Contract(AYICOIN_ADDRESS, AYI_ABI, signer);
      setContract(ayiContract);
      
      // Get balance
      const tokenBalance = await ayiContract.balanceOf(address);
      setBalance(ethers.formatUnits(tokenBalance, 18));
      
    } catch (error) {
      console.error("Error:", error);
      alert("Pastikan Hardhat node jalan! npx hardhat node");
    }
  };

  const transferTokens = async () => {
    if (!contract) return;
    
    try {
      // Transfer ke account kedua di Hardhat
      const tx = await contract.transfer(
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 
        ethers.parseUnits("50", 18)
      );
      await tx.wait();
      alert("Transfer berhasil! 50 AYI terkirim");
      
      // Update balance
      const newBalance = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(newBalance, 18));
      
    } catch (error) {
      console.error("Transfer gagal:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎯 Ayicoin Dashboard</h1>
      
      {!account ? (
        <button onClick={connectToHardhat} style={{padding: '10px 20px'}}>
          Connect to Hardhat
        </button>
      ) : (
        <div>
          <p>✅ Connected: {account}</p>
          <p>💰 Balance: {balance} AYI</p>
          <button onClick={transferTokens} style={{padding: '10px 20px', margin: '10px'}}>
            Transfer 50 AYI
          </button>
        </div>
      )}
      
      <div style={{marginTop: '20px', padding: '10px', background: '#f5f5f5'}}>
        <h3>📋 Cara Setup:</h3>
        <ol>
          <li>Terminal 1: <code>npx hardhat node</code></li>
          <li>Terminal 2: <code>npx hardhat run scripts/deploy.js --network localhost</code></li>
          <li>Copy contract address ke variable <code>AYICOIN_ADDRESS</code></li>
          <li>Terminal 3: <code>npm start</code> (di folder frontend)</li>
        </ol>
      </div>
    </div>
  );
}

export default App;