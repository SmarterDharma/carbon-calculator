import React from 'react';

const Travel = ({ formData, updateFormData }) => {
  const handleCountChange = (name, delta) => {
    const currentValue = formData?.[name] || 0;
    const newValue = Math.max(0, currentValue + delta);
    updateFormData('travel', { [name]: newValue });
  };

  const renderCounterInput = (name) => (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleCountChange(name, -1)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
      >
        <span className="text-xl font-medium">-</span>
      </button>
      <input
        type="number"
        name={name}
        min="0"
        max="20"
        value={formData?.[name] || 0}
        onChange={(e) => updateFormData('travel', { [name]: Math.max(0, parseInt(e.target.value) || 0) })}
        className="w-20 text-center input-field"
      />
      <button
        onClick={() => handleCountChange(name, 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
      >
        <span className="text-xl font-medium">+</span>
      </button>
    </div>
  );

  const toggleSection = (section) => {
    updateFormData('travel', {
      [`show${section}`]: !formData?.[`show${section}`]
    });
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Travel</h2>

      <div className="space-y-6">
        {/* Domestic Flights Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-left">Domestic Flights</h3>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.showDomesticFlights || false}
                onChange={() => toggleSection('DomesticFlights')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData?.showDomesticFlights && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Very Short
                    <span className="block text-xs text-gray-500">Under 500 km (1 hr)</span>
                  </label>
                  {renderCounterInput('domesticVeryShortFlights')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Short
                    <span className="block text-xs text-gray-500">500-1000 km (1-2 hrs)</span>
                  </label>
                  {renderCounterInput('domesticShortFlights')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Medium
                    <span className="block text-xs text-gray-500">1000-2000 km (2-3 hrs)</span>
                  </label>
                  {renderCounterInput('domesticMediumFlights')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Long
                    <span className="block text-xs text-gray-500">Over 2000 km (3+ hrs)</span>
                  </label>
                  {renderCounterInput('domesticLongFlights')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* International Flights Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-left">International Flights</h3>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.showInternationalFlights || false}
                onChange={() => toggleSection('InternationalFlights')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData?.showInternationalFlights && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Short
                    <span className="block text-xs text-gray-500">Under 3000 km (3-4 hrs)</span>
                  </label>
                  {renderCounterInput('internationalShortFlights')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Medium
                    <span className="block text-xs text-gray-500">3000-6000 km (4-7 hrs)</span>
                  </label>
                  {renderCounterInput('internationalMediumFlights')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Long
                    <span className="block text-xs text-gray-500">6000-10000 km (7-12 hrs)</span>
                  </label>
                  {renderCounterInput('internationalLongFlights')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    ✈️ Ultra Long
                    <span className="block text-xs text-gray-500">Over 10000 km (12+ hrs)</span>
                  </label>
                  {renderCounterInput('internationalUltraLongFlights')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Train Journeys Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-left">Train Journeys</h3>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.showTrains || false}
                onChange={() => toggleSection('Trains')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData?.showTrains && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚄 Local/Suburban
                    <span className="block text-xs text-gray-500">Under 100 km (1-2 hrs)</span>
                  </label>
                  {renderCounterInput('localTrainJourneys')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚄 Short Journey
                    <span className="block text-xs text-gray-500">100-300 km (3-5 hrs)</span>
                  </label>
                  {renderCounterInput('shortTrainJourneys')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚄 Medium Journey
                    <span className="block text-xs text-gray-500">300-800 km (6-12 hrs)</span>
                  </label>
                  {renderCounterInput('mediumTrainJourneys')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚄 Long Journey
                    <span className="block text-xs text-gray-500">Over 800 km (12+ hrs)</span>
                  </label>
                  {renderCounterInput('longTrainJourneys')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gasoline Car Trips Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-left">Gasoline Car Trips</h3>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.showGasolineCars || false}
                onChange={() => toggleSection('GasolineCars')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData?.showGasolineCars && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚗 Local Trip
                    <span className="block text-xs text-gray-500">Under 100 km (1-2 hrs)</span>
                  </label>
                  {renderCounterInput('localGasolineTrips')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚗 Short Trip
                    <span className="block text-xs text-gray-500">100-300 km (3-5 hrs)</span>
                  </label>
                  {renderCounterInput('shortGasolineTrips')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚗 Medium Trip
                    <span className="block text-xs text-gray-500">300-800 km (6-12 hrs)</span>
                  </label>
                  {renderCounterInput('mediumGasolineTrips')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚗 Long Trip
                    <span className="block text-xs text-gray-500">Over 800 km (12+ hrs)</span>
                  </label>
                  {renderCounterInput('longGasolineTrips')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Electric Car Trips Section */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-left">Electric Car Trips</h3>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.showElectricCars || false}
                onChange={() => toggleSection('ElectricCars')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData?.showElectricCars && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚙 Local Trip
                    <span className="block text-xs text-gray-500">Under 100 km (1-2 hrs)</span>
                  </label>
                  {renderCounterInput('localElectricTrips')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚙 Short Trip
                    <span className="block text-xs text-gray-500">100-300 km (3-5 hrs)</span>
                  </label>
                  {renderCounterInput('shortElectricTrips')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚙 Medium Trip
                    <span className="block text-xs text-gray-500">300-800 km (6-12 hrs)</span>
                  </label>
                  {renderCounterInput('mediumElectricTrips')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    🚙 Long Trip
                    <span className="block text-xs text-gray-500">Over 800 km (12+ hrs)</span>
                  </label>
                  {renderCounterInput('longElectricTrips')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Travel; 