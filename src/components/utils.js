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
  
  return (electricityFootprint + lpgFootprint) / personalData?.household || 1;
};

export const calculateCommuteFootprint = (commuteData) => {
  if (!commuteData) return 0;
  
  let totalEmissions = 0;
  
  // Calculate working days per year
  const wfhDays = commuteData.wfhDays || 0;
  const workDaysPerWeek = 6; // Assuming 5-day work week
  const weeksPerYear = 52;
  const workingDaysPerYear = (workDaysPerWeek - wfhDays) * weeksPerYear;
  
  // Walk/Cycle
  totalEmissions += (commuteData.walkCycleDistance || 0) * COMMUTE_FACTORS['walk-cycle'] * workingDaysPerYear;
  
  // Public Transport
  totalEmissions += (commuteData.publicTransportDistance || 0) * COMMUTE_FACTORS['public-transport'] * workingDaysPerYear;
  
  // Two Wheeler
  if (commuteData.twoWheelerType === 'electric') {
    totalEmissions += (commuteData.twoWheelerDistance || 0) * COMMUTE_FACTORS['two-wheeler-electric'] * workingDaysPerYear;
  } else {
    totalEmissions += (commuteData.twoWheelerDistance || 0) * COMMUTE_FACTORS['two-wheeler-petrol'] * workingDaysPerYear;
  }
  
  // Three Wheeler
  totalEmissions += (commuteData.threeWheelerDistance || 0) * COMMUTE_FACTORS['three-wheeler'] * workingDaysPerYear;
  
  // Four Wheeler
  const passengerCount = commuteData.passengerCount || 1;
  if (commuteData.carType === 'electric') {
    totalEmissions += (commuteData.fourWheelerDistance || 0) * COMMUTE_FACTORS['four-wheeler-electric'] * workingDaysPerYear / passengerCount;
  } else if (commuteData.carType === 'suv') {
    totalEmissions += (commuteData.fourWheelerDistance || 0) * COMMUTE_FACTORS['four-wheeler-suv'] * workingDaysPerYear / passengerCount;
  } else {
    totalEmissions += (commuteData.fourWheelerDistance || 0) * COMMUTE_FACTORS['four-wheeler-hatchback'] * workingDaysPerYear / passengerCount;
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
  if (!energyData || energyData.solarPV) return 0;
  
  // Calculate potential solar savings
  const monthlyUnits = energyData.electricityUnits || 
    (energyData.dontKnowUnits ? (energyData.electricityBill || 0) / 7.11 : 0);
  
  // Each kWp generates about 4.5 units per day
  const annualUnits = monthlyUnits * 12;
  
  // Calculate emissions saved (kg CO2)
  return annualUnits * ENERGY_FACTORS.ELECTRICITY;
};

export const calculateSolarWaterSavings = (energyData) => {
  if (!energyData || energyData.solarWater) return 0;
  
  // Each geyser uses approximately 2 kWh per day
  const geysers = energyData.geysers || 0;
  const dailyElectricitySaved = geysers * 2;
  const annualElectricitySaved = dailyElectricitySaved * 365;
  
  // Calculate emissions saved (kg CO2)
  return annualElectricitySaved * ENERGY_FACTORS.ELECTRICITY;
};

export const calculatePublicTransportSavings = (commuteData) => {
  if (!commuteData || !commuteData.carType) return 0;
  
  const distance = commuteData.fourWheelerDistance || 0;
  let currentEmissions = 0;
  
  // Calculate working days per year
  const wfhDays = commuteData.wfhDays || 0;
  const workDaysPerWeek = 6;
  const weeksPerYear = 52;
  const workingDaysPerYear = (workDaysPerWeek - wfhDays) * weeksPerYear;
  
  // Calculate current emissions based on car type
  if (commuteData.carType === 'electric') {
    currentEmissions = distance * COMMUTE_FACTORS['four-wheeler-electric'] * workingDaysPerYear;
  } else if (commuteData.carType === 'suv') {
    currentEmissions = distance * COMMUTE_FACTORS['four-wheeler-suv'] * workingDaysPerYear;
  } else {
    currentEmissions = distance * COMMUTE_FACTORS['four-wheeler-hatchback'] * workingDaysPerYear;
  }
  
  // Calculate emissions if using public transport
  const publicTransportEmissions = distance * COMMUTE_FACTORS['public-transport'] * workingDaysPerYear;
  
  return currentEmissions - publicTransportEmissions;
};

export const calculateElectricVehicleSavings = (commuteData) => {
  if (!commuteData) return 0;
  
  // Calculate working days per year
  const wfhDays = commuteData.wfhDays || 0;
  const workDaysPerWeek = 5;
  const weeksPerYear = 52;
  const workingDaysPerYear = (workDaysPerWeek - wfhDays) * weeksPerYear;
  
  let potentialSavings = 0;
  
  // Two wheeler conversion savings
  if (commuteData.twoWheelerType === 'petrol') {
    const distance = commuteData.twoWheelerDistance || 0;
    const currentEmissions = distance * COMMUTE_FACTORS['two-wheeler-petrol'] * workingDaysPerYear;
    const electricEmissions = distance * COMMUTE_FACTORS['two-wheeler-electric'] * workingDaysPerYear;
    potentialSavings += currentEmissions - electricEmissions;
  }
  
  // Four wheeler conversion savings
  if (commuteData.carType === 'suv' || commuteData.carType === 'hatchback') {
    const distance = commuteData.fourWheelerDistance || 0;
    const currentEmissions = distance * 
      (commuteData.carType === 'suv' ? 
        COMMUTE_FACTORS['four-wheeler-suv'] : 
        COMMUTE_FACTORS['four-wheeler-hatchback']) * workingDaysPerYear;
    const electricEmissions = distance * COMMUTE_FACTORS['four-wheeler-electric'] * workingDaysPerYear;
    potentialSavings += currentEmissions - electricEmissions;
  }
  
  return potentialSavings;
};

export const calculateVirtualMeetingsSavings = (travelData) => {
  if (!travelData) return 0;
  
  // Assume 20% of flights could be replaced with virtual meetings
  const reductionFactor = 0.2;
  
  // Calculate current flight emissions
  const flightEmissions = 
    (travelData.domesticVeryShortFlights || 0) * FLIGHT_FACTORS.domesticVeryShort * 500 +
    (travelData.domesticShortFlights || 0) * FLIGHT_FACTORS.domesticShort * 1000 +
    (travelData.domesticMediumFlights || 0) * FLIGHT_FACTORS.domesticMedium * 1500 +
    (travelData.domesticLongFlights || 0) * FLIGHT_FACTORS.domesticLong * 2000;
  
  return flightEmissions * reductionFactor;
};

export const calculateDietSavings = (lifestyleData) => {
  if (!lifestyleData || lifestyleData.selectedDiet === 'vegan') return 0;
  
  let currentEmissions = 0;
  let veganEmissions = 0;
  const weeksPerYear = 52;
  
  if (lifestyleData.selectedDiet === 'nonVegetarian') {
    // Calculate current non-veg emissions
    currentEmissions = 
      ((lifestyleData.chickenFishMeals || 0) * MEAL_FACTORS.chickenFish +
       (lifestyleData.redMeatMeals || 0) * MEAL_FACTORS.redMeat +
       (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian) * weeksPerYear;
    
    // Calculate if all meals were vegan
    const totalMeals = (+lifestyleData.chickenFishMeals || 0) +
                      (+lifestyleData.redMeatMeals || 0) +
                      (+lifestyleData.vegetarianMeals || 0);
    veganEmissions = totalMeals * MEAL_FACTORS.plantBased * weeksPerYear;
  } else if (lifestyleData.selectedDiet === 'vegetarian') {
    currentEmissions = (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * weeksPerYear;
    veganEmissions = (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.plantBased * weeksPerYear;
  }
  
  return currentEmissions - veganEmissions;
};

export const calculateCompostingSavings = (lifestyleData) => {
  if (!lifestyleData || lifestyleData.compostOption === 'yes') return 0;
  
  const dailyWasteAmount = 0.2; // kg per day
  const annualWaste = dailyWasteAmount * 365;
  
  // Calculate difference between landfill and composting emissions
  const landfillEmissions = annualWaste * WASTE_FACTORS.landfilling;
  const compostEmissions = annualWaste * WASTE_FACTORS.composting;
  
  return landfillEmissions - compostEmissions;
};

export const generateRecommendations = (formData, selectedPledges, currentResult) => {
  const recommendations = [];
  
  // Energy recommendations
  if (!formData.energy?.solarPV) {
    const monthlyUnits = formData.energy?.electricityUnits || 
      calculateUnitsFromBill(formData.energy?.electricityBill || 0, formData.personal?.pincode);
    const requiredKWP = Math.ceil((monthlyUnits * 12) / (365 * 4));
    if (requiredKWP > 0) {
      recommendations.push({
        id: 'solarPV',
        title: 'Solar Power Installation',
        description: `Installing a ${requiredKWP} kWp solar system could offset your entire electricity consumption.`
      });
    }
  }

  // Solar water heater recommendation
  if (!formData.energy?.solarWater && formData.energy?.geysers > 0) {
    recommendations.push({
      id: 'solarWater',
      title: 'Solar Water Heating',
      description: `Installing a ${formData.energy.geysers * 100}L solar water heater could replace your electric geysers.`
    });
  }

  // Add IDs to other recommendations...
  if (formData.commute?.carType === 'suv') {
    recommendations.push({
      id: 'publicTransport',
      title: 'Sustainable Transportation',
      description: 'Consider carpooling or using public transport to reduce emissions from your SUV.'
    });
  }

  const totalFlights = 
    (formData.travel?.domesticShortFlights || 0) +
    (formData.travel?.internationalFlights || 0);
  if (totalFlights > 6) {
    recommendations.push({
      id: 'virtualMeetings',
      title: 'Air Travel',
      description: 'Consider reducing air travel and opt for virtual meetings when possible.'
    });
  }

  if (formData.lifestyle?.selectedDiet === 'nonVegetarian') {
    recommendations.push({
      id: 'diet',
      title: 'Dietary Changes',
      description: 'Consider reducing meat consumption and incorporating more plant-based meals.'
    });
  }

  if (formData.lifestyle?.compostOption === 'no') {
    recommendations.push({
      id: 'composting',
      title: 'Waste Management',
      description: 'Start composting your wet waste to reduce methane emissions from landfills.'
    });
  }

  // Add tree planting recommendation for remaining emissions
  const remainingEmissions = formData.total || 0;
  const requiredTrees = calculateRequiredTrees(calculateUpdatedEmissions(formData, selectedPledges, currentResult));
  if (requiredTrees > 0) {
    recommendations.push({
      id: 'treePlanting',
      title: 'Plant Trees to Offset Remaining Emissions',
      description: `Plant trees to offset your remaining carbon footprint. The number of trees needed will adjust based on your other selected pledges.`,
      isTreePlanting: true,
      treeCount: requiredTrees,
      remainingEmissions: remainingEmissions
    });
  }

  return recommendations;
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

// Add this function to calculate savings from tree planting
export const calculateTreePlantingSavings = (treeCount) => {
  // Each tree absorbs approximately 22kg CO2 per year
  return treeCount * 22;
};

export const calculateUpdatedEmissions = (formData, selectedPledges, currentResult) => {
    const selectedSavings = selectedPledges.reduce((total, pledge) => {
      switch (pledge) {
        case 'solarPV':
          return total + (calculateSolarPVSavings(formData.energy) || 0);
        case 'solarWater':
          return total + (calculateSolarWaterSavings(formData.energy) || 0);
        case 'publicTransport':
          return total + (calculatePublicTransportSavings(formData.commute) || 0);
        case 'electricVehicle':
          return total + (calculateElectricVehicleSavings(formData.commute) || 0);
        case 'virtualMeetings':
          return total + (calculateVirtualMeetingsSavings(formData.travel) || 0);
        case 'diet':
          return total + (calculateDietSavings(formData.lifestyle) || 0);
        case 'composting':
          return total + (calculateCompostingSavings(formData.lifestyle) || 0);
        default:
          return total;
      }
    }, 0);

    return Math.max(0, (currentResult?.total || 0) - selectedSavings);
  };