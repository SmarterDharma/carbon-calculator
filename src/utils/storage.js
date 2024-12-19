import { calculateFootprints } from '../components/utils';

export const saveResult = async (formData) => {
  try {
    const result = calculateFootprints(formData);

    await fetch('https://calculess-alpha.sdplus.io/v2/carbon-calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });
    
    return result;
  } catch (error) {
    console.error('Error saving result:', error);
    return null;
  }
};