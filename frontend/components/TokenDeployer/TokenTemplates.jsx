import React from 'react';
import { ModernButton } from '../UI/ModernButton';
import { GlassCard } from '../UI/GlassCard';
import { TEMPLATES } from '../../src/config/tokenTemplates';

export const TokenTemplates = ({ onTemplateSelect, selectedTemplate }) => {
  return (
    <div className="templates-container">
      <h2 style={{ textAlign: 'center', marginBottom: '32px', color: 'white' }}>
        🚀 Choose Your Ayicoin Token Template
      </h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '32px' }}>
        Start with a pre-configured template or create custom token
      </p>
      
      <div className="templates-grid">
        {TEMPLATES.map((template) => (
          <GlassCard 
            key={template.id}
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => onTemplateSelect(template)}
            style={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedTemplate?.id === template.id ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)'
            }}
          >
            <div className="template-header">
              <div className="template-icon" style={{ fontSize: '2em' }}>
                {template.icon}
              </div>
              <div className="template-badge" style={{ 
                background: template.category === 'Premium' ? '#f59e0b' : '#8b5cf6',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                marginLeft: '8px'
              }}>
                {template.category}
              </div>
            </div>
            
            <h3 style={{ color: 'white', margin: '16px 0 8px 0' }}>
              {template.name}
            </h3>
            
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              {template.description}
            </p>
            
            <div className="template-features">
              {template.features.map((feature, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: '#cbd5e1',
                  fontSize: '12px',
                  marginBottom: '4px'
                }}>
                  <span>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="template-details" style={{ 
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Supply:</span>
                <span>{template.defaultSupply.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Decimals:</span>
                <span>{template.defaultDecimals}</span>
              </div>
            </div>
            
            <ModernButton 
              variant={selectedTemplate?.id === template.id ? "primary" : "secondary"}
              style={{ width: '100%', marginTop: '16px' }}
            >
              {selectedTemplate?.id === template.id ? '✓ Selected' : 'Use Template'}
            </ModernButton>
          </GlassCard>
        ))}
        
        {/* Custom Template Card */}
        <GlassCard 
          className={`template-card ${!selectedTemplate ? 'selected' : ''}`}
          onClick={() => onTemplateSelect(null)}
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: !selectedTemplate ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <div className="template-header">
            <div className="template-icon" style={{ fontSize: '2em' }}>
              🎨
            </div>
          </div>
          
          <h3 style={{ color: 'white', margin: '16px 0 8px 0' }}>
            Custom Token
          </h3>
          
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
            Build from scratch with full customization
          </p>
          
          <div className="template-features">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '12px',
              marginBottom: '4px'
            }}>
              <span>✓</span>
              <span>Complete control over parameters</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '12px',
              marginBottom: '4px'
            }}>
              <span>✓</span>
              <span>Advanced feature selection</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '12px',
              marginBottom: '4px'
            }}>
              <span>✓</span>
              <span>Manual configuration</span>
            </div>
          </div>
          
          <ModernButton 
            variant={!selectedTemplate ? "primary" : "secondary"}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {!selectedTemplate ? '✓ Selected' : 'Build Custom'}
          </ModernButton>
        </GlassCard>
      </div>
    </div>
  );
};