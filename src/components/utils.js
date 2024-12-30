import {
  ELECTRICITY_RATES,
  ENERGY_FACTORS,
  COMMUTE_FACTORS,
  FLIGHT_FACTORS,
  TRAIN_FACTORS,
  CAR_FACTORS,
  MEAL_FACTORS,
  WASTE_FACTORS,
  FASHION_FACTORS,
} from "../constants";

const getRateSlabs = (pincode) => {
  const pincodePrefix = pincode.toString().substring(0, 3);
  return ELECTRICITY_RATES[pincodePrefix] || ELECTRICITY_RATES.default;
};

export const calculateUnitsFromBill = (bill, pincode) => {
  if (!bill || !pincode) return 0;
  const cityTariffs = getRateSlabs(pincode);

  for (let i = 0; i < cityTariffs.length; i++) {
    const { maxUnits, fixedCharge, rate, whelingCharge } = cityTariffs[i];
    const perUnitCost = rate + whelingCharge;

    // Check if the given bill fit in the current slab
    if (fixedCharge < bill) {
      const remainingAmount = bill - fixedCharge;
      const calculatedUnits = Math.floor(remainingAmount / perUnitCost);

      // Check if the units fit within the slab
      if (maxUnits === Infinity || calculatedUnits <= maxUnits) {
        return calculatedUnits; // Return the units within this slab
      }
    }
  }

  return 0; // If no matching slab is found, return 0 units
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

  const electricityFootprint =
    electricityUnits * ENERGY_FACTORS.ELECTRICITY * 12;
  const lpgFootprint = (energyData.lpgCylinders || 0) * ENERGY_FACTORS.LPG;

  return (electricityFootprint + lpgFootprint) / personalData?.household || 1;
};

export const calculateCommuteFootprint = (commuteData) => {
  if (!commuteData) return 0;

  let totalEmissions = 0;

  // Calculate working days per year using office days directly
  const officeDaysPerWeek = commuteData.officeWorkDays || 0;
  const weeksPerYear = 52;
  const workingDaysPerYear = officeDaysPerWeek * weeksPerYear;

  // Walk/Cycle
  totalEmissions +=
    (commuteData.walkCycleDistance || 0) *
    COMMUTE_FACTORS["walk-cycle"] *
    workingDaysPerYear;

  // Public Transport
  totalEmissions +=
    (commuteData.publicTransportDistance || 0) *
    COMMUTE_FACTORS["public-transport"] *
    workingDaysPerYear;

  // Two Wheeler
  if (commuteData.twoWheelerType === "electric") {
    totalEmissions +=
      (commuteData.twoWheelerDistance || 0) *
      COMMUTE_FACTORS["two-wheeler-electric"] *
      workingDaysPerYear;
  } else {
    totalEmissions +=
      (commuteData.twoWheelerDistance || 0) *
      COMMUTE_FACTORS["two-wheeler-petrol"] *
      workingDaysPerYear;
  }

  // Three Wheeler
  totalEmissions +=
    (commuteData.threeWheelerDistance || 0) *
    COMMUTE_FACTORS["three-wheeler"] *
    workingDaysPerYear;

  // Four Wheeler
  const passengerCount = commuteData.passengerCount || 1;
  if (commuteData.carType === "electric") {
    totalEmissions +=
      ((commuteData.fourWheelerDistance || 0) *
        COMMUTE_FACTORS["four-wheeler-electric"] *
        workingDaysPerYear) /
      passengerCount;
  } else if (commuteData.carType === "suv") {
    totalEmissions +=
      ((commuteData.fourWheelerDistance || 0) *
        COMMUTE_FACTORS["four-wheeler-suv"] *
        workingDaysPerYear) /
      passengerCount;
  } else {
    totalEmissions +=
      ((commuteData.fourWheelerDistance || 0) *
        COMMUTE_FACTORS["four-wheeler-hatchback"] *
        workingDaysPerYear) /
      passengerCount;
  }

  return totalEmissions;
};

export const calculateTravelFootprint = (travelData) => {
  if (!travelData) return 0;

  let totalEmissions = 0;

  // Domestic Flights
  totalEmissions +=
    (travelData.domesticVeryShortFlights || 0) *
    FLIGHT_FACTORS.domesticVeryShort *
    500;
  totalEmissions +=
    (travelData.domesticShortFlights || 0) *
    FLIGHT_FACTORS.domesticShort *
    1000;
  totalEmissions +=
    (travelData.domesticMediumFlights || 0) *
    FLIGHT_FACTORS.domesticMedium *
    1500;
  totalEmissions +=
    (travelData.domesticLongFlights || 0) * FLIGHT_FACTORS.domesticLong * 2000;

  // International Flights
  totalEmissions +=
    (travelData.internationalShortFlights || 0) *
    FLIGHT_FACTORS.internationalShort *
    3000;
  totalEmissions +=
    (travelData.internationalMediumFlights || 0) *
    FLIGHT_FACTORS.internationalMedium *
    6000;
  totalEmissions +=
    (travelData.internationalLongFlights || 0) *
    FLIGHT_FACTORS.internationalLong *
    9000;
  totalEmissions +=
    (travelData.internationalUltraLongFlights || 0) *
    FLIGHT_FACTORS.internationalUltraLong *
    12000;

  // Train Travel
  totalEmissions +=
    (travelData.localTrainTrips || 0) * TRAIN_FACTORS.localTrain * 30;
  totalEmissions +=
    (travelData.shortTrainTrips || 0) * TRAIN_FACTORS.shortTrain * 200;
  totalEmissions +=
    (travelData.mediumTrainTrips || 0) * TRAIN_FACTORS.mediumTrain * 500;
  totalEmissions +=
    (travelData.longTrainTrips || 0) * TRAIN_FACTORS.longTrain * 1000;

  // Car Travel
  if (travelData.carType === "electric") {
    totalEmissions +=
      (travelData.localElectricTrips || 0) * CAR_FACTORS.electricLocal * 50;
    totalEmissions +=
      (travelData.shortElectricTrips || 0) * CAR_FACTORS.electricShort * 200;
    totalEmissions +=
      (travelData.mediumElectricTrips || 0) * CAR_FACTORS.electricMedium * 500;
    totalEmissions +=
      (travelData.longElectricTrips || 0) * CAR_FACTORS.electricLong * 1000;
  } else {
    totalEmissions +=
      (travelData.localGasolineTrips || 0) * CAR_FACTORS.gasolineLocal * 50;
    totalEmissions +=
      (travelData.shortGasolineTrips || 0) * CAR_FACTORS.gasolineShort * 200;
    totalEmissions +=
      (travelData.mediumGasolineTrips || 0) * CAR_FACTORS.gasolineMedium * 500;
    totalEmissions +=
      (travelData.longGasolineTrips || 0) * CAR_FACTORS.gasolineLong * 1000;
  }

  return totalEmissions;
};

export const calculateLifestyleFootprint = (lifestyleData) => {
  if (!lifestyleData) return 0;

  let totalEmissions = 0;

  // Calculate food emissions (52 weeks per year)
  if (lifestyleData.selectedDiet === "vegan") {
    totalEmissions +=
      (lifestyleData.plantBasedMeals || 0) * MEAL_FACTORS.plantBased * 52;
  } else if (lifestyleData.selectedDiet === "vegetarian") {
    totalEmissions +=
      (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  } else if (lifestyleData.selectedDiet === "ovoVegetarian") {
    totalEmissions += (lifestyleData.eggMeals || 0) * MEAL_FACTORS.egg * 52;
    totalEmissions +=
      (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  } else if (lifestyleData.selectedDiet === "nonVegetarian") {
    totalEmissions +=
      (lifestyleData.chickenFishMeals || 0) * MEAL_FACTORS.chickenFish * 52;
    totalEmissions +=
      (lifestyleData.redMeatMeals || 0) * MEAL_FACTORS.redMeat * 52;
    totalEmissions +=
      (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  }

  // Calculate waste emissions
  const dailyWasteAmount = 0.2; // kg per day
  const annualWaste = dailyWasteAmount * 365;
  if (lifestyleData.compostOption === "yes") {
    totalEmissions += WASTE_FACTORS.composting * annualWaste;
  } else {
    totalEmissions += WASTE_FACTORS.landfilling * annualWaste;
  }

  // Calculate fashion emissions
  totalEmissions +=
    (lifestyleData.fashionFrequency || 0) *
    FASHION_FACTORS.EMISSIONS_PER_SHOPPING;

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
    },
  };

  return {
    energy: Object.values(summary.energy).reduce((a, b) => a + b, 0),
    commute: Object.values(summary.commute).reduce((a, b) => a + b, 0),
    travel: Object.values(summary.travel).reduce((a, b) => a + b, 0),
    lifestyle: Object.values(summary.lifestyle).reduce((a, b) => a + b, 0),
  };
};

export const calculateRequiredTrees = (totalEmissions) => {
  return Math.ceil((totalEmissions / 1000) * 7);
};

export const calculatePercentageDifferences = (currentTotal) => {
  const yourFootprint = currentTotal || 0;
  const indianAvg = 2100;
  const globalAvg = 4700;

  return {
    indian: (((yourFootprint - indianAvg) / indianAvg) * 100).toFixed(1),
    global: (((yourFootprint - globalAvg) / globalAvg) * 100).toFixed(1),
  };
};

// Add all the savings calculation functions
export const calculateSolarPVSavings = (energyData) => {
  if (!energyData || energyData.solarPV) return 0;

  // Calculate monthly units:
  // 1. Use electricityUnits if directly provided
  // 2. Otherwise calculate from bill if dontKnowUnits is true
  let monthlyUnits = 0;

  if (energyData.electricityUnits) {
    monthlyUnits = energyData.electricityUnits;
  } else if (energyData.dontKnowUnits && energyData.electricityBill) {
    // Try to get pincode from either energy data or personal data
    const pincode = energyData.pincode || energyData.personalPincode;
    if (pincode) {
      monthlyUnits = calculateUnitsFromBill(
        energyData.electricityBill,
        pincode
      );
    }
  }

  // Calculate annual units and emissions saved
  const annualUnits = monthlyUnits * 12;
  const savings = annualUnits * ENERGY_FACTORS.ELECTRICITY;

  return savings;
};

export const calculateSolarWaterSavings = (energyData) => {
  if (!energyData || energyData.solarWater) return 0;

  // Each geyser uses approximately 2 kWh per day
  const geysers = energyData.geysers || 0;
  const dailyElectricitySaved = geysers * 2;
  const annualElectricitySaved = dailyElectricitySaved * 182; // considering 3-4 uses of geyser in a week

  // Calculate emissions saved (kg CO2)
  return annualElectricitySaved * ENERGY_FACTORS.ELECTRICITY;
};

export const calculatePublicTransportSavings = (commuteData) => {
  if (!commuteData || !commuteData.carType) return 0;

  const distance = commuteData.fourWheelerDistance || 0;
  let currentEmissions = 0;

  // Calculate working days per year using office days directly
  const officeDaysPerWeek = commuteData.officeWorkDays || 0;
  const weeksPerYear = 52;
  const workingDaysPerYear = officeDaysPerWeek * weeksPerYear;

  // Calculate current emissions based on car type
  if (commuteData.carType === "electric") {
    currentEmissions =
      distance * COMMUTE_FACTORS["four-wheeler-electric"] * workingDaysPerYear;
  } else if (commuteData.carType === "suv") {
    currentEmissions =
      distance * COMMUTE_FACTORS["four-wheeler-suv"] * workingDaysPerYear;
  } else {
    currentEmissions =
      distance * COMMUTE_FACTORS["four-wheeler-hatchback"] * workingDaysPerYear;
  }

  // Calculate emissions if using public transport
  const publicTransportEmissions =
    distance * COMMUTE_FACTORS["public-transport"] * workingDaysPerYear;

  return currentEmissions - publicTransportEmissions;
};

export const calculateElectricVehicleSavings = (commuteData) => {
  if (!commuteData) return 0;

  // Calculate working days per year using office days directly
  const officeDaysPerWeek = commuteData.officeWorkDays || 0;
  const weeksPerYear = 52;
  const workingDaysPerYear = officeDaysPerWeek * weeksPerYear;

  let potentialSavings = 0;

  // Two wheeler conversion savings
  if (commuteData.twoWheelerType === "petrol") {
    const distance = commuteData.twoWheelerDistance || 0;
    const currentEmissions =
      distance * COMMUTE_FACTORS["two-wheeler-petrol"] * workingDaysPerYear;
    const electricEmissions =
      distance * COMMUTE_FACTORS["two-wheeler-electric"] * workingDaysPerYear;
    potentialSavings += currentEmissions - electricEmissions;
  }

  // Four wheeler conversion savings
  if (commuteData.carType === "suv" || commuteData.carType === "hatchback") {
    const distance = commuteData.fourWheelerDistance || 0;
    const currentEmissions =
      distance *
      (commuteData.carType === "suv"
        ? COMMUTE_FACTORS["four-wheeler-suv"]
        : COMMUTE_FACTORS["four-wheeler-hatchback"]) *
      workingDaysPerYear;
    const electricEmissions =
      distance * COMMUTE_FACTORS["four-wheeler-electric"] * workingDaysPerYear;
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
    (travelData.domesticVeryShortFlights || 0) *
      FLIGHT_FACTORS.domesticVeryShort *
      500 +
    (travelData.domesticShortFlights || 0) *
      FLIGHT_FACTORS.domesticShort *
      1000 +
    (travelData.internationalShortFlights || 0) *
      FLIGHT_FACTORS.internationalShort *
      3000;

  return flightEmissions * reductionFactor;
};

export const calculateDietSavings = (lifestyleData) => {
  if (!lifestyleData || lifestyleData.selectedDiet === "vegan") return 0;

  let currentEmissions = 0;
  let veganEmissions = 0;
  const weeksPerYear = 52;

  if (lifestyleData.selectedDiet === "nonVegetarian") {
    // Calculate current non-veg emissions
    currentEmissions =
      ((lifestyleData.chickenFishMeals || 0) * MEAL_FACTORS.chickenFish +
        (lifestyleData.redMeatMeals || 0) * MEAL_FACTORS.redMeat +
        (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian) *
      weeksPerYear;

    // Calculate if all meals were vegan
    const totalMeals =
      (+lifestyleData.chickenFishMeals || 0) +
      (+lifestyleData.redMeatMeals || 0) +
      (+lifestyleData.vegetarianMeals || 0);
    veganEmissions = totalMeals * MEAL_FACTORS.plantBased * weeksPerYear;
  } else if (lifestyleData.selectedDiet === "vegetarian") {
    currentEmissions =
      (lifestyleData.vegetarianMeals || 0) *
      MEAL_FACTORS.vegetarian *
      weeksPerYear;
    veganEmissions =
      (lifestyleData.vegetarianMeals || 0) *
      MEAL_FACTORS.plantBased *
      weeksPerYear;
  }

  return currentEmissions - veganEmissions;
};

export const calculateCompostingSavings = (lifestyleData) => {
  if (!lifestyleData || lifestyleData.compostOption === "yes") return 0;

  const dailyWasteAmount = 0.2; // kg per day
  const annualWaste = dailyWasteAmount * 365;

  // Calculate difference between landfill and composting emissions
  const landfillEmissions = annualWaste * WASTE_FACTORS.landfilling;
  const compostEmissions = annualWaste * WASTE_FACTORS.composting;

  return landfillEmissions - compostEmissions;
};

export const generateRecommendations = (
  formData,
  selectedPledges,
  currentResult
) => {
  const recommendations = [];

  // Energy recommendations
  if (!formData.energy?.solarPV) {
    const energyDataWithPincode = {
      ...formData.energy,
      personalPincode: formData.personal?.pincode,
    };

    const monthlyUnits =
      energyDataWithPincode.electricityUnits ||
      (energyDataWithPincode.dontKnowUnits &&
      energyDataWithPincode.electricityBill
        ? calculateUnitsFromBill(
            energyDataWithPincode.electricityBill,
            energyDataWithPincode.pincode ||
              energyDataWithPincode.personalPincode
          )
        : 0);

    if (monthlyUnits > 0) {
      const requiredKWP = Math.ceil((monthlyUnits * 12) / (365 * 4));
      const minCost = requiredKWP * 50000;
      const maxCost = requiredKWP * 70000;

      recommendations.push({
        id: "solarPV",
        title: "Solar Power Installation",
        description: `If you have access to a rooftop, installing a ${requiredKWP} kWp solar system could offset your entire electricity consumption`,
        cost: `Installation cost: ₹${(minCost / 1000).toFixed(0)}-${(maxCost / 1000).toFixed(0)}K`,
        isAdditionalExpense: true,
      });
    }
  }

  // Solar water heater recommendation
  if (!formData.energy?.solarWater && formData.energy?.geysers > 0) {
    const household = formData.personal?.household || 1;
    let recommendedCapacity;

    if (household <= 4) {
      recommendedCapacity = 100;
    } else if (household <= 6) {
      recommendedCapacity = 150;
    } else {
      const additionalPeople = household - 6;
      const additionalCapacity = Math.ceil(additionalPeople / 2) * 50;
      recommendedCapacity = 150 + additionalCapacity;
    }

    const baseCost = 20000;
    const additionalCost = Math.max(0, (recommendedCapacity - 100) / 50) * 5000;
    const totalCost = baseCost + additionalCost;

    recommendations.push({
      id: "solarWater",
      title: "Solar Water Heating",
      description: `If you have access to a rooftop, installing a ${recommendedCapacity}L solar water heater could replace your electric geysers.`,
      cost: `Installation cost: ₹${(totalCost / 1000).toFixed(0)}K`,
      isAdditionalExpense: true,
    });
  }

  // Public transport recommendation
  if (formData.commute?.carType === "suv") {
    const distance = formData.commute?.fourWheelerDistance || 0;
    const suvCostPerDay = distance * 8;
    const busCostPerDay = distance * 1.5;
    const metroCostPerDay = distance * 2;
    const annualSuvCost = suvCostPerDay * 250; // Assuming 250 working days
    const annualBusCost = busCostPerDay * 250;
    const annualMetroCost = metroCostPerDay * 250;
    const annualSavings =
      annualSuvCost - Math.min(annualBusCost, annualMetroCost);

    recommendations.push({
      id: "publicTransport",
      title: "Sustainable Transportation",
      description:
        "Consider carpooling or using public transport to reduce emissions from your SUV.",
      cost: `Potential annual savings: ₹${(annualSavings / 1000).toFixed(0)}K`,
      isAdditionalExpense: false,
    });
  }

  const totalFlights =
    (formData.travel?.domesticVeryShortFlights || 0) +
    (formData.travel?.domesticShortFlights || 0) +
    (formData.travel?.internationalShortFlights || 0);
  if (totalFlights > 6) {
    const reducibleFlights = Math.ceil(totalFlights * 0.2); // Calculate 20% of total flights
    recommendations.push({
      id: "virtualMeetings",
      title: "Air Travel",
      description: `Consider replacing ${reducibleFlights} of your ${totalFlights} short flights with virtual meetings when possible.`,
    });
  }

  if (formData.lifestyle?.selectedDiet === "nonVegetarian") {
    recommendations.push({
      id: "diet",
      title: "Dietary Changes",
      description:
        "Consider reducing meat consumption and incorporating more plant-based meals.",
    });
  }

  if (formData.lifestyle?.compostOption === "no") {
    recommendations.push({
      id: "composting",
      title: "Waste Management",
      description:
        "Start composting your wet waste to reduce methane emissions from landfills.",
      cost: "Setup cost: ₹2-5K",
      isAdditionalExpense: true,
    });
  }

  // Add tree planting recommendation for remaining emissions
  const remainingEmissions = formData.total || 0;
  const requiredTrees = calculateRequiredTrees(
    calculateUpdatedEmissions(formData, selectedPledges, currentResult)
  );
  if (requiredTrees > 0) {
    recommendations.push({
      id: "treePlanting",
      title: "Plant Trees to Offset Remaining Emissions",
      description: `Plant trees to offset your remaining carbon footprint. The number of trees needed will adjust based on your other selected pledges.`,
      isTreePlanting: true,
      treeCount: requiredTrees,
      remainingEmissions: remainingEmissions,
    });
  }

  return recommendations;
};

// Add this function to handle non-negative input validation
export const handleNonNegativeInput = (e) => {
  const { value, min } = e.target;
  if (value === "") return "";

  const numValue = Number(value);
  if (isNaN(numValue)) return min || 0;
  return Math.max(numValue, min || 0);
};

// Add this function to validate and format number inputs
export const validateNumberInput = (value, options = {}) => {
  const { min = 0, max = Infinity, allowDecimals = false } = options;

  if (value === "" || value === null || value === undefined) return "";

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
  return treeCount * 28.4;
};

export const calculateUpdatedEmissions = (
  formData,
  selectedPledges,
  currentResult
) => {
  const selectedSavings = selectedPledges.reduce((total, pledge) => {
    switch (pledge) {
      case "solarPV":
        return total + (calculateSolarPVSavings(formData.energy) || 0);
      case "solarWater":
        return total + (calculateSolarWaterSavings(formData.energy) || 0);
      case "publicTransport":
        return total + (calculatePublicTransportSavings(formData.commute) || 0);
      case "electricVehicle":
        return total + (calculateElectricVehicleSavings(formData.commute) || 0);
      case "virtualMeetings":
        return total + (calculateVirtualMeetingsSavings(formData.travel) || 0);
      case "diet":
        return total + (calculateDietSavings(formData.lifestyle) || 0);
      case "composting":
        return total + (calculateCompostingSavings(formData.lifestyle) || 0);
      default:
        return total;
    }
  }, 0);

  return Math.max(0, (currentResult?.total || 0) - selectedSavings);
};

export const calculateFootprints = (formData) => {
  const energyFootprint = calculateEnergyFootprint(
    formData.energy,
    formData.personal
  );
  const commuteFootprint = calculateCommuteFootprint(formData.commute);
  const travelFootprint = calculateTravelFootprint(formData.travel);
  const lifestyleFootprint = calculateLifestyleFootprint(formData.lifestyle);

  const totalFootprint =
    energyFootprint + commuteFootprint + travelFootprint + lifestyleFootprint;

  return {
    energy: energyFootprint,
    commute: commuteFootprint,
    travel: travelFootprint,
    lifestyle: lifestyleFootprint,
    total: totalFootprint,
    userData: { ...formData.personal },
    details: {
      energy: formData.energy,
      commute: formData.commute,
      travel: formData.travel,
      lifestyle: formData.lifestyle,
      personal: formData.personal,
    },
  };
};

export const getRecommendationSavings = (recommendationId, formData) => {
  switch (recommendationId) {
    case "solarPV":
      // Pass personal pincode to energy data
      const energyDataWithPincode = {
        ...formData.energy,
        personalPincode: formData.personal?.pincode,
      };
      return calculateSolarPVSavings(energyDataWithPincode);
    case "solarWater":
      return calculateSolarWaterSavings(formData.energy);
    case "publicTransport":
      return calculatePublicTransportSavings(formData.commute);
    case "virtualMeetings":
      return calculateVirtualMeetingsSavings(formData.travel);
    case "diet":
      return calculateDietSavings(formData.lifestyle);
    case "composting":
      return calculateCompostingSavings(formData.lifestyle);
    default:
      return 0;
  }
};
