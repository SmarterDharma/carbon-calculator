import React from 'react';

const Energy = ({ formData, updateFormData, nextBucket }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData('energy', { [name]: value });
  };

  const toggleBillInput = () => {
    const dontKnowUnits = formData?.dontKnowUnits || false;
    updateFormData('energy', { dontKnowUnits: !dontKnowUnits });
  };

  const calculateUnitsFromBill = (bill) => {
    if (!bill) return '';
    let units = 0;
    if (bill <= 200) {
      units = 125;
    } else {
      units = bill / 7.11;
    }
    return units.toFixed(2);
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Energy Consumption</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Average electricity units per month:
          </label>
          <input
            type="number"
            name="electricityUnits"
            value={formData?.electricityUnits || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter units"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="dontKnowUnits"
            checked={formData?.dontKnowUnits || false}
            onChange={toggleBillInput}
            className="mr-2"
          />
          <label htmlFor="dontKnowUnits">Don't know your units?</label>
        </div>

        {formData?.dontKnowUnits && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your monthly electricity bill (in Rupees):
            </label>
            <input
              type="number"
              name="electricityBill"
              value={formData?.electricityBill || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter bill amount"
            />
            <div className="mt-2 p-3 bg-white rounded border">
              <p className="font-medium">Estimated Units:</p>
              <input
                type="text"
                value={calculateUnitsFromBill(formData?.electricityBill)}
                readOnly
                className="input-field bg-gray-50"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How many LPG cylinders do you use monthly?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="lpgCylinders"
              min="0"
              max="5"
              value={formData?.lpgCylinders || 0}
              onChange={handleInputChange}
              className="w-full"
            />
            <span>{formData?.lpgCylinders || 0}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How many Geysers do you use regularly?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="geysers"
              min="0"
              max="5"
              value={formData?.geysers || 0}
              onChange={handleInputChange}
              className="w-full"
            />
            <span>{formData?.geysers || 0}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-4">Solar Setup</h3>
          
          <div className="space-y-4">
            <button
              onClick={() => updateFormData('energy', { 
                solarPV: !formData?.solarPV 
              })}
              className={`px-4 py-2 rounded ${
                formData?.solarPV 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}
            >
              Solar PV Setup
            </button>

            {formData?.solarPV && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (kWp):
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="solarPVCapacity"
                    min="1"
                    max="1000"
                    value={formData?.solarPVCapacity || 1}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.solarPVCapacity || 1}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => updateFormData('energy', { 
                solarWater: !formData?.solarWater 
              })}
              className={`px-4 py-2 rounded ${
                formData?.solarWater 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}
            >
              Solar Water Heater
            </button>

            {formData?.solarWater && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (Liters):
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="solarWaterCapacity"
                    min="1"
                    max="1000"
                    value={formData?.solarWaterCapacity || 1}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <span>{formData?.solarWaterCapacity || 1}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={nextBucket} className="button">
          Next
        </button>
      </div>
    </div>
  );
};

export default Energy; 