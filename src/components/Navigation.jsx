import React from 'react';

const Navigation = ({ activeBucket, onNavigationClick }) => {
  const navItems = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'energy', label: 'Energy' },
    { id: 'commute', label: 'Commute' },
    { id: 'travel', label: 'Travel' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'result', label: 'Results' }
  ];

  // Calculate progress percentage
  const currentIndex = navItems.findIndex(item => item.id === activeBucket);
  const progress = ((currentIndex + 1) / navItems.length) * 100;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="relative pt-4">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#4AECB7] transition-all duration-500"
            ></div>
          </div>
          {/* Step Indicators */}
          <div className="flex justify-between">
            {navItems.map((item, index) => (
              <div 
                key={item.id}
                className={`
                  flex flex-col items-center
                  ${index <= currentIndex ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
                onClick={() => onNavigationClick(item.id)}
              >
                <div 
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    text-xs font-semibold mb-1
                    ${index <= currentIndex 
                      ? 'border-[#4AECB7] bg-[#4AECB7] text-white' 
                      : 'border-gray-300 text-gray-300'}
                  `}
                >
                  {index + 1}
                </div>
                <span 
                  className={`
                    text-xs hidden md:block
                    ${index <= currentIndex 
                      ? 'text-[#4AECB7] font-medium' 
                      : 'text-gray-400'}
                  `}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 