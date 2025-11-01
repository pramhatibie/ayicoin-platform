// Ayicoin Token Templates Configuration
// Pre-configured templates for quick token deployment

export const TEMPLATES = [
  {
    id: 'meme',
    name: 'Meme Token',
    icon: '🐶',
    description: 'Perfect for community tokens and meme coins with high supply',
    category: 'Popular',
    features: [
      'High total supply',
      'Community focused',
      'Social media ready',
      'Zero transaction taxes'
    ],
    defaultSupply: '1000000000',
    defaultDecimals: 9,
    defaultFeatures: {
      mintable: false,
      burnable: true,
      pausable: false
    }
  },
  {
    id: 'utility',
    name: 'Utility Token',
    icon: '🛠️',
    description: 'Ideal for applications, services, and platform ecosystems',
    category: 'Business',
    features: [
      'Medium supply range',
      'Staking compatible',
      'In-app payments',
      'Reward system ready'
    ],
    defaultSupply: '10000000',
    defaultDecimals: 18,
    defaultFeatures: {
      mintable: true,
      burnable: true,
      pausable: true
    }
  },
  {
    id: 'governance',
    name: 'Governance Token',
    icon: '🗳️',
    description: 'Designed for DAOs and community voting systems',
    category: 'Advanced',
    features: [
      'Voting rights enabled',
      'Proposal system ready',
      'Treasury management',
      'Community governance'
    ],
    defaultSupply: '1000000',
    defaultDecimals: 18,
    defaultFeatures: {
      mintable: false,
      burnable: false,
      pausable: false
    }
  },
  {
    id: 'stablecoin',
    name: 'Stablecoin Template',
    icon: '💰',
    description: 'Modeled after popular stablecoins with fixed decimal places',
    category: 'Financial',
    features: [
      'Standard 6 decimals',
      'Price stability focused',
      'Cross-border payments',
      'Trading pairs ready'
    ],
    defaultSupply: '1000000',
    defaultDecimals: 6,
    defaultFeatures: {
      mintable: true,
      burnable: true,
      pausable: true
    }
  },
  {
    id: 'nft_utility',
    name: 'NFT Utility Token',
    icon: '🎨',
    description: 'Perfect for NFT projects, marketplaces, and creator economies',
    category: 'NFT',
    features: [
      'NFT minting payments',
      'Marketplace fees',
      'Royalty distributions',
      'Creator rewards'
    ],
    defaultSupply: '100000000',
    defaultDecimals: 18,
    defaultFeatures: {
      mintable: true,
      burnable: true,
      pausable: false
    }
  },
  {
    id: 'gamefi',
    name: 'GameFi Token',
    icon: '🎮',
    description: 'Optimized for gaming economies and in-game assets',
    category: 'Gaming',
    features: [
      'In-game purchases',
      'Player rewards',
      'NFT integration ready',
      'Multi-currency support'
    ],
    defaultSupply: '1000000000',
    defaultDecimals: 18,
    defaultFeatures: {
      mintable: true,
      burnable: true,
      pausable: false
    }
  }
];

// Helper function to get template by ID
export const getTemplateById = (id) => {
  return TEMPLATES.find(template => template.id === id);
};

// Apply template to form data
export const applyTemplateToFormData = (template, currentFormData = {}) => {
  if (!template) {
    return {
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
    };
  }

  return {
    ...currentFormData,
    supply: template.defaultSupply,
    features: template.defaultFeatures
  };
};