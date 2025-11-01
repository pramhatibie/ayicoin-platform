import { ModernInput } from '../../UI/ModernInput';
import { TokenPreview } from '../TokenPreview';

export const TokenBasicsStep = ({ formData, updateFormData }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        color: 'white',
        fontSize: '28px'
      }}>
        Create Your Token
      </h2>
      
      <ModernInput
        label="Token Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Enter your token name (e.g., Ayicoin)"
      />
      
      <ModernInput
        label="Token Symbol" 
        value={formData.symbol}
        onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
        placeholder="Enter token symbol (e.g., AYI)"
        maxLength={8}
      />
      
      <TokenPreview 
        name={formData.name}
        symbol={formData.symbol}
        supply={formData.supply}
      />
    </div>
  );
};