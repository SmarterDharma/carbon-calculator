import React, { useState } from 'react';

const CheckIcon = () => (
  <svg 
    className="h-5 w-5 text-green-500" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
      clipRule="evenodd" 
    />
  </svg>
);

const Commute = ({ formData, updateFormData }) => {
  const [openSection, setOpenSection] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData('commute', { [name]: value });
  };

  const toggleCommuteOption = (option) => {
    if (openSection === option) {
      setOpenSection(null);
    } else {
      setOpenSection(option);
    }
  };

  const isAccordionFilled = (modeId) => {
    switch(modeId) {
      case 'walk-cycle':
        return formData?.walkCycleDistance > 0;
      case 'public-transport':
        return formData?.publicTransportDistance > 0;
      case 'two-wheeler':
        return formData?.twoWheelerType && formData?.twoWheelerDistance > 0;
      case 'three-wheeler':
        return formData?.threeWheelerType && formData?.threeWheelerDistance > 0;
      case 'four-wheeler':
        return formData?.carType && formData?.fourWheelerDistance > 0;
      default:
        return false;
    }
  };

  const renderSection = (mode, content) => (
    <div className="border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => toggleCommuteOption(mode.id)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-left flex items-center gap-2">
            {mode.label}
          </h3>
          {isAccordionFilled(mode.id) && (
            <CheckIcon />
          )}
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            openSection === mode.id ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openSection === mode.id && (
        <div className="px-4 py-3 bg-gray-50 border-t">
          {content}
        </div>
      )}
    </div>
  );

  const selectTwoWheelerType = (type) => {
    updateFormData('commute', { twoWheelerType: type });
  };

  const selectPassengers = (count) => {
    updateFormData('commute', { passengerCount: count });
  };

  const selectCarType = (type) => {
    updateFormData('commute', { carType: type });
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Daily Commute</h2>

      <div className="space-y-6">
        {/* Work from home slider */}
        <div className="pb-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How many days a week do you work from home?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="wfhDays"
              min="0"
              max="7"
              step="1"
              value={formData?.wfhDays || 0}
              onChange={handleInputChange}
              className="w-full"
            />
            <input
              type="number"
              name="wfhDays"
              min="0"
              max="7"
              value={formData?.wfhDays || 0}
              onChange={handleInputChange}
              className="w-20 text-center input-field"
            />
          </div>
        </div>

        {/* Commute mode selection with accordions */}
        <div className="space-y-4">
          {[
            { id: 'walk-cycle', label: '🚶‍♂️ Walk/Cycle' },
            { id: 'public-transport', label: '🚌 Public Transport' },
            { id: 'two-wheeler', label: '🛵 Two Wheeler' },
            { id: 'three-wheeler', label: '🛺 Three Wheeler' },
            { id: 'four-wheeler', label: '🚗 Four Wheeler' }
          ].map((mode) => renderSection(mode, 
            // Pass the existing content for each mode
            mode.id === 'walk-cycle' ? (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-600 mb-4">
                  Wow, zero emissions! You're a true champion of sustainable commuting! 🌱
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily average roundtrip distance (km):
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="walkCycleDistance"
                    min="0"
                    max="100"
                    step="1"
                    value={formData?.walkCycleDistance || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <input
                    type="number"
                    name="walkCycleDistance"
                    min="0"
                    max="100"
                    value={formData?.walkCycleDistance || 0}
                    onChange={handleInputChange}
                    className="w-20 text-center input-field"
                  />
                </div>
              </div>
            ) : mode.id === 'public-transport' ? (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-600 mb-4">
                  Great choice! Public transport means fewer cars on the road and a cleaner planet! 🌍
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily average roundtrip distance (km):
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="publicTransportDistance"
                    min="0"
                    max="100"
                    step="1"
                    value={formData?.publicTransportDistance || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <input
                    type="number"
                    name="publicTransportDistance"
                    min="0"
                    max="100"
                    value={formData?.publicTransportDistance || 0}
                    onChange={handleInputChange}
                    className="w-20 text-center input-field"
                  />
                </div>
              </div>
            ) : mode.id === 'two-wheeler' ? (
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose your type of two-wheeler:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['electric', 'petrol'].map(type => (
                      <div
                        key={type}
                        onClick={() => selectTwoWheelerType(type)}
                        className={`p-3 border-2 rounded-lg cursor-pointer text-center
                          ${formData?.twoWheelerType === type 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'}`}
                      >
                        {type === 'electric' ? '⚡ Electric' : '⛽ Petrol'}
                      </div>
                    ))}
                  </div>
                </div>

                {formData?.twoWheelerType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily average roundtrip distance (km):
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        name="twoWheelerDistance"
                        min="0"
                        max="100"
                        step="1"
                        value={formData?.twoWheelerDistance || 0}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <input
                        type="number"
                        name="twoWheelerDistance"
                        min="0"
                        max="100"
                        value={formData?.twoWheelerDistance || 0}
                        onChange={handleInputChange}
                        className="w-20 text-center input-field"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : mode.id === 'three-wheeler' ? (
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose your type of three-wheeler:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['electric', 'cng', 'petrol'].map(type => (
                      <div
                        key={type}
                        onClick={() => updateFormData('commute', { threeWheelerType: type })}
                        className={`p-3 border-2 rounded-lg cursor-pointer text-center
                          ${formData?.threeWheelerType === type 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'}`}
                      >
                        {type === 'electric' ? '⚡ Electric' : type === 'cng' ? '🔋 CNG' : '⛽ Petrol'}
                      </div>
                    ))}
                  </div>
                </div>

                {formData?.threeWheelerType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily average roundtrip distance (km):
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        name="threeWheelerDistance"
                        min="0"
                        max="100"
                        step="1"
                        value={formData?.threeWheelerDistance || 0}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <input
                        type="number"
                        name="threeWheelerDistance"
                        min="0"
                        max="100"
                        value={formData?.threeWheelerDistance || 0}
                        onChange={handleInputChange}
                        className="w-20 text-center input-field"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Are you sharing the ride with others?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(count => (
                      <div
                        key={count}
                        onClick={() => selectPassengers(count)}
                        className={`p-3 border-2 rounded-lg cursor-pointer text-center
                          ${formData?.passengerCount === count 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'}`}
                      >
                        {count === 1 ? '👤' : count === 2 ? '👥' : count === 3 ? '👥👤' : '👥👥'} 
                        {count} {count === 1 ? 'person' : 'persons'}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select the type of car:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'electric', label: '⚡ Electric Car' },
                      { id: 'hatchback', label: '🚗 Hatchback/Sedan' },
                      { id: 'suv', label: '🚙 SUV' }
                    ].map(type => (
                      <div
                        key={type.id}
                        onClick={() => selectCarType(type.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer text-center
                          ${formData?.carType === type.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'}`}
                      >
                        {type.label}
                      </div>
                    ))}
                  </div>
                </div>

                {formData?.carType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily average roundtrip distance (km):
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        name="fourWheelerDistance"
                        min="0"
                        max="200"
                        step="1"
                        value={formData?.fourWheelerDistance || 0}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <input
                        type="number"
                        name="fourWheelerDistance"
                        min="0"
                        max="200"
                        value={formData?.fourWheelerDistance || 0}
                        onChange={handleInputChange}
                        className="w-20 text-center input-field"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Commute; 