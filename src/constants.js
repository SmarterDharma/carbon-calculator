// Electricity and LPG Factors
export const ENERGY_FACTORS = {
  ELECTRICITY: 0.716, // kg CO2 per unit
  LPG: 44.446, // kg CO2 per cylinder
  ELECTRICITY_BILL_TO_UNITS: 7.11 // conversion rate from bill to units
};

// Commute Emission Factors (kg CO2 per km)
export const COMMUTE_FACTORS = {
  'walk-cycle': 0,
  'public-transport': 0.027178,
  'two-wheeler-electric': 0.02864,
  'two-wheeler-petrol': 0.0448,
  'three-wheeler': 0.10768,
  'four-wheeler-electric': 0.0895,
  'four-wheeler-hatchback': 0.1441,
  'four-wheeler-suv': 0.20992
};

// Travel Emission Factors
export const FLIGHT_FACTORS = {
  // Domestic Flights (kg CO2 per km)
  domesticVeryShort: 0.145,
  domesticShort: 0.133,
  domesticMedium: 0.127,
  domesticLong: 0.121,
  
  // International Flights
  internationalShort: 0.121,
  internationalMedium: 0.110,
  internationalLong: 0.095,
  internationalUltraLong: 0.085
};

export const TRAIN_FACTORS = {
  localTrain: 0.029,
  shortTrain: 0.027,
  mediumTrain: 0.025,
  longTrain: 0.024
};

export const CAR_FACTORS = {
  gasolineLocal: 0.171,
  gasolineShort: 0.165,
  gasolineMedium: 0.160,
  gasolineLong: 0.155,
  
  electricLocal: 0.053,
  electricShort: 0.051,
  electricMedium: 0.049,
  electricLong: 0.047
};

// Lifestyle Emission Factors
export const MEAL_FACTORS = {
  plantBased: 0.42,      // kg CO2e per meal
  vegetarian: 0.52,
  egg: 0.62,
  chickenFish: 0.72,
  redMeat: 1.05
};

export const WASTE_FACTORS = {
  composting: 0.32,
  landfilling: 1.29
};

export const FASHION_FACTORS = {
  once: 100,
  twice: 200,
  thrice: 300
};

// Chart Colors
export const CHART_COLORS = {
  backgroundColor: [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ],
  borderColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]
};
