import React from 'react';

const PersonalInfo = ({ formData, updateFormData, nextBucket }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For number inputs, convert string to number
    const numericFields = ['age', 'household'];
    const finalValue = numericFields.includes(name) ? Number(value) : value;
    updateFormData('personal', { [name]: finalValue });
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData?.name || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email ID:
          </label>
          <input
            type="email"
            name="email"
            value={formData?.email || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age:
          </label>
          <input
            type="number"
            name="age"
            min="1"
            max="120"
            value={formData?.age || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender:
          </label>
          <select
            name="gender"
            value={formData?.gender || ''}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode:
          </label>
          <input
            type="text"
            name="pincode"
            value={formData?.pincode || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter your pincode"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No. of people living in your household:
          </label>
          <input
            type="number"
            name="household"
            min="1"
            max="20"
            value={formData?.household || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter number of people"
          />
          <p className="text-sm text-gray-500 mt-1">
            This helps us calculate per-person emissions more accurately
          </p>
        </div>

        <button 
          onClick={nextBucket} 
          className="button w-full md:w-auto"
          disabled={!formData?.name || !formData?.email || !formData?.age || !formData?.household}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo; 