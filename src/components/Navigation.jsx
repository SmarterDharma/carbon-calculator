import React from 'react';

const Navigation = ({ activeBucket, setActiveBucket }) => {
  const navItems = [
    { id: 'personal', icon: '👤', label: 'Personal Info' },
    { id: 'energy', icon: '⚡', label: 'Energy' },
    { id: 'commute', icon: '🚗', label: 'Commute' },
    { id: 'travel', icon: '✈️', label: 'Travel' },
    { id: 'lifestyle', icon: '🏠', label: 'Lifestyle' },
    { id: 'result', icon: '📊', label: 'Result' }
  ];

  return (
    <nav className="bg-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex justify-around py-3">
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveBucket(item.id)}
            className={`nav-icon ${activeBucket === item.id ? 'active' : ''}`}
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation; 