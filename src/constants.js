// Electricity and LPG Factors
export const ENERGY_FACTORS = {
  ELECTRICITY: 0.716, // kg CO2 per unit
  LPG: 44.446, // kg CO2 per cylinder
  ELECTRICITY_BILL_TO_UNITS: 7.11, // conversion rate from bill to units
};

// Electricity rates by city pincodes
export const ELECTRICITY_RATES = {
  400: [
    { maxUnits: 100, fixedCharge: 90, rate: 3.15, whelingCharge: 2.6 },
    { maxUnits: 300, fixedCharge: 135, rate: 5.4, whelingCharge: 2.6 },
    { maxUnits: 500, fixedCharge: 135, rate: 7.1, whelingCharge: 2.6 },
    {
      maxUnits: Infinity,
      fixedCharge: 160,
      rate: 8.15,
      whelingCharge: 2.6,
    },
  ],
  110: [
    { maxUnits: 2, fixedCharge: 20, rate: 3, whelingCharge: 0 },
    { maxUnits: 50, fixedCharge: 50, rate: 3, whelingCharge: 0 },
    { maxUnits: 15, fixedCharge: 100, rate: 3, whelingCharge: 0 },
    { maxUnits: 25, fixedCharge: 200, rate: 3, whelingCharge: 0 },
    { maxUnits: 200, fixedCharge: 250, rate: 3, whelingCharge: 0 },
    { maxUnits: 400, fixedCharge: 250, rate: 4.5, whelingCharge: 0 },
    { maxUnits: 800, fixedCharge: 250, rate: 6.5, whelingCharge: 0 },
    { maxUnits: 1200, fixedCharge: 250, rate: 7, whelingCharge: 0 },
    { maxUnits: Infinity, fixedCharge: 250, rate: 8, whelingCharge: 0 },
  ],
  560: [
    { maxUnits: 45, fixedCharge: 120, rate: 5.9, whelingCharge: 0 },
    { maxUnits: 90, fixedCharge: 240, rate: 5.9, whelingCharge: 0 },
    { maxUnits: 135, fixedCharge: 360, rate: 5.9, whelingCharge: 0 },
    { maxUnits: 180, fixedCharge: 480, rate: 5.9, whelingCharge: 0 },
    {
      maxUnits: Infinity,
      fixedCharge: 600,
      rate: 5.9,
      whelingCharge: 0,
    },
  ],
  600: [
    { maxUnits: 200, fixedCharge: 0, rate: 4.8, whelingCharge: 1.59 },
    { maxUnits: 250, fixedCharge: 0, rate: 6.45, whelingCharge: 1.59 },
    { maxUnits: 300, fixedCharge: 0, rate: 8.55, whelingCharge: 1.59 },
    { maxUnits: 400, fixedCharge: 0, rate: 9.65, whelingCharge: 1.59 },
    { maxUnits: 500, fixedCharge: 0, rate: 10.7, whelingCharge: 1.59 },
    {
      maxUnits: Infinity,
      fixedCharge: 0,
      rate: 11.8,
      whelingCharge: 1.59,
    },
  ],
  500: [
    { maxUnits: 200, fixedCharge: 50, rate: 5.1, whelingCharge: 0 },
    { maxUnits: 300, fixedCharge: 50, rate: 7.7, whelingCharge: 0 },
    { maxUnits: 400, fixedCharge: 50, rate: 9, whelingCharge: 0 },
    { maxUnits: 800, fixedCharge: 50, rate: 9.5, whelingCharge: 0 },
    { maxUnits: Infinity, fixedCharge: 50, rate: 10, whelingCharge: 0 },
  ],
  682: [
    { maxUnits: 50, fixedCharge: 40, rate: 3.25, whelingCharge: 0 },
    { maxUnits: 100, fixedCharge: 65, rate: 4.05, whelingCharge: 0 },
    { maxUnits: 150, fixedCharge: 85, rate: 5.1, whelingCharge: 0 },
    { maxUnits: 200, fixedCharge: 120, rate: 6.95, whelingCharge: 0 },
    { maxUnits: 250, fixedCharge: 130, rate: 8.2, whelingCharge: 0 },
    { maxUnits: 300, fixedCharge: 150, rate: 6.4, whelingCharge: 0 },
    { maxUnits: 350, fixedCharge: 175, rate: 7.25, whelingCharge: 0 },
    { maxUnits: 400, fixedCharge: 200, rate: 7.6, whelingCharge: 0 },
    { maxUnits: 500, fixedCharge: 230, rate: 7.9, whelingCharge: 0 },
    {
      maxUnits: Infinity,
      fixedCharge: 260,
      rate: 8.8,
      whelingCharge: 0,
    },
  ],
  700: [
    { maxUnits: 25, fixedCharge: 15, rate: 5.18, whelingCharge: 1.64 },
    { maxUnits: 60, fixedCharge: 15, rate: 5.69, whelingCharge: 1.64 },
    { maxUnits: 100, fixedCharge: 15, rate: 6.7, whelingCharge: 1.64 },
    { maxUnits: 150, fixedCharge: 15, rate: 7.45, whelingCharge: 1.64 },
    { maxUnits: 300, fixedCharge: 15, rate: 7.62, whelingCharge: 1.64 },
    {
      maxUnits: Infinity,
      fixedCharge: 15,
      rate: 9.21,
      whelingCharge: 1.64,
    },
  ],
  530: [
    { maxUnits: 30, fixedCharge: 50, rate: 1.9, whelingCharge: 1.194 },
    { maxUnits: 75, fixedCharge: 50, rate: 3, whelingCharge: 1.194 },
    { maxUnits: 125, fixedCharge: 50, rate: 4.5, whelingCharge: 1.194 },
    { maxUnits: 225, fixedCharge: 50, rate: 6, whelingCharge: 1.194 },
    { maxUnits: 400, fixedCharge: 50, rate: 8.75, whelingCharge: 1.194 },
    {
      maxUnits: Infinity,
      fixedCharge: 50,
      rate: 9.75,
      whelingCharge: 1.194,
    },
  ],
  751: [
    { maxUnits: 30, fixedCharge: 0, rate: 3, whelingCharge: 0 },
    { maxUnits: 50, fixedCharge: 300, rate: 3, whelingCharge: 0 },
    { maxUnits: 200, fixedCharge: 480, rate: 4.8, whelingCharge: 0 },
    { maxUnits: 400, fixedCharge: 580, rate: 5.8, whelingCharge: 0 },
    {
      maxUnits: Infinity,
      fixedCharge: 620,
      rate: 6.2,
      whelingCharge: 0,
    },
  ],
  160: [
    { maxUnits: 150, fixedCharge: 15, rate: 2.75, whelingCharge: 0 },
    { maxUnits: 400, fixedCharge: 15, rate: 4.25, whelingCharge: 0 },
    {
      maxUnits: Infinity,
      fixedCharge: 15,
      rate: 4.65,
      whelingCharge: 0,
    },
  ],
  411: [
    { maxUnits: 30, fixedCharge: 40, rate: 5.58, whelingCharge: 0 },
    { maxUnits: 100, fixedCharge: 200, rate: 5.58, whelingCharge: 0 },
    { maxUnits: 150, fixedCharge: 370, rate: 2.75, whelingCharge: 0 },
    { maxUnits: 300, fixedCharge: 370, rate: 4.25, whelingCharge: 0 },
    { maxUnits: 400, fixedCharge: 500, rate: 4.25, whelingCharge: 0 },
    { maxUnits: 500, fixedCharge: 500, rate: 4.65, whelingCharge: 0 },
    {
      maxUnits: Infinity,
      fixedCharge: 575,
      rate: 4.65,
      whelingCharge: 0,
    },
  ],
  380: [
    { maxUnits: 50, fixedCharge: 70, rate: 3.2, whelingCharge: 0 },
    { maxUnits: 150, fixedCharge: 70, rate: 3.9, whelingCharge: 0 },
    { maxUnits: Infinity, fixedCharge: 70, rate: 5, whelingCharge: 0 },
  ],
  default: [
    { maxUnits: 50, fixedCharge: 0, rate: 18.9, whelingCharge: 0 },
    { maxUnits: Infinity, fixedCharge: 0, rate: 7.6, whelingCharge: 0 },
  ],
};

// Commute Emission Factors (kg CO2 per km)
export const COMMUTE_FACTORS = {
  "walk-cycle": 0,
  "public-transport": 0.027178,
  "two-wheeler-electric": 0.02864,
  "two-wheeler-petrol": 0.0448,
  "three-wheeler": 0.10768,
  "four-wheeler-electric": 0.0895,
  "four-wheeler-hatchback": 0.1441,
  "four-wheeler-suv": 0.20992,
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
  internationalMedium: 0.11,
  internationalLong: 0.0741,
  internationalUltraLong: 0.0741,
};

export const TRAIN_FACTORS = {
  localTrain: 0.007963,
  shortTrain: 0.007963,
  mediumTrain: 0.007963,
  longTrain: 0.007963,
};

export const CAR_FACTORS = {
  gasolineLocal: 0.1874,
  gasolineShort: 0.1874,
  gasolineMedium: 0.1874,
  gasolineLong: 0.1874,

  electricLocal: 0.0895,
  electricShort: 0.0895,
  electricMedium: 0.0895,
  electricLong: 0.0895,
};

// Lifestyle Emission Factors
export const MEAL_FACTORS = {
  plantBased: 0.575, // kg CO2e per meal
  vegetarian: 0.66,
  egg: 0.675,
  chickenFish: 0.71,
  redMeat: 1.0,
};

export const WASTE_FACTORS = {
  composting: 0.32,
  landfilling: 1.29,
};

export const FASHION_FACTORS = {
  EMISSIONS_PER_SHOPPING: 25, // kg CO2e per shopping trip
};

// Chart Colors
export const CHART_COLORS = {
  backgroundColor: [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
  ],
  borderColor: [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ],
};
