import React, { useState } from 'react';

const PersonalInfo = ({ formData, updateFormData }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For number inputs, convert string to number
    const numericFields = ['age', 'household'];
    const finalValue = numericFields.includes(name) ? Number(value) : value;
    updateFormData('personal', { [name]: finalValue });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getInputClassName = (fieldName) => {
    return `input-field ${errors[fieldName] ? 'border-red-500' : ''}`;
  };

  return (
    <div className="section-container max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData?.name || ''}
              onChange={handleInputChange}
              className={getInputClassName('name')}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ID: <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData?.email || ''}
              onChange={handleInputChange}
              className={getInputClassName('email')}
              placeholder="Email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={formData?.age || ''}
              onChange={handleInputChange}
              className={getInputClassName('age')}
              placeholder="Enter your age"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender: <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData?.gender || ''}
              onChange={handleInputChange}
              className={getInputClassName('gender')}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData?.pincode || ''}
              onChange={handleInputChange}
              className={getInputClassName('pincode')}
              placeholder="Enter your pincode"
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. of people living in your household: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="household"
              min="1"
              max="20"
              value={formData?.household || ''}
              onChange={handleInputChange}
              className={getInputClassName('household')}
              placeholder="Enter number of people"
            />
            {errors.household && <p className="text-red-500 text-sm mt-1">{errors.household}</p>}
            <p className="text-sm text-gray-500 mt-1">
              This helps us calculate per-person emissions more accurately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo; 