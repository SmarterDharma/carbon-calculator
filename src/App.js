import React, { useState } from 'react';
import Navigation from './components/Navigation';
import PersonalInfo from './components/PersonalInfo';
import Energy from './components/Energy';
import Commute from './components/Commute';
import Travel from './components/Travel';
import Lifestyle from './components/Lifestyle';
import Results from './components/Results';

function App() {
  const [activeBucket, setActiveBucket] = useState('personal');
  const [formData, setFormData] = useState({
    personal: {},
    energy: {},
    commute: {},
    travel: {},
    lifestyle: {}
  });

  const bucketOrder = ['personal', 'energy', 'commute', 'travel', 'lifestyle', 'result'];

  const updateFormData = (bucket, data) => {
    setFormData(prev => ({
      ...prev,
      [bucket]: { ...prev[bucket], ...data }
    }));
  };

  const handleNext = () => {
    const currentIndex = bucketOrder.indexOf(activeBucket);
    if (currentIndex < bucketOrder.length - 1 && validateCurrentSection()) {
      setActiveBucket(bucketOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = bucketOrder.indexOf(activeBucket);
    if (currentIndex > 0) {
      setActiveBucket(bucketOrder[currentIndex - 1]);
    }
  };

  const validateCurrentSection = () => {
    switch (activeBucket) {
      case 'personal':
        return validatePersonalInfo();
      case 'energy':
        return validateEnergy();
      case 'commute':
        return validateCommute();
      case 'travel':
        return validateTravel();
      case 'lifestyle':
        return validateLifestyle();
      default:
        return true;
    }
  };

  const validatePersonalInfo = () => {
    const { name, email, age, gender, pincode, household } = formData.personal || {};
    if (!name || !email || !age || !gender || !pincode || !household) {
      alert('Please fill in all required fields in Personal Information');
      return false;
    }
    return true;
  };

  const validateEnergy = () => {
    const { electricityUnits } = formData.energy || {};
    if (!electricityUnits && !formData.energy?.dontKnowUnits) {
      alert('Please enter your electricity units or select "Don\'t know your units"');
      return false;
    }
    return true;
  };

  const validateCommute = () => {
    const { selectedModes } = formData.commute || {};
    if (!selectedModes || selectedModes.length === 0) {
      alert('Please select at least one mode of commute');
      return false;
    }
    return true;
  };

  const validateTravel = () => {
    // At least one travel section should be filled
    const sections = ['showDomesticFlights', 'showInternationalFlights', 'showTrains', 'showGasolineCars', 'showElectricCars'];
    const hasFilledSection = sections.some(section => formData.travel?.[section]);
    if (!hasFilledSection) {
      alert('Please fill in at least one travel section');
      return false;
    }
    return true;
  };

  const validateLifestyle = () => {
    const { selectedDiet } = formData.lifestyle || {};
    if (!selectedDiet) {
      alert('Please select your diet preference');
      return false;
    }
    return true;
  };

  const resetCalculator = () => {
    setActiveBucket('personal');
    setFormData({
      personal: {},
      energy: {},
      commute: {},
      travel: {},
      lifestyle: {}
    });
  };

  const renderNavigationButtons = () => {
    const currentIndex = bucketOrder.indexOf(activeBucket);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === bucketOrder.length - 1;

    return (
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
            ${isFirst 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          disabled={isFirst}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
            ${isLast
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          disabled={isLast}
        >
          {currentIndex === bucketOrder.length - 2 ? 'View Results' : 'Next'}
        </button>
      </div>
    );
  };

  const renderActiveBucket = () => {
    switch (activeBucket) {
      case 'personal':
        return <PersonalInfo formData={formData.personal} updateFormData={updateFormData} />;
      case 'energy':
        return <Energy formData={formData.energy} updateFormData={updateFormData} />;
      case 'commute':
        return <Commute formData={formData.commute} updateFormData={updateFormData} />;
      case 'travel':
        return <Travel formData={formData.travel} updateFormData={updateFormData} />;
      case 'lifestyle':
        return <Lifestyle formData={formData.lifestyle} updateFormData={updateFormData} />;
      case 'result':
        return <Results formData={formData} resetCalculator={resetCalculator} />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation activeBucket={activeBucket} />
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {renderActiveBucket()}
        {activeBucket !== 'result' && renderNavigationButtons()}
      </main>
    </div>
  );
}

export default App; 