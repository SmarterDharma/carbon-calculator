import React from 'react';

const Travel = ({ formData, updateFormData, nextBucket }) => {
  const handleCountChange = (type, delta) => {
    const currentValue = formData?.[type] || 0;
    const newValue = Math.max(0, currentValue + delta);
    updateFormData('travel', { [type]: newValue });
  };

  const renderCounterInput = (type, label, description) => (
    <div className="p-4 border-2 border-gray-200 rounded-lg">
      <small className="text-xl mb-2">{label}</small>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleCountChange(type, -1)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          -
        </button>
        <input
          type="number"
          value={formData?.[type] || 0}
          onChange={(e) => updateFormData('travel', { [type]: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-16 text-center font-bold border rounded-md"
          min="0"
        />
        <button
          onClick={() => handleCountChange(type, 1)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Travel</h2>

      {/* Flights Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Flights</h3>
        <p className="text-gray-600 mb-4">
          How many flights did you take last year? Please select multiple options to match your flight duration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderCounterInput(
            'shortHaulFlights',
            '✈️',
            'Short-haul (Up to 3 hours, avg. 1000 km)'
          )}
          {renderCounterInput(
            'mediumHaulFlights',
            '✈️',
            'Medium-haul (3-6 hours, avg. 2750 km)'
          )}
          {renderCounterInput(
            'longHaulFlights',
            '✈️',
            'Long-haul (6-12 hours, avg. 6500 km)'
          )}
          {renderCounterInput(
            'ultraLongHaulFlights',
            '✈️',
            'Ultra-long-haul (Over 12 hours, avg. 12000 km)'
          )}
        </div>
      </div>

      {/* Train Journeys Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Train Journeys</h3>
        <p className="text-gray-600 mb-4">
          How many train journeys did you take last year? Select multiple to match your trip distance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderCounterInput(
            'shortTrainJourneys',
            '🚄',
            'Short Journey (Under 200 km)'
          )}
          {renderCounterInput(
            'mediumTrainJourneys',
            '🚄',
            'Medium Journey (200-400 km)'
          )}
          {renderCounterInput(
            'longTrainJourneys',
            '🚄',
            'Long Journey (Over 1000 km)'
          )}
        </div>
      </div>

      {/* Car Trips Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Car Trips</h3>
        <p className="text-gray-600 mb-4">
          How many car trips did you take last year? Select multiple to match your trip distance.
        </p>
        
        {/* Gasoline Car Trips */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Gasoline Car Trips</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderCounterInput(
              'shortGasolineTrips',
              '🚗',
              'Short Trip (< 400 km)'
            )}
            {renderCounterInput(
              'mediumGasolineTrips',
              '🚗',
              'Medium Trip (400-600 km)'
            )}
            {renderCounterInput(
              'longGasolineTrips',
              '🚗',
              'Long Trip (> 1000 km)'
            )}
          </div>
        </div>

        {/* Electric Car Trips */}
        <div>
          <h4 className="font-medium mb-2">Electric Car Trips</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderCounterInput(
              'shortElectricTrips',
              '🚙',
              'Short Trip (< 400 km)'
            )}
            {renderCounterInput(
              'mediumElectricTrips',
              '🚙',
              'Medium Trip (400-600 km)'
            )}
            {renderCounterInput(
              'longElectricTrips',
              '🚙',
              'Long Trip (> 1000 km)'
            )}
          </div>
        </div>
      </div>

      <button onClick={nextBucket} className="button">
        Next
      </button>
    </div>
  );
};

export default Travel; 