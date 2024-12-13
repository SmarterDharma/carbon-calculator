import React from 'react';

const Lifestyle = ({ formData, updateFormData, nextBucket }) => {
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'range' ? parseInt(value) : value;
    updateFormData('lifestyle', { [name]: finalValue });
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
        max="50"
        value={formData?.[name] || 0}
        onChange={(e) => updateFormData('lifestyle', { [name]: Math.max(0, parseInt(e.target.value) || 0) })}
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

  const handleCountChange = (name, delta) => {
    const currentValue = formData?.[name] || 0;
    const newValue = Math.max(0, currentValue + delta);
    updateFormData('lifestyle', { [name]: newValue });
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Lifestyle</h2>

      <div className="space-y-6">
        {/* Diet Section */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-left">Food Preferences</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'vegan', label: '🌱 Vegan' },
                { id: 'vegetarian', label: '🥦 Vegetarian' },
                { id: 'ovoVegetarian', label: '🍳 Ovo-Vegetarian' },
                { id: 'nonVegetarian', label: '🍗 Non-Vegetarian' }
              ].map(diet => (
                <div
                  key={diet.id}
                  onClick={() => updateFormData('lifestyle', { selectedDiet: diet.id })}
                  className={`p-3 border-2 rounded-lg cursor-pointer text-center
                    ${formData?.selectedDiet === diet.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'}`}
                >
                  {diet.label}
                </div>
              ))}
            </div>

            {formData?.selectedDiet && (
              <div className="mt-4 space-y-6">
                {formData.selectedDiet === 'vegan' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Plant-based meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="plantBasedMeals"
                          min="0"
                          max="21"
                          value={formData?.plantBasedMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="plantBasedMeals"
                          min="0"
                          max="21"
                          value={formData?.plantBasedMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.selectedDiet === 'vegetarian' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Vegetarian meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="vegetarianMeals"
                          min="0"
                          max="21"
                          value={formData?.vegetarianMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="vegetarianMeals"
                          min="0"
                          max="21"
                          value={formData?.vegetarianMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.selectedDiet === 'ovoVegetarian' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Egg meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="eggMeals"
                          min="0"
                          max="21"
                          value={formData?.eggMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="eggMeals"
                          min="0"
                          max="21"
                          value={formData?.eggMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Vegetarian meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="vegetarianMeals"
                          min="0"
                          max="21"
                          value={formData?.vegetarianMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="vegetarianMeals"
                          min="0"
                          max="21"
                          value={formData?.vegetarianMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.selectedDiet === 'nonVegetarian' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Chicken/Fish meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="chickenFishMeals"
                          min="0"
                          max="21"
                          value={formData?.chickenFishMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="chickenFishMeals"
                          min="0"
                          max="21"
                          value={formData?.chickenFishMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Mutton/Beef meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="redMeatMeals"
                          min="0"
                          max="21"
                          value={formData?.redMeatMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="redMeatMeals"
                          min="0"
                          max="21"
                          value={formData?.redMeatMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        Vegetarian meals per week
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          name="vegetarianMeals"
                          min="0"
                          max="21"
                          value={formData?.vegetarianMeals || 0}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                        <input
                          type="number"
                          name="vegetarianMeals"
                          min="0"
                          max="21"
                          value={formData?.vegetarianMeals || 0}
                          onChange={handleInputChange}
                          className="w-20 text-center input-field"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fashion Section */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-left">Fashion</h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              How often do you buy new clothing?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'once', label: 'Once a Month' },
                { id: 'twice', label: 'Twice a Month' },
                { id: 'thrice', label: 'Thrice a Month' }
              ].map(freq => (
                <div
                  key={freq.id}
                  onClick={() => updateFormData('lifestyle', { fashionFrequency: freq.id })}
                  className={`p-3 border-2 rounded-lg cursor-pointer text-center
                    ${formData?.fashionFrequency === freq.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'}`}
                >
                  {freq.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compost Section */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-left">Compost</h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Do you compost wet waste at your home?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['yes', 'no'].map(option => (
                <div
                  key={option}
                  onClick={() => updateFormData('lifestyle', { compostOption: option })}
                  className={`p-3 border-2 rounded-lg cursor-pointer text-center capitalize
                    ${formData?.compostOption === option 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'}`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={nextBucket} className="button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Lifestyle; 