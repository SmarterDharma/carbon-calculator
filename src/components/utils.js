import { ELECTRICITY_RATES, ENERGY_FACTORS, COMMUTE_FACTORS, FLIGHT_FACTORS, TRAIN_FACTORS, CAR_FACTORS, MEAL_FACTORS, WASTE_FACTORS, FASHION_FACTORS } from '../constants';

const getRateSlabs = (pincode) => {
  const pincodePrefix = pincode.toString().substring(0, 3);
  return ELECTRICITY_RATES[pincodePrefix] || ELECTRICITY_RATES.default;
};

const getEffectiveRate = (slab) => {
  return slab.rate + (slab.whelingChargePerUnit || 0);
};

const calculateUnitsForFixedCharge = (bill, rateSlabs) => {
  for (let i = 0; i < rateSlabs.length; i++) {
    const slab = rateSlabs[i];
    const remainingBillAfterFixedCharge = bill - slab.fixedCharge;
    const effectiveRate = getEffectiveRate(slab);
    const units = remainingBillAfterFixedCharge / effectiveRate;

    if (units > slab.maxUnits) {
      continue;
    } else {
      return units;
    }
  }
  return 0;
};

const calculateUnitsForSlabs = (bill, rateSlabs) => {
  let remainingBill = bill;
  let totalUnits = 0;

  for (let i = 0; i < rateSlabs.length; i++) {
    const currentSlab = rateSlabs[i];
    const previousSlab = i > 0 ? rateSlabs[i-1].maxUnits : 0;
    const slabUnits = currentSlab.maxUnits - previousSlab;
    const effectiveRate = getEffectiveRate(currentSlab);
    
    if (currentSlab.maxUnits === Infinity) {
      totalUnits += remainingBill / effectiveRate;
      break;
    } else {
      const slabCost = slabUnits * effectiveRate;
      
      if (remainingBill >= slabCost) {
        totalUnits += slabUnits;
        remainingBill -= slabCost;
      } else {
        totalUnits += remainingBill / effectiveRate;
        break;
      }
    }
  }

  return totalUnits;
};

export const calculateUnitsFromBill = (bill, pincode) => {
  if (!bill || !pincode) return 0;

  const rateSlabs = getRateSlabs(pincode);
  const hasFixedCharge = rateSlabs.some(slab => slab.fixedCharge);

  if (hasFixedCharge) {
    return calculateUnitsForFixedCharge(bill, rateSlabs);
  }

  return calculateUnitsForSlabs(bill, rateSlabs);
};

export const calculateEnergyFootprint = (energyData, personalData) => {
  if (!energyData) return 0;
  
  let electricityUnits;
  
  if (energyData.dontKnowUnits && energyData.electricityBill) {
    electricityUnits = calculateUnitsFromBill(
      energyData.electricityBill,
      energyData.pincode || personalData?.pincode
    );
  } else if (energyData.electricityUnits) {
    electricityUnits = energyData.electricityUnits;
  } else {
    electricityUnits = 0;
  }
  
  const electricityFootprint = electricityUnits * ENERGY_FACTORS.ELECTRICITY;
  const lpgFootprint = (energyData.lpgCylinders || 0) * ENERGY_FACTORS.LPG;
  
  return electricityFootprint + lpgFootprint;
};

export const calculateCommuteFootprint = (commuteData) => {
  if (!commuteData) return 0;
  
  let totalEmissions = 0;
  
  // Walk/Cycle
  totalEmissions += (commuteData.walkCycleDistance || 0) * COMMUTE_FACTORS['walk-cycle'] * 260;
  
  // Public Transport
  totalEmissions += (commuteData.publicTransportDistance || 0) * COMMUTE_FACTORS['public-transport'] * 260;
  
  // Two Wheeler
  if (commuteData.twoWheelerType === 'electric') {
    totalEmissions += (commuteData.twoWheelerDistance || 0) * COMMUTE_FACTORS['two-wheeler-electric'] * 260;
  } else {
    totalEmissions += (commuteData.twoWheelerDistance || 0) * COMMUTE_FACTORS['two-wheeler-petrol'] * 260;
  }
  
  // Three Wheeler
  totalEmissions += (commuteData.threeWheelerDistance || 0) * COMMUTE_FACTORS['three-wheeler'] * 260;
  
  // Four Wheeler
  if (commuteData.carType === 'electric') {
    totalEmissions += (commuteData.fourWheelerDistance || 0) * COMMUTE_FACTORS['four-wheeler-electric'] * 260;
  } else if (commuteData.carType === 'suv') {
    totalEmissions += (commuteData.fourWheelerDistance || 0) * COMMUTE_FACTORS['four-wheeler-suv'] * 260;
  } else {
    totalEmissions += (commuteData.fourWheelerDistance || 0) * COMMUTE_FACTORS['four-wheeler-hatchback'] * 260;
  }
  
  return totalEmissions;
};

export const calculateTravelFootprint = (travelData) => {
  if (!travelData) return 0;
  
  let totalEmissions = 0;
  
  // Domestic Flights
  totalEmissions += (travelData.domesticVeryShortFlights || 0) * FLIGHT_FACTORS.domesticVeryShort * 500;
  totalEmissions += (travelData.domesticShortFlights || 0) * FLIGHT_FACTORS.domesticShort * 1000;
  totalEmissions += (travelData.domesticMediumFlights || 0) * FLIGHT_FACTORS.domesticMedium * 1500;
  totalEmissions += (travelData.domesticLongFlights || 0) * FLIGHT_FACTORS.domesticLong * 2000;
  
  // International Flights
  totalEmissions += (travelData.internationalShortFlights || 0) * FLIGHT_FACTORS.internationalShort * 3000;
  totalEmissions += (travelData.internationalMediumFlights || 0) * FLIGHT_FACTORS.internationalMedium * 6000;
  totalEmissions += (travelData.internationalLongFlights || 0) * FLIGHT_FACTORS.internationalLong * 9000;
  totalEmissions += (travelData.internationalUltraLongFlights || 0) * FLIGHT_FACTORS.internationalUltraLong * 12000;
  
  // Train Travel
  totalEmissions += (travelData.localTrainTrips || 0) * TRAIN_FACTORS.localTrain * 30;
  totalEmissions += (travelData.shortTrainTrips || 0) * TRAIN_FACTORS.shortTrain * 200;
  totalEmissions += (travelData.mediumTrainTrips || 0) * TRAIN_FACTORS.mediumTrain * 500;
  totalEmissions += (travelData.longTrainTrips || 0) * TRAIN_FACTORS.longTrain * 1000;
  
  // Car Travel
  if (travelData.carType === 'electric') {
    totalEmissions += (travelData.localElectricTrips || 0) * CAR_FACTORS.electricLocal * 50;
    totalEmissions += (travelData.shortElectricTrips || 0) * CAR_FACTORS.electricShort * 200;
    totalEmissions += (travelData.mediumElectricTrips || 0) * CAR_FACTORS.electricMedium * 500;
    totalEmissions += (travelData.longElectricTrips || 0) * CAR_FACTORS.electricLong * 1000;
  } else {
    totalEmissions += (travelData.localGasolineTrips || 0) * CAR_FACTORS.gasolineLocal * 50;
    totalEmissions += (travelData.shortGasolineTrips || 0) * CAR_FACTORS.gasolineShort * 200;
    totalEmissions += (travelData.mediumGasolineTrips || 0) * CAR_FACTORS.gasolineMedium * 500;
    totalEmissions += (travelData.longGasolineTrips || 0) * CAR_FACTORS.gasolineLong * 1000;
  }
  
  return totalEmissions;
};

export const calculateLifestyleFootprint = (lifestyleData) => {
  if (!lifestyleData) return 0;
  
  let totalEmissions = 0;

  // Calculate food emissions (52 weeks per year)
  if (lifestyleData.selectedDiet === 'vegan') {
    totalEmissions += (lifestyleData.plantBasedMeals || 0) * MEAL_FACTORS.plantBased * 52;
  } else if (lifestyleData.selectedDiet === 'vegetarian') {
    totalEmissions += (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  } else if (lifestyleData.selectedDiet === 'ovoVegetarian') {
    totalEmissions += (lifestyleData.eggMeals || 0) * MEAL_FACTORS.egg * 52;
    totalEmissions += (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  } else if (lifestyleData.selectedDiet === 'nonVegetarian') {
    totalEmissions += (lifestyleData.chickenFishMeals || 0) * MEAL_FACTORS.chickenFish * 52;
    totalEmissions += (lifestyleData.redMeatMeals || 0) * MEAL_FACTORS.redMeat * 52;
    totalEmissions += (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  }

  // Calculate waste emissions
  const dailyWasteAmount = 0.2; // kg per day
  const annualWaste = dailyWasteAmount * 365;
  if (lifestyleData.compostOption === 'yes') {
    totalEmissions += WASTE_FACTORS.composting * annualWaste;
  } else {
    totalEmissions += WASTE_FACTORS.landfilling * annualWaste;
  }

  // Calculate fashion emissions
  if (lifestyleData.fashionFrequency) {
    totalEmissions += FASHION_FACTORS[lifestyleData.fashionFrequency];
  }

  return totalEmissions;
};

export const calculateSavingsSummary = (formData, currentResult) => {
  const summary = {
    energy: {
      solarPV: calculateSolarPVSavings(formData.energy),
      solarWater: calculateSolarWaterSavings(formData.energy),
    },
    commute: {
      publicTransport: calculatePublicTransportSavings(formData.commute),
      electricVehicle: calculateElectricVehicleSavings(formData.commute),
    },
    travel: {
      virtualMeetings: calculateVirtualMeetingsSavings(formData.travel),
    },
    lifestyle: {
      diet: calculateDietSavings(formData.lifestyle),
      composting: calculateCompostingSavings(formData.lifestyle),
    }
  };

  return {
    energy: Object.values(summary.energy).reduce((a, b) => a + b, 0),
    commute: Object.values(summary.commute).reduce((a, b) => a + b, 0),
    travel: Object.values(summary.travel).reduce((a, b) => a + b, 0),
    lifestyle: Object.values(summary.lifestyle).reduce((a, b) => a + b, 0)
  };
};

export const calculateRequiredTrees = (totalEmissions) => {
  return Math.ceil((totalEmissions / 1000) * 7);
};

export const calculatePercentageDifferences = (currentTotal) => {
  const yourFootprint = currentTotal || 0;
  const indianAvg = 1600;
  const globalAvg = 3900;

  return {
    indian: ((yourFootprint - indianAvg) / indianAvg * 100).toFixed(1),
    global: ((yourFootprint - globalAvg) / globalAvg * 100).toFixed(1)
  };
};

// Add all the savings calculation functions
export const calculateSolarPVSavings = (energyData) => {
  // Move solar PV savings calculation here
};

export const calculateSolarWaterSavings = (energyData) => {
  // Move solar water savings calculation here
};

export const calculatePublicTransportSavings = (commuteData) => {
  // Move public transport savings calculation here
};

export const calculateElectricVehicleSavings = (commuteData) => {
  // Move electric vehicle savings calculation here
};

export const calculateVirtualMeetingsSavings = (travelData) => {
  // Move virtual meetings savings calculation here
};

export const calculateDietSavings = (lifestyleData) => {
  // Move diet savings calculation here
};

export const calculateCompostingSavings = (lifestyleData) => {
  // Move composting savings calculation here
};

export const generateRecommendations = (formData) => {
  // Move recommendations generation logic here
};

// Add this function to handle non-negative input validation
export const handleNonNegativeInput = (e) => {
  const { value, min } = e.target;
  if (value === '') return '';
  
  const numValue = Number(value);
  if (isNaN(numValue)) return min || 0;
  return Math.max(numValue, min || 0);
};

// Add this function to validate and format number inputs
export const validateNumberInput = (value, options = {}) => {
  const { min = 0, max = Infinity, allowDecimals = false } = options;
  
  if (value === '' || value === null || value === undefined) return '';
  
  let numValue = Number(value);
  
  // Handle invalid numbers
  if (isNaN(numValue)) return min;
  
  // Apply min/max constraints
  numValue = Math.max(min, Math.min(max, numValue));
  
  // Handle decimals
  if (!allowDecimals) {
    numValue = Math.floor(numValue);
  }
  
  return numValue;
};
