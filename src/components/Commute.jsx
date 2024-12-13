import React from 'react';

const Commute = ({ formData, updateFormData, nextBucket }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData('commute', { [name]: value });
  };

  const toggleCommuteOption = (option) => {
    updateFormData('commute', {
      selectedMode: formData?.selectedMode === option ? null : option
    });
  };

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How many days a week do you work from home?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="wfhDays"
              min="0"
              max="7"
              value={formData?.wfhDays || 0}
              onChange={handleInputChange}
              className="w-full"
            />
            <span>{formData?.wfhDays || 0}</span>
          </div>
        </div>

        {/* Commute mode selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose your mode of everyday commute:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'walk-cycle', label: '🚶‍♂️ Walk/Cycle' },
              { id: 'public-transport', label: '🚌 Public Transport' },
              { id: 'two-wheeler', label: '🛵 Two Wheeler' },
              { id: 'three-wheeler', label: '🛺 Three Wheeler' },
              { id: 'four-wheeler', label: '🚗 Four Wheeler' }
            ].map(mode => (
              <div
                key={mode.id}
                onClick={() => toggleCommuteOption(mode.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${formData?.selectedMode === mode.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'}`}
              >
                {mode.label}
              </div>
            ))}
          </div>
        </div>

        {/* Mode specific inputs */}
        {formData?.selectedMode === 'walk-cycle' && (
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
                value={formData?.walkCycleDistance || 0}
                onChange={handleInputChange}
                className="w-full"
              />
              <span>{formData?.walkCycleDistance || 0}</span>
            </div>
          </div>
        )}

        {formData?.selectedMode === 'public-transport' && (
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
                value={formData?.publicTransportDistance || 0}
                onChange={handleInputChange}
                className="w-full"
              />
              <span>{formData?.publicTransportDistance || 0}</span>
            </div>
          </div>
        )}

        {/* Two Wheeler Section */}
        {formData?.selectedMode === 'two-wheeler' && (
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
                    value={formData?.twoWheelerDistance || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.twoWheelerDistance || 0}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Four Wheeler Section */}
        {formData?.selectedMode === 'four-wheeler' && (
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
                    value={formData?.fourWheelerDistance || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.fourWheelerDistance || 0}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={nextBucket} className="button">
          Next
        </button>
      </div>
    </div>
  );
};

export default Commute; 