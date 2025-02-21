import React, { useState } from 'react';
import { handleNonNegativeInput } from './utils';

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

const Travel = ({ formData, updateFormData }) => {
  const [openSection, setOpenSection] = useState(null);

  const handleInputChange = (e) => {
    const { name, type } = e.target;
    let value;

    if (type === 'number') {
      value = handleNonNegativeInput(e);
    } else {
      value = e.target.value;
    }

    updateFormData('travel', { [name]: value });
  };

  const handleCountChange = (name, delta) => {
    const currentValue = formData?.[name] || 0;
    const newValue = Math.max(0, currentValue + delta);
    updateFormData('travel', { [name]: newValue });
  };

  const toggleAccordion = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  const isAccordionFilled = (section) => {
    switch(section) {
      case 'DomesticFlights':
        return formData?.domesticVeryShortFlights > 0 || 
               formData?.domesticShortFlights > 0 || 
               formData?.domesticMediumFlights > 0 || 
               formData?.domesticLongFlights > 0;
      case 'InternationalFlights':
        return formData?.internationalShortFlights > 0 || 
               formData?.internationalMediumFlights > 0 || 
               formData?.internationalLongFlights > 0 || 
               formData?.internationalUltraLongFlights > 0;
      case 'Trains':
        return formData?.localTrainJourneys > 0 || 
               formData?.shortTrainJourneys > 0 || 
               formData?.mediumTrainJourneys > 0 || 
               formData?.longTrainJourneys > 0;
      case 'GasolineCars':
        return formData?.localGasolineTrips > 0 || 
               formData?.shortGasolineTrips > 0 || 
               formData?.mediumGasolineTrips > 0 || 
               formData?.longGasolineTrips > 0;
      case 'ElectricCars':
        return formData?.localElectricTrips > 0 || 
               formData?.shortElectricTrips > 0 || 
               formData?.mediumElectricTrips > 0 || 
               formData?.longElectricTrips > 0;
      default:
        return false;
    }
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
        onChange={handleInputChange}
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

  const renderSection = (title, section, emoji, children) => (
    <div className="border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => toggleAccordion(section)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-left flex items-center gap-2">
            {emoji} {title}
          </h3>
          {isAccordionFilled(section) && (
            <CheckIcon />
          )}
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            openSection === section ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openSection === section && (
        <div className="px-4 py-3 bg-gray-50 border-t">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Travel</h2>
      <p className="text-gray-600 text-sm mb-2">Please enter your travel details for the last year</p>
      <p className="text-gray-600 text-sm mb-6">Note: All trips should be counted as one-way journeys</p>

      <div className="space-y-4">
        {renderSection('Domestic Flights', 'DomesticFlights', '✈️', (
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
        ))}

        {renderSection('International Flights', 'InternationalFlights', '✈️', (
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
        ))}

        {renderSection('Train Journeys', 'Trains', '🚄', (
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
        ))}

        {renderSection('Petrol/Diesel Cars', 'GasolineCars', '🚗', (
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
        ))}

        {renderSection('Electric Car Trips', 'ElectricCars', '🚙', (
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
        ))}
      </div>
    </div>
  );
};

export default Travel; 