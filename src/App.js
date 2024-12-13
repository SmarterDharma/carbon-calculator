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

  const updateFormData = (bucket, data) => {
    setFormData(prev => ({
      ...prev,
      [bucket]: { ...prev[bucket], ...data }
    }));
  };

  const renderActiveBucket = () => {
    switch (activeBucket) {
      case 'personal':
        return <PersonalInfo formData={formData.personal} updateFormData={updateFormData} nextBucket={() => setActiveBucket('energy')} />;
      case 'energy':
        return <Energy formData={formData.energy} updateFormData={updateFormData} nextBucket={() => setActiveBucket('commute')} />;
      case 'commute':
        return <Commute formData={formData.commute} updateFormData={updateFormData} nextBucket={() => setActiveBucket('travel')} />;
      case 'travel':
        return <Travel formData={formData.travel} updateFormData={updateFormData} nextBucket={() => setActiveBucket('lifestyle')} />;
      case 'lifestyle':
        return <Lifestyle formData={formData.lifestyle} updateFormData={updateFormData} nextBucket={() => setActiveBucket('result')} />;
      case 'result':
        return <Results formData={formData} />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeBucket={activeBucket} setActiveBucket={setActiveBucket} />
      <main className="container mx-auto px-4 py-8">
        {renderActiveBucket()}
      </main>
    </div>
  );
}

export default App; 