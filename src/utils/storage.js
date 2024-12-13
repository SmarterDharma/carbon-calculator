export const saveResult = (result) => {
  try {
    // Get existing results
    const existingResults = JSON.parse(localStorage.getItem('carbonFootprints') || '[]');
    
    // Add timestamp to the new result
    const resultWithTimestamp = {
      ...result,
      timestamp: new Date().toISOString(),
      id: Date.now() // Unique identifier
    };
    
    // Add new result to the array
    existingResults.push(resultWithTimestamp);
    
    // Save back to localStorage
    localStorage.setItem('carbonFootprints', JSON.stringify(existingResults));
    
    return resultWithTimestamp;
  } catch (error) {
    console.error('Error saving result:', error);
    return null;
  }
};

export const getAllResults = () => {
  try {
    return JSON.parse(localStorage.getItem('carbonFootprints') || '[]');
  } catch (error) {
    console.error('Error getting results:', error);
    return [];
  }
};

export const clearResults = () => {
  localStorage.removeItem('carbonFootprints');
}; 