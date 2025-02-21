import React from 'react';
import { handleNonNegativeInput } from './utils';

const Lifestyle = ({ formData, updateFormData }) => {
  const handleInputChange = (e) => {
    const { name, type } = e.target;
    let value;

    if (type === 'number') {
      value = handleNonNegativeInput(e);
    } else {
      value = e.target.value;
    }

    updateFormData('lifestyle', { [name]: value });
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
                { 
                  id: 'vegan', 
                  label: '🌱 Vegan',
                  description: 'Plant-based diet only, no animal products'
                },
                { 
                  id: 'vegetarian', 
                  label: '🥦 Vegetarian',
                  description: 'Plant-based + dairy products'
                },
                { 
                  id: 'ovoVegetarian', 
                  label: '🍳 Ovo-Vegetarian',
                  description: 'Vegetarian + eggs'
                },
                { 
                  id: 'nonVegetarian', 
                  label: '🍗 Non-Vegetarian',
                  description: 'All types of food including meat'
                }
              ].map(diet => (
                <div
                  key={diet.id}
                  onClick={() => updateFormData('lifestyle', { selectedDiet: diet.id })}
                  className={`p-3 border-2 rounded-lg cursor-pointer
                    ${formData?.selectedDiet === diet.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'}`}
                >
                  <div className="text-center">
                    <div className="mb-1">{diet.label}</div>
                    <p className="text-xs text-gray-600">{diet.description}</p>
                  </div>
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
              How many times do you shop for clothes in a year?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="fashionFrequency"
                min="0"
                max="24"
                step="1"
                value={formData?.fashionFrequency || 0}
                onChange={handleInputChange}
                className="w-full"
              />
              <input
                type="number"
                name="fashionFrequency"
                min="0"
                max="24"
                value={formData?.fashionFrequency || 0}
                onChange={handleInputChange}
                className="w-20 text-center input-field"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1 text-left">
              Average: 12 times per year (monthly shopping)
            </p>
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
      </div>
    </div>
  );
};

export default Lifestyle; 