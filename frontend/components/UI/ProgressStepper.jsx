import { colors} from '../colors.jsx';

export const ProgressStepper = ({ currentStep, totalSteps, steps }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '40px',
      position: 'relative'
    }}>
      {/* Connection Line */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '0',
        right: '0',
        height: '2px',
        background: colors.slate[700],
        zIndex: 0
      }} />
      
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        
        return (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1
          }}>
            {/* Step Circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isCompleted ? colors.brand.emerald[500] : 
                         isActive ? colors.brand.purple[500] : colors.slate[700],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px',
              border: isActive ? `2px solid ${colors.brand.purple[300]}` : 'none',
              boxShadow: isActive ? `0 0 0 4px ${colors.brand.purple[500]}20` : 'none',
              transition: 'all 0.3s ease-in-out'
            }}>
              {isCompleted ? '✓' : index + 1}
            </div>
            
            {/* Step Label */}
            <div style={{
              marginTop: '8px',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? colors.brand.purple[500] : colors.slate[400],
              textAlign: 'center'
            }}>
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};