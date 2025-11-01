// 📁 frontend/components/TokenInteraction.jsx
import { useState } from "react";
import { ethers } from "ethers";
import { GlassCard } from "./UI/GlassCard";
import { ModernButton } from "./UI/ModernButton";

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export default function TokenInteraction({ tokenAddress, onClose }) {
  const [provider] = useState(
    new ethers.JsonRpcProvider("http://127.0.0.1:8545")
  );
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({});
  const [targetAddress, setTargetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎯 Connect ke contract
  async function init() {
    try {
      const localSigner = await provider.getSigner(0);
      setSigner(localSigner);
      const c = new ethers.Contract(tokenAddress, ERC20_ABI, localSigner);
      setContract(c);

      const [name, symbol, decimals, balance] = await Promise.all([
        c.name(),
        c.symbol(),
        c.decimals(),
        c.balanceOf(await localSigner.getAddress())
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals,
        balance: ethers.formatUnits(balance, decimals)
      });

      console.log(`✅ Connected to ${name} (${symbol}) at ${tokenAddress}`);
    } catch (err) {
      console.error("❌ Error init contract:", err);
      alert("Gagal connect ke contract. Pastikan Hardhat node aktif!");
    }
  }

 async function handleTransfer() {
  if (!contract || !signer) {
    alert("Contract belum terkoneksi!");
    return;
  }

  // ✅ Validasi alamat penerima
  if (!ethers.isAddress(targetAddress)) {
    alert("❌ Address tidak valid! Pastikan dimulai dengan 0x dan panjangnya 42 karakter.");
    return;
  }

  // ✅ Validasi jumlah transfer
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    alert("❌ Jumlah transfer harus lebih besar dari 0.");
    return;
  }

  try {
    setLoading(true);
    setTxStatus("⏳ Mengirim transaksi...");
    const decimals = await contract.decimals();

    // ✅ Kirim transaksi
    const tx = await contract.transfer(
      targetAddress,
      ethers.parseUnits(amount, decimals)
    );
    console.log("🚀 TX sent:", tx.hash);
    await tx.wait();

    setTxStatus("✅ Transfer sukses!");
    alert(`✅ Berhasil kirim ${amount} token ke ${targetAddress}`);
  } catch (err) {
    console.error("❌ Transfer gagal:", err);
    setTxStatus("❌ Transfer gagal. Cek console untuk detail.");
  } finally {
    setLoading(false);
  }
}

  return (
    <GlassCard style={{ maxWidth: 600, margin: "30px auto", padding: 24 }}>
      <h2 style={{ color: "white", marginBottom: 16 }}>⚡ Token Interaction</h2>

      <div style={{ color: "#ccc", marginBottom: 12 }}>
        <strong>Address:</strong> {tokenAddress}
      </div>

      {!contract ? (
        <ModernButton variant="primary" onClick={init}>
          🔌 Connect to Token
        </ModernButton>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div>
              <strong>{tokenInfo.name}</strong> ({tokenInfo.symbol})
            </div>
            <div style={{ fontSize: 13, color: "#aaa" }}>
              Balance: {tokenInfo.balance} {tokenInfo.symbol}
            </div>
          </div>

          <input
            type="text"
            placeholder="Recipient address"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              marginBottom: "10px"
            }}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              marginBottom: "10px"
            }}
          />

          <ModernButton
            variant="primary"
            onClick={handleTransfer}
            disabled={loading}
          >
            {loading ? "Processing..." : "📤 Transfer"}
          </ModernButton>

          <div style={{ marginTop: 12, color: "#ccc" }}>{txStatus}</div>

          <ModernButton
            variant="secondary"
            onClick={onClose}
            style={{ marginTop: 16 }}
          >
            ← Close
          </ModernButton>
        </>
      )}
    </GlassCard>
  );
}
