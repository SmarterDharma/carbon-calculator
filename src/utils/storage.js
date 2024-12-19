export const saveResult = async (result) => {
  try {
    // await fetch('http://localhost:5001/v2/carbon-calculator', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(result),
    // });
    
    return result;
  } catch (error) {
    console.error('Error saving result:', error);
    return null;
  }
};

export const clearResults = () => {
  localStorage.removeItem('carbonFootprints');
}; 