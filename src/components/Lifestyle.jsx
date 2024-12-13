import React from 'react';

const Lifestyle = ({ formData, updateFormData, nextBucket }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData('lifestyle', { [name]: value });
  };

  const toggleDietOption = (option) => {
    updateFormData('lifestyle', {
      selectedDiet: formData?.selectedDiet === option ? null : option
    });
  };

  const selectFashionFrequency = (frequency) => {
    updateFormData('lifestyle', { fashionFrequency: frequency });
  };

  const selectCompostOption = (option) => {
    updateFormData('lifestyle', { compostOption: option });
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Lifestyle</h2>

      {/* Diet Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Food Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'vegan', label: '🌱 Vegan' },
            { id: 'vegetarian', label: '🥦 Vegetarian' },
            { id: 'ovoVegetarian', label: '🍳 Ovo-Vegetarian' },
            { id: 'nonVegetarian', label: '🍗 Non-Vegetarian' }
          ].map(diet => (
            <div
              key={diet.id}
              onClick={() => toggleDietOption(diet.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-colors
                ${formData?.selectedDiet === diet.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'}`}
            >
              {diet.label}
            </div>
          ))}
        </div>

        {/* Diet-specific sliders */}
        {formData?.selectedDiet && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
            {formData.selectedDiet === 'vegan' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many Vegan meals do you have in a week?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="veganMeals"
                    min="0"
                    max="50"
                    value={formData?.veganMeals || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.veganMeals || 0}</span>
                </div>
              </div>
            )}

            {formData.selectedDiet === 'vegetarian' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many Vegetarian meals do you have in a week?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="vegetarianMeals"
                    min="0"
                    max="50"
                    value={formData?.vegetarianMeals || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.vegetarianMeals || 0}</span>
                </div>
              </div>
            )}

            {formData.selectedDiet === 'ovoVegetarian' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many Egg meals do you have in a week?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="eggMeals"
                    min="0"
                    max="50"
                    value={formData?.eggMeals || 0}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.eggMeals || 0}</span>
                </div>
              </div>
            )}

            {formData.selectedDiet === 'nonVegetarian' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many Non-vegetarian meals do you have in a week? (Fish & Chicken)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="nonVegMeals"
                      min="0"
                      max="50"
                      value={formData?.nonVegMeals || 0}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <span>{formData?.nonVegMeals || 0}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many red meat meals do you have in a week? (Mutton & Beef)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="redMeatMeals"
                      min="0"
                      max="50"
                      value={formData?.redMeatMeals || 0}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <span>{formData?.redMeatMeals || 0}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Fashion Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Fashion</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How often do you buy new clothing?
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'once', label: 'Once a Month' },
            { id: 'twice', label: 'Twice a Month' },
            { id: 'thrice', label: 'Thrice a Month' }
          ].map(freq => (
            <button
              key={freq.id}
              onClick={() => selectFashionFrequency(freq.id)}
              className={`px-4 py-2 rounded-lg transition-colors
                ${formData?.fashionFrequency === freq.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compost Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Compost</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you compost wet waste at your home?
        </label>
        <div className="flex gap-4">
          {['yes', 'no'].map(option => (
            <button
              key={option}
              onClick={() => selectCompostOption(option)}
              className={`px-6 py-2 rounded-lg capitalize transition-colors
                ${formData?.compostOption === option
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button onClick={nextBucket} className="button">
        Submit
      </button>
    </div>
  );
};

export default Lifestyle; 