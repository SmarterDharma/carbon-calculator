import React from 'react';
import { calculateUnitsFromBill, handleNonNegativeInput } from './utils';

const Energy = ({ formData, updateFormData, pincode }) => {
  const handleInputChange = (e) => {
    const { name, type } = e.target;
    let value;

    if (type === 'number') {
      value = handleNonNegativeInput(e);
    } else {
      value = e.target.value;
    }

    updateFormData('energy', { [name]: value });
  };

  const toggleBillInput = () => {
    const dontKnowUnits = formData?.dontKnowUnits || false;
    updateFormData('energy', { 
      dontKnowUnits: !dontKnowUnits,
      electricityUnits: !dontKnowUnits ? 0 : formData?.electricityUnits
    });
  };

  const calculateUnitsDisplay = (bill) => {
    if (!bill) return '';
    const units = calculateUnitsFromBill(bill, pincode);
    return units.toFixed(2);
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Energy Consumption</h2>

      <div className="space-y-4">
        <div className="pb-4 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Average electricity units per month:
            </label>
            <input
              type="number"
              name="electricityUnits"
              value={formData?.dontKnowUnits ? 0 : formData?.electricityUnits || ''}
              onChange={handleInputChange}
              className={`input-field ${formData?.dontKnowUnits ? 'bg-gray-100' : ''}`}
              placeholder="Enter units"
              disabled={formData?.dontKnowUnits}
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
            <label htmlFor="dontKnowUnits" className="text-sm text-left">Don't know your units?</label>
          </div>

          {formData?.dontKnowUnits && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
                <p className="font-medium text-left">Estimated Units:</p>
                <input
                  type="text"
                  value={calculateUnitsDisplay(formData?.electricityBill)}
                  readOnly
                  className="input-field bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pb-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            How many LPG cylinders do you use yearly?
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="lpgCylinders"
                min="0"
                max="24"
                step="1"
                value={formData?.lpgCylinders || 0}
                onChange={handleInputChange}
                className="w-full"
              />
              <input
                type="number"
                name="lpgCylinders"
                min="0"
                max="24"
                value={formData?.lpgCylinders || 0}
                onChange={handleInputChange}
                className="w-20 text-center input-field"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1 text-left">
            Average household uses 8-12 cylinders per year
          </p>
        </div>

        <div className="pb-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
            How many Geysers do you use regularly?
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="geysers"
                min="0"
                max="5"
                step="1"
                value={formData?.geysers || 0}
                onChange={handleInputChange}
                className="w-full"
              />
              <input
                type="number"
                name="geysers"
                min="0"
                max="5"
                value={formData?.geysers || 0}
                onChange={handleInputChange}
                className="w-20 text-center input-field"
              />
            </div>
            <datalist id="geyser-ticks">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </datalist>
          </div>
          <p className="text-sm text-gray-500 mt-1 text-left">
            Typical household: 1-2 geysers, Large home: 3-5 geysers
          </p>
        </div>

        <div className="pb-4 border-b border-gray-200">
          <h3 className="font-medium mb-4 text-left">Solar Setup</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="solarPV" className="text-sm font-medium text-gray-700 text-left">
                Solar PV Setup
              </label>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  id="solarPV"
                  checked={formData?.solarPV || false}
                  onChange={() => updateFormData('energy', { 
                    solarPV: !formData?.solarPV 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {formData?.solarPV && (
              <div className="p-4 bg-gray-50 rounded-lg ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Capacity (kWp):
                </label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="solarPVCapacity"
                      min="0"
                      max="50"
                      step="5"
                      value={formData?.solarPVCapacity || 0}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="solarPVCapacity"
                        min="0"
                        max="50"
                        step="5"
                        value={formData?.solarPVCapacity || 0}
                        onChange={handleInputChange}
                        className="w-20 text-center input-field"
                      />
                      <span className="ml-1">kWp</span>
                    </div>
                  </div>
                  <datalist id="solar-pv-ticks">
                    {Array.from({length: 10}, (_, i) => (i + 1) * 5).map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </datalist>
                </div>
                <p className="text-sm text-gray-500 mt-1 text-left">
                  Typical home setup: 5-10 kWp, Commercial: 15-50 kWp
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label htmlFor="solarWater" className="text-sm font-medium text-gray-700 text-left">
                Solar Water Heater
              </label>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  id="solarWater"
                  checked={formData?.solarWater || false}
                  onChange={() => updateFormData('energy', { 
                    solarWater: !formData?.solarWater 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {formData?.solarWater && (
              <div className="p-4 bg-gray-50 rounded-lg ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Capacity (Liters):
                </label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="solarWaterCapacity"
                      min="0"
                      max="500"
                      step="50"
                      value={formData?.solarWaterCapacity || 0}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="solarWaterCapacity"
                        min="0"
                        max="500"
                        step="50"
                        value={formData?.solarWaterCapacity || 0}
                        onChange={handleInputChange}
                        className="w-20 text-center input-field"
                      />
                      <span className="ml-1">L</span>
                    </div>
                  </div>
                  <datalist id="solar-water-ticks">
                    {Array.from({length: 9}, (_, i) => (i * 50) + 100).map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </datalist>
                </div>
                <p className="text-sm text-gray-500 mt-1 text-left">
                  Small family: 100-200L, Large family: 250-300L, Commercial: 300-500L
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Energy; 