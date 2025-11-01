import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GlassCard } from '../UI/GlassCard';
import { ModernButton } from '../UI/ModernButton';
import { ProgressStepper } from '../UI/ProgressStepper';
import { TokenBasicsStep } from './steps/TokenBasicsStep';
import { TokenTemplates } from './TokenTemplates';
import { colors } from "./colors.jsx";
import { useWeb3 } from '../../context/Web3Context';
import { CONFIG, TOKEN_FACTORY_ABI } from '../../src/config/contracts';
import { TEMPLATES, applyTemplateToFormData } from '../../src/config/tokenTemplates';

const DEPLOYMENT_STEPS = ['Choose Template', 'Token Basics', 'Supply Setup', 'Advanced Features', 'Deployment'];

export const TokenDeployer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '1000000',
    description: '',
    website: '',
    features: {
      mintable: true,
      burnable: true,
      pausable: false
    }
  });
  const [deploying, setDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [gettingETH, setGettingETH] = useState(false);
  const [ethBalance, setEthBalance] = useState('0');
  
  const { provider, account, isConnected, chainId } = useWeb3();

  const currentChainId = parseInt(chainId);
  
  // IMPORTANT: Use the NEW factory address from your deployment
  const AYICOIN_FACTORY_ADDRESS = CONFIG.getContractAddress('tokenFactory') || "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";
  const AYICOIN_FACTORY_ABI = TOKEN_FACTORY_ABI;

  // Check ETH balance on mount and when account changes
  useEffect(() => {
    const checkBalance = async () => {
      if (provider && account) {
        const balance = await provider.getBalance(account);
        setEthBalance(ethers.formatEther(balance));
      }
    };
    
    checkBalance();
  }, [provider, account]);

  const updateFormData = (updates) => setFormData(prev => ({ ...prev, ...updates }));

  const nextStep = () => {
    if (currentStep < DEPLOYMENT_STEPS.length - 1 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return true; // Template step is always valid (can skip with custom)
      case 1:
        return formData.name.length >= 2 && formData.symbol.length >= 2;
      case 2:
        return parseFloat(formData.supply) > 0;
      default:
        return true;
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const newFormData = applyTemplateToFormData(template, formData);
    setFormData(newFormData);
    
    // Auto-advance to next step if template is selected
    if (template) {
      setTimeout(() => {
        nextStep();
      }, 300);
    }
  };

  const getTestETH = async () => {
    if (!account) return;

    setGettingETH(true);
    try {
      console.log("💰 Requesting test ETH for:", account);
      
      // Use the first Hardhat account (index 0) to send ETH
      const hardhatProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const hardhatSigner = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        hardhatProvider
      );

      const tx = await hardhatSigner.sendTransaction({
        to: account,
        value: ethers.parseEther("10.0")
      });

      console.log("⏳ ETH faucet transaction:", tx.hash);
      await tx.wait();
      
      // Update balance
      const newBalance = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(newBalance));
      
      console.log("✅ Received 10 test ETH!");
      alert("🎉 Successfully received 10 test ETH! You can now deploy your token.");
      
    } catch (error) {
      console.error("❌ Failed to get test ETH:", error);
      alert("❌ Failed to get test ETH. Make sure Hardhat node is running on port 8545.");
    } finally {
      setGettingETH(false);
    }
  };

  const executeTokenDeployment = async () => {
    if (!isConnected || !account) {
      throw new Error("Please connect your Ayicoin Wallet first");
    }

    if (!provider) {
      throw new Error("Ayicoin Wallet provider not available");
    }

    if (currentChainId !== 31337) {
      throw new Error(`Please switch to Ayicoin Hardhat Network (Chain ID: 31337). Current: ${currentChainId}`);
    }

    // Check ETH balance
    const balance = await provider.getBalance(account);
    if (balance < ethers.parseEther("0.001")) {
      throw new Error(`Insufficient ETH balance (${ethers.formatEther(balance)} ETH). You need at least 0.001 ETH for deployment.`);
    }

    if (!formData.name || !formData.symbol || !formData.supply) {
      throw new Error("Please complete all required Ayicoin token fields");
    }

    if (formData.name.length < 2) {
      throw new Error("Ayicoin token name must be at least 2 characters");
    }

    if (formData.symbol.length < 2 || formData.symbol.length > 8) {
      throw new Error("Ayicoin token symbol must be 2-8 characters");
    }

    const supply = parseFloat(formData.supply);
    if (isNaN(supply) || supply <= 0) {
      throw new Error("Ayicoin token supply must be a positive number");
    }

    if (supply > 1000000000) {
      throw new Error("Ayicoin maximum supply limit is 1,000,000,000 tokens");
    }

    try {
      setDeploying(true);
      setDeploymentError('');
      setDeployedAddress('');
      setTransactionHash('');

      console.log("🚀 Ayicoin Token Deployment Initialized");
      console.log("🏭 Factory Address:", AYICOIN_FACTORY_ADDRESS);

      const signer = await provider.getSigner();
      const ayicoinFactory = new ethers.Contract(
        AYICOIN_FACTORY_ADDRESS, 
        AYICOIN_FACTORY_ABI, 
        signer
      );

      console.log("✅ Ayicoin Factory Contract Initialized");

      const supplyInWei = ethers.parseUnits(formData.supply, 18);
      
      console.log("📝 Executing Ayicoin createToken transaction...");
      const transaction = await ayicoinFactory.createToken(
        formData.name.trim(),
        formData.symbol.trim().toUpperCase(),
        supplyInWei
      );

      console.log("⏳ Ayicoin Transaction Submitted:", transaction.hash);
      setTransactionHash(transaction.hash);

      const receipt = await transaction.wait();
      console.log("✅ Ayicoin Transaction Confirmed:", receipt);

      let deployedTokenAddress = null;
      let tokenName = '';
      let tokenSymbol = '';

      // Parse logs to find the deployed token address
      for (const log of receipt.logs) {
        try {
          const parsedLog = ayicoinFactory.interface.parseLog(log);
          if (parsedLog && parsedLog.name === "TokenCreated") {
            deployedTokenAddress = parsedLog.args.tokenAddress;
            tokenName = parsedLog.args.name;
            tokenSymbol = parsedLog.args.symbol;
            console.log("🎉 Ayicoin TokenCreated Event Detected:", parsedLog.args);
            break;
          }
        } catch (error) {
          // Skip logs that can't be parsed
          continue;
        }
      }

      if (deployedTokenAddress) {
        console.log("🏁 Ayicoin Token Deployment Successful!");
        
        const tokenDeploymentRecord = {
          address: deployedTokenAddress,
          name: tokenName,
          symbol: tokenSymbol,
          supply: formData.supply,
          deployer: account,
          timestamp: Date.now(),
          transactionHash: receipt.hash,
          features: formData.features,
          network: 'Ayicoin Hardhat',
          template: selectedTemplate ? selectedTemplate.name : 'Custom'
        };

        // Save to localStorage
        const existingDeployments = JSON.parse(
          localStorage.getItem("ayicoinDeployedTokens") || "[]"
        );
        existingDeployments.unshift(tokenDeploymentRecord);
        localStorage.setItem(
          "ayicoinDeployedTokens", 
          JSON.stringify(existingDeployments.slice(0, 100))
        );
        localStorage.setItem("lastAyicoinDeployment", deployedTokenAddress);

        setDeployedAddress(deployedTokenAddress);

        return {
          success: true,
          address: deployedTokenAddress,
          name: tokenName,
          symbol: tokenSymbol,
          transactionHash: receipt.hash
        };
      } else {
        // If we can't find the event, the transaction still succeeded
        // but we don't have the token address
        console.warn("Token deployed but address not found in logs");
        return {
          success: true,
          address: null,
          name: formData.name,
          symbol: formData.symbol,
          transactionHash: receipt.hash
        };
      }

    } catch (error) {
      console.error("❌ Ayicoin Deployment Error:", error);
      
      let errorMessage = "Ayicoin deployment failed";
      if (error.reason) {
        errorMessage += `: ${error.reason}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Ayicoin transaction rejected by user";
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = "Insufficient ETH for gas fees. Please get test ETH first.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleDeploy = async () => {
    try {
      const result = await executeTokenDeployment();
      
      if (result.success) {
        if (result.address) {
          alert(`🎉 Ayicoin Token Successfully Deployed!\n\n` +
                `Token: ${result.name} (${result.symbol})\n` +
                `Address: ${result.address}\n` +
                `TX Hash: ${result.transactionHash}`);
        } else {
          alert(`🎉 Ayicoin Token Deployment Transaction Successful!\n\n` +
                `Token: ${result.name} (${result.symbol})\n` +
                `TX Hash: ${result.transactionHash}\n\n` +
                `Note: Token address not found in logs, but transaction was successful.`);
        }
        
        // Reset form
        setFormData({
          name: '',
          symbol: '',
          supply: '1000000',
          description: '',
          website: '',
          features: {
            mintable: true,
            burnable: true,
            pausable: false
          }
        });
        setSelectedTemplate(null);
        setCurrentStep(0);
      }
    } catch (error) {
      setDeploymentError(error.message);
      alert(`❌ ${error.message}`);
    } finally {
      setDeploying(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TokenTemplates 
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        );
      
      case 1:
        return <TokenBasicsStep formData={formData} updateFormData={updateFormData} />;
      
      case 2:
        return (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '32px', color: 'white' }}>
              Ayicoin Supply Configuration
            </h2>
            {selectedTemplate && (
              <div style={{ 
                background: 'rgba(139, 92, 246, 0.1)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                color: colors.slate[300]
              }}>
                🎯 Using <strong>{selectedTemplate.name}</strong> template with recommended supply
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <input
                type="number"
                value={formData.supply}
                onChange={(e) => updateFormData({ supply: e.target.value })}
                placeholder="1000000"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  fontSize: '16px',
                  width: '200px'
                }}
              />
            </div>
            <div style={{ textAlign: 'center', color: colors.slate[300], marginTop: '16px' }}>
              Total Supply: <strong>{parseInt(formData.supply || 0).toLocaleString()}</strong> tokens
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '32px', color: 'white' }}>
              Ayicoin Advanced Features
            </h2>
            {selectedTemplate && (
              <div style={{ 
                background: 'rgba(139, 92, 246, 0.1)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                color: colors.slate[300]
              }}>
                🎯 Template features pre-configured for <strong>{selectedTemplate.name}</strong>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.slate[300] }}>
                <input
                  type="checkbox"
                  checked={formData.features.mintable}
                  onChange={(e) => updateFormData({ 
                    features: { ...formData.features, mintable: e.target.checked }
                  })}
                />
                Mintable Tokens
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.slate[300] }}>
                <input
                  type="checkbox"
                  checked={formData.features.burnable}
                  onChange={(e) => updateFormData({ 
                    features: { ...formData.features, burnable: e.target.checked }
                  })}
                />
                Burnable Tokens
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.slate[300] }}>
                <input
                  type="checkbox"
                  checked={formData.features.pausable}
                  onChange={(e) => updateFormData({ 
                    features: { ...formData.features, pausable: e.target.checked }
                  })}
                />
                Pausable Transfers
              </label>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '32px', color: 'white' }}>
              Ayicoin Deployment Ready
            </h2>
            
            {/* Template Info */}
            {selectedTemplate && (
              <div style={{ 
                background: 'rgba(139, 92, 246, 0.1)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5em', marginBottom: '8px' }}>{selectedTemplate.icon}</div>
                <div style={{ color: 'white', fontWeight: '600' }}>{selectedTemplate.name} Template</div>
                <div style={{ color: colors.slate[300], fontSize: '14px' }}>{selectedTemplate.description}</div>
              </div>
            )}
            
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '16px', textAlign: 'center' }}>
                🪙 Token Summary
              </h3>
              <div style={{ color: colors.slate[300] }}>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Symbol:</strong> {formData.symbol}</p>
                <p><strong>Supply:</strong> {parseInt(formData.supply).toLocaleString()} tokens</p>
                <p><strong>Template:</strong> {selectedTemplate ? selectedTemplate.name : 'Custom'}</p>
              </div>
            </div>
            
            {/* Network Status with ETH Balance */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <h4 style={{ color: 'white', marginBottom: '8px', textAlign: 'center' }}>🌐 Network Status</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.slate[300] }}>
                <span>Wallet:</span>
                <span style={{ color: isConnected ? '#10B981' : '#EF4444' }}>
                  {isConnected ? `Connected (${account?.slice(0,8)}...)` : 'Not Connected'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.slate[300] }}>
                <span>Network:</span>
                <span style={{ color: currentChainId === 31337 ? '#10B981' : '#EF4444' }}>
                  {currentChainId === 31337 ? 'Ayicoin Hardhat ✅' : `Wrong Network (${currentChainId})`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.slate[300] }}>
                <span>ETH Balance:</span>
                <span style={{ color: parseFloat(ethBalance) > 0.001 ? '#10B981' : '#EF4444' }}>
                  {ethBalance} ETH
                </span>
              </div>
              
              {/* Get ETH Button */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <ModernButton 
                  variant="secondary"
                  onClick={getTestETH}
                  disabled={gettingETH || !isConnected}
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  {gettingETH ? '⏳ Getting ETH...' : '💰 Get 10 Test ETH'}
                </ModernButton>
                <div style={{ color: colors.slate[400], fontSize: '12px', marginTop: '8px' }}>
                  Need ETH for gas fees? Click above to get 10 test ETH
                </div>
              </div>
            </div>
            
            {deploymentError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#EF4444'
              }}>
                <strong>❌ Deployment Error:</strong> {deploymentError}
              </div>
            )}
            
            {deployedAddress && (
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#22C55E'
              }}>
                <strong>✅ Success!</strong> Token deployed at: {deployedAddress}
              </div>
            )}

            {transactionHash && !deployedAddress && (
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#3B82F6'
              }}>
                <strong>⏳ Processing...</strong> Transaction: {transactionHash}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <GlassCard style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ProgressStepper 
        currentStep={currentStep} 
        totalSteps={DEPLOYMENT_STEPS.length} 
        steps={DEPLOYMENT_STEPS} 
      />
      
      {renderStep()}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '12px' }}>
        <ModernButton 
          variant="secondary" 
          onClick={prevStep} 
          disabled={currentStep === 0 || deploying}
        >
          ← Back
        </ModernButton>
        
        {currentStep === DEPLOYMENT_STEPS.length - 1 ? (
          <ModernButton 
            variant="primary" 
            onClick={handleDeploy} 
            disabled={deploying || !validateStep(currentStep) || !isConnected || currentChainId !== 31337}
            style={{ minWidth: '150px' }}
          >
            {deploying ? '⏳ Deploying...' : '🚀 Deploy Token'}
          </ModernButton>
        ) : (
          <ModernButton 
            variant="primary" 
            onClick={nextStep} 
            disabled={!validateStep(currentStep)}
          >
            Next →
          </ModernButton>
        )}
      </div>
    </GlassCard>
  );
};