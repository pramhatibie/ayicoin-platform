import React from 'react';

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'deployer', label: '🚀 Deploy Token', icon: '🚀' },
    { id: 'tokens', label: '📋 My Tokens', icon: '📋' }
  ];

  return (
    <div className="widget-card">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={currentView === item.id ? 'nav-button active' : 'nav-button inactive'}
          >
            <span style={{ fontSize: '1.3em' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;