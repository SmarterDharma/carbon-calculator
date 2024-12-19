// Electricity and LPG Factors
export const ENERGY_FACTORS = {
  ELECTRICITY: 0.716, // kg CO2 per unit
  LPG: 44.446, // kg CO2 per cylinder
  ELECTRICITY_BILL_TO_UNITS: 7.11 // conversion rate from bill to units
};

// Electricity rates by city pincodes
export const ELECTRICITY_RATES = {
  "400": [ // Mumbai
    { maxUnits: 10, rate: 27 },
    { maxUnits: 100, rate: 5 },
    { maxUnits: 300, rate: 6 },
    { maxUnits: 500, rate: 7 },
    { maxUnits: Infinity, rate: 8 }
  ],
  "110": [ // Delhi
    { maxUnits: 10, rate: 17 },
    { maxUnits: 100, rate: 8 },
    { maxUnits: 400, rate: 5 },
    { maxUnits: 1200, rate: 7 },
    { maxUnits: 1500, rate: 8 }
  ],
  "560": [ // Bangalore
    { maxUnits: 45, rate: 5.9, fixedCharge: 120 },
    { maxUnits: 90, rate: 5.9, fixedCharge: 240 },
    { maxUnits: 135, rate: 5.9, fixedCharge: 360 },
    { maxUnits: 180, rate: 5.9, fixedCharge: 480 },
    { maxUnits: Infinity, rate: 5.9, fixedCharge: 600 }
  ],
  "600": [ // Chennai
    { maxUnits: 200, rate: 4.8, whelingChargePerUnit: 1.59},
    { maxUnits: 250, rate: 6.45, whelingChargePerUnit: 1.59 },
    { maxUnits: 300, rate: 8.5, whelingChargePerUnit: 1.59 },
    { maxUnits: 400, rate: 9.65, whelingChargePerUnit: 1.59 },
    { maxUnits: 500, rate: 10.7, whelingChargePerUnit: 1.59 },
    { maxUnits: Infinity, rate: 11.8, whelingChargePerUnit: 1.59 }
  ],
  "500": [ // Hyderabad
    { maxUnits: 20, rate: 22 },
    { maxUnits: 100, rate: 6 },
    { maxUnits: 400, rate: 7 },
    { maxUnits: Infinity, rate: 10 }
  ],
  "682": [ // Cochin
    { maxUnits: 20, rate: 17 },
    { maxUnits: 100, rate: 5 },
    { maxUnits: 500, rate: 8 },
    { maxUnits: Infinity, rate: 9 }
  ],
  "530": [ // Vizag
    { maxUnits: 20, rate: 21 },
    { maxUnits: 100, rate: 7 },
    { maxUnits: 225, rate: 10 },
    { maxUnits: Infinity, rate: 11 }
  ],
  "700": [ // Kolkata
    { maxUnits: 20, rate: 12 },
    { maxUnits: 300, rate: 9 },
    { maxUnits: Infinity, rate: 11 }
  ],
  "751": [ // Bhubaneswar
    { maxUnits: 30, rate: 3 },
    { maxUnits: 100, rate: 11 },
    { maxUnits: 500, rate: 8 },
    { maxUnits: Infinity, rate: 7 }
  ],
  "160": [ // Chandigarh
    { maxUnits: 10, rate: 8 },
    { maxUnits: 150, rate: 3 },
    { maxUnits: 400, rate: 4 },
    { maxUnits: Infinity, rate: 5 }
  ],
  "411": [ // Pune
    { maxUnits: 10, rate: 19 },
    { maxUnits: 100, rate: 9 },
    { maxUnits: 676, rate: 6 },
    { maxUnits: Infinity, rate: 5 }
  ],
  "380": [ // Ahmedabad
    { maxUnits: 30, rate: 14 },
    { maxUnits: Infinity, rate: 5 }
  ],
  "default": [ // Any other pincode
    { maxUnits: 50, rate: 18.9 },
    { maxUnits: Infinity, rate: 7.6 }
  ]
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
  domesticVeryShort: 0.121,
  domesticShort: 0.121,
  domesticMedium: 0.121,
  domesticLong: 0.121,
  
  // International Flights
  internationalShort: 0.121,
  internationalMedium: 0.110,
  internationalLong: 0.0741,
  internationalUltraLong: 0.0741
};

export const TRAIN_FACTORS = {
  localTrain: 0.007963,
  shortTrain: 0.007963,
  mediumTrain: 0.007963,
  longTrain: 0.007963
};

export const CAR_FACTORS = {
  gasolineLocal: 0.1874,
  gasolineShort: 0.1874,
  gasolineMedium: 0.1874,
  gasolineLong: 0.1874,
  
  electricLocal: 0.0895,
  electricShort: 0.0895,
  electricMedium: 0.0895,
  electricLong: 0.0895
};

// Lifestyle Emission Factors
export const MEAL_FACTORS = {
  plantBased: 0.575,      // kg CO2e per meal
  vegetarian: 0.66,
  egg: 0.675,
  chickenFish: 0.71,
  redMeat: 1.0
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
