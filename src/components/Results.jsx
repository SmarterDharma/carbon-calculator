/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { saveResult, getAllResults } from '../utils/storage';
import {
  ENERGY_FACTORS,
  COMMUTE_FACTORS,
  FLIGHT_FACTORS,
  TRAIN_FACTORS,
  CAR_FACTORS,
  MEAL_FACTORS,
  WASTE_FACTORS,
  FASHION_FACTORS,
  CHART_COLORS
} from '../constants';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Results = ({ formData, resetCalculator }) => {
  const [savedResults, setSavedResults] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);

  const handleRetake = () => {
    if (window.confirm('Are you sure you want to retake the calculator? All current data will be lost.')) {
      resetCalculator();
    }
  };

  const calculateFootprints = () => {
    // Energy Footprint Calculation
    const energyFootprint = calculateEnergyFootprint(formData.energy);
    const commuteFootprint = calculateCommuteFootprint(formData.commute);
    const travelFootprint = calculateTravelFootprint(formData.travel);
    const lifestyleFootprint = calculateLifestyleFootprint(formData.lifestyle);

    const totalFootprint = (
      energyFootprint +
      commuteFootprint +
      travelFootprint +
      lifestyleFootprint
    ) / 1000; // Convert to tons

    const result = {
      energy: energyFootprint,
      commute: commuteFootprint,
      travel: travelFootprint,
      lifestyle: lifestyleFootprint,
      total: totalFootprint,
      userData: {
        name: formData.personal?.name,
        email: formData.personal?.email,
        household: formData.personal?.household
      },
      details: {
        energy: formData.energy,
        commute: formData.commute,
        travel: formData.travel,
        lifestyle: formData.lifestyle
      }
    };

    return result;
  };

  useEffect(() => {
    // Calculate and save result when component mounts
    const result = calculateFootprints();
    const savedResult = saveResult(result);
    setCurrentResult(savedResult);
    
    // Load all results
    const allResults = getAllResults();
    setSavedResults(allResults);
  }, [formData]);

  // Chart configurations
  const pieChartData = {
    labels: ['Energy', 'Commute', 'Travel', 'Lifestyle'],
    datasets: [{
      data: [
        currentResult?.energy || 0,
        currentResult?.commute || 0,
        currentResult?.travel || 0,
        currentResult?.lifestyle || 0
      ],
      backgroundColor: CHART_COLORS.backgroundColor.slice(0, 4),
      borderColor: CHART_COLORS.borderColor.slice(0, 4),
      borderWidth: 1
    }]
  };

  const barChartData = {
    labels: ['Global Average', 'Indian Average', 'Your Footprint'],
    datasets: [{
      label: 'Carbon Footprint (Ton CO₂e)',
      data: [3.9, 1.6, currentResult?.total || 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Carbon Footprint Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Ton CO₂e'
        }
      }
    }
  };

  const generateRecommendations = () => {
    const recommendations = [];

    // Solar PV Recommendations
    if (!formData.energy?.solarPV) {
      const monthlyUnits = formData.energy?.electricityUnits || 
        (formData.energy?.dontKnowUnits ? (formData.energy?.electricityBill || 0) / 7.11 : 0);
      const requiredKWP = (monthlyUnits * 12) / (365 * 4.5); // 4.5 units per day per KWp
      const roundedKWP = Math.ceil(requiredKWP);
      const carbonSaved = (monthlyUnits * 12 * 0.716) / 1000; // tons of CO2

      if (roundedKWP > 0) {
        recommendations.push({
          title: 'Solar Power Installation',
          description: `Installing a ${roundedKWP} kWp solar system could offset your entire electricity consumption and save approximately ${carbonSaved.toFixed(2)} tons of CO₂e annually.`
        });
      }
    }

    // Solar Water Heater Recommendations
    if (!formData.energy?.solarWater && formData.energy?.geysers > 0) {
      const geysers = formData.energy.geysers;
      const requiredCapacity = geysers * 100; // 100L per geyser
      const annualElectricitySaved = geysers * 2 * 365; // 2 kWh per geyser per day
      const carbonSaved = (annualElectricitySaved * 0.716) / 1000; // tons of CO2

      recommendations.push({
        title: 'Solar Water Heating',
        description: `Installing a ${requiredCapacity}L solar water heater system could replace your ${geysers} geyser${geysers > 1 ? 's' : ''} and save approximately ${carbonSaved.toFixed(2)} tons of CO₂e annually.`
      });
    }

    // Commute Recommendations
    if (formData.commute?.carType === 'suv') {
      const distance = formData.commute?.fourWheelerDistance || 0;
      const annualEmissions = distance * 0.2 * 260; // 0.2 kg/km for SUV, 260 working days
      const publicTransportEmissions = distance * 0.04 * 260; // 0.04 kg/km for public transport
      const carbonSaved = (annualEmissions - publicTransportEmissions) / 1000;

      recommendations.push({
        title: 'Commute Alternatives',
        description: `Switching from SUV to public transport for your ${distance}km daily commute could save approximately ${carbonSaved.toFixed(2)} tons of CO₂e annually. Consider carpooling or public transportation.`
      });
    }

    // Travel Recommendations
    const totalFlights = (formData.travel?.domesticShortFlights || 0) + 
                        (formData.travel?.domesticLongFlights || 0) +
                        (formData.travel?.internationalFlights || 0);
    if (totalFlights > 6) {
      recommendations.push({
        title: 'Air Travel',
        description: 'Consider reducing air travel and opt for virtual meetings when possible. For domestic travel, consider train journeys which have significantly lower emissions.'
      });
    }

    // Diet Recommendations
    if (formData.lifestyle?.selectedDiet === 'nonVegetarian') {
      const meatMeals = (formData.lifestyle?.chickenFishMeals || 0) + 
                       (formData.lifestyle?.redMeatMeals || 0);
      const potentialSaving = (meatMeals * 52 * 0.5) / 1000; // 0.5 kg CO2e saved per meal

      recommendations.push({
        title: 'Dietary Changes',
        description: `Reducing meat consumption by half and replacing with plant-based meals could save approximately ${potentialSaving.toFixed(2)} tons of CO₂e annually.`
      });
    }

    // Composting Recommendations
    if (formData.lifestyle?.compostOption === 'no') {
      const annualWaste = 0.2 * 365; // 0.2 kg per day
      const currentEmissions = annualWaste * 1.29; // landfill factor
      const compostEmissions = annualWaste * 0.32; // composting factor
      const carbonSaved = (currentEmissions - compostEmissions) / 1000;

      recommendations.push({
        title: 'Waste Management',
        description: `Starting composting could reduce your waste emissions by approximately ${carbonSaved.toFixed(2)} tons of CO₂e annually.`
      });
    }

    return recommendations;
  };

  const calculateSavingsSummary = () => {
    const savings = {
      solarPV: 0,
      solarWater: 0,
      commute: 0,
      diet: 0,
      composting: 0
    };

    // Solar PV Savings
    if (!formData.energy?.solarPV) {
      const monthlyUnits = formData.energy?.electricityUnits || 
        (formData.energy?.dontKnowUnits ? (formData.energy?.electricityBill || 0) / 7.11 : 0);
      savings.solarPV = (monthlyUnits * 12 * 0.716) / 1000;
    }

    // Solar Water Heater Savings
    if (!formData.energy?.solarWater && formData.energy?.geysers > 0) {
      const geysers = formData.energy.geysers;
      const annualElectricitySaved = geysers * 2 * 365;
      savings.solarWater = (annualElectricitySaved * 0.716) / 1000;
    }

    // Commute Savings
    if (formData.commute?.carType === 'suv') {
      const distance = formData.commute?.fourWheelerDistance || 0;
      const annualEmissions = distance * 0.2 * 260;
      const publicTransportEmissions = distance * 0.04 * 260;
      savings.commute = (annualEmissions - publicTransportEmissions) / 1000;
    }

    // Diet Savings
    if (formData.lifestyle?.selectedDiet === 'nonVegetarian') {
      const meatMeals = (formData.lifestyle?.chickenFishMeals || 0) + 
                       (formData.lifestyle?.redMeatMeals || 0);
      savings.diet = (meatMeals * 52 * 0.5) / 1000;
    }

    // Composting Savings
    if (formData.lifestyle?.compostOption === 'no') {
      const annualWaste = 0.2 * 365;
      const currentEmissions = annualWaste * 1.29;
      const compostEmissions = annualWaste * 0.32;
      savings.composting = (currentEmissions - compostEmissions) / 1000;
    }

    return savings;
  };

  const savingsSummary = calculateSavingsSummary();
  const totalPotentialSavings = Object.values(savingsSummary).reduce((a, b) => a + b, 0);
  const remainingEmissions = currentResult?.total - totalPotentialSavings;

  const savingsChartData = {
    labels: [
      'Remaining Emissions',
      'Solar PV Savings',
      'Solar Water Heater Savings',
      'Commute Savings',
      'Diet Changes Savings',
      'Composting Savings'
    ],
    datasets: [{
      data: [
        Math.max(0, remainingEmissions),
        savingsSummary.solarPV,
        savingsSummary.solarWater,
        savingsSummary.commute,
        savingsSummary.diet,
        savingsSummary.composting
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',  // Red for remaining emissions
        'rgba(75, 192, 192, 0.8)',  // Green for savings
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="section-container max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Results</h2>
        <button
          onClick={handleRetake}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Retake Calculator
        </button>
      </div>

      {/* User Info */}
      <div className="mb-8 text-left">
        <h3 className="text-xl font-semibold mb-4">User Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><span className="font-medium">Name:</span> {formData.personal?.name}</p>
          <p><span className="font-medium">Email:</span> {formData.personal?.email}</p>
          <p><span className="font-medium">Age:</span> {formData.personal?.age}</p>
          <p><span className="font-medium">Household Size:</span> {formData.personal?.household}</p>
        </div>
      </div>

      {/* Total Footprint */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-green-600">
          {currentResult?.total.toFixed(2)}
        </h3>
        <p className="text-gray-600">Annual Carbon Footprint in Ton CO₂e</p>
      </div>

      {/* Individual Footprints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="flex justify-between">
            <span>Energy:</span>
            <span className="font-bold text-green-600">
              {currentResult?.energy.toFixed(2) || 0} Kg CO₂e
            </span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="flex justify-between">
            <span>Daily Commute:</span>
            <span className="font-bold text-green-600">
              {currentResult?.commute.toFixed(2) || 0} Kg CO₂e
            </span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="flex justify-between">
            <span>Travel:</span>
            <span className="font-bold text-green-600">
              {currentResult?.travel.toFixed(2) || 0} Kg CO₂e
            </span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="flex justify-between">
            <span>Lifestyle Choices:</span>
            <span className="font-bold text-green-600">
              {currentResult?.lifestyle.toFixed(2) || 0} Kg CO₂e
            </span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        <div className="card-responsive">
          <h3 className="text-lg font-semibold mb-4">Footprint Breakdown</h3>
          <div className="aspect-square">
            <Pie data={pieChartData} options={{ maintainAspectRatio: true }} />
          </div>
        </div>
        <div className="card-responsive">
          <h3 className="text-lg font-semibold mb-4">Comparison</h3>
          <div className="aspect-square">
            <Bar data={barChartData} options={{ ...barChartOptions, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>

      {/* Updated Recommendations Section */}
      <div className="mt-8 text-left">
        <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
        <div className="space-y-6">
          {generateRecommendations().map((rec, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-green-600 mb-2">{rec.title}</h4>
              <p className="text-gray-700">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Potential Savings Summary */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Potential Emission Reductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="card-responsive">
            <div className="aspect-square">
              <Pie data={savingsChartData} options={{ maintainAspectRatio: true }} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-green-600 mb-2">Total Potential Savings</h4>
              <p className="text-2xl font-bold">{totalPotentialSavings.toFixed(2)} Tons CO₂e</p>
              <p className="text-sm text-gray-600 mt-1">
                {((totalPotentialSavings / currentResult?.total) * 100).toFixed(1)}% reduction from current emissions
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-red-600 mb-2">Remaining Emissions After Changes</h4>
              <p className="text-2xl font-bold">{remainingEmissions.toFixed(2)} Tons CO₂e</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculation functions
const calculateEnergyFootprint = (energyData) => {
  if (!energyData) return 0;
  
  const electricityUnits = energyData.electricityUnits || 
    (energyData.dontKnowUnits ? (energyData.electricityBill || 0) / ENERGY_FACTORS.ELECTRICITY_BILL_TO_UNITS : 0);
  
  const electricityFootprint = electricityUnits * ENERGY_FACTORS.ELECTRICITY;
  const lpgFootprint = (energyData.lpgCylinders || 0) * ENERGY_FACTORS.LPG;
  
  return electricityFootprint + lpgFootprint;
};

const calculateCommuteFootprint = (commuteData) => {
  if (!commuteData) return 0;
  
  let totalEmissions = 0;
  const workDays = Math.max(0, 7 - (commuteData.wfhDays || 0)) * 52;

  if (commuteData.selectedMode === 'walk-cycle') {
    totalEmissions += (commuteData.walkCycleDistance || 0) * workDays * COMMUTE_FACTORS['walk-cycle'];
  }

  // Public Transport
  if (commuteData.selectedMode === 'public-transport') {
    totalEmissions += (commuteData.publicTransportDistance || 0) * workDays * COMMUTE_FACTORS['public-transport'];
  }

  // Two Wheeler
  if (commuteData.selectedMode === 'two-wheeler') {
    const factor = commuteData.twoWheelerType === 'electric' 
      ? COMMUTE_FACTORS['two-wheeler-electric']
      : COMMUTE_FACTORS['two-wheeler-petrol'];
    totalEmissions += (commuteData.twoWheelerDistance || 0) * workDays * factor;
  }

  // Three Wheeler
  if (commuteData.selectedMode === 'three-wheeler') {
    totalEmissions += (commuteData.threeWheelerDistance || 0) * workDays * COMMUTE_FACTORS['three-wheeler'];
  }

  // Four Wheeler
  if (commuteData.selectedMode === 'four-wheeler') {
    let factor;
    if (commuteData.carType === 'electric') {
      factor = COMMUTE_FACTORS['four-wheeler-electric'];
    } else if (commuteData.carType === 'hatchback') {
      factor = COMMUTE_FACTORS['four-wheeler-hatchback'];
    } else if (commuteData.carType === 'suv') {
      factor = COMMUTE_FACTORS['four-wheeler-suv'];
    }

    // Divide by number of passengers if carpooling
    const passengers = commuteData.passengerCount || 1;
    totalEmissions += ((commuteData.fourWheelerDistance || 0) * workDays * factor) / passengers;
  }

  return totalEmissions;
};

const calculateTravelFootprint = (travelData) => {
  if (!travelData) return 0;
  
  const domesticFlightEmissions = 
    (travelData.domesticVeryShortFlights || 0) * 500 * FLIGHT_FACTORS.domesticVeryShort +
    (travelData.domesticShortFlights || 0) * 1000 * FLIGHT_FACTORS.domesticShort +
    (travelData.domesticMediumFlights || 0) * 2000 * FLIGHT_FACTORS.domesticMedium +
    (travelData.domesticLongFlights || 0) * 2500 * FLIGHT_FACTORS.domesticLong;

  // Calculate international flight emissions
  const internationalFlightEmissions = 
    (travelData.internationalShortFlights || 0) * 3000 * FLIGHT_FACTORS.internationalShort +
    (travelData.internationalMediumFlights || 0) * 6000 * FLIGHT_FACTORS.internationalMedium +
    (travelData.internationalLongFlights || 0) * 10000 * FLIGHT_FACTORS.internationalLong +
    (travelData.internationalUltraLongFlights || 0) * 12000 * FLIGHT_FACTORS.internationalUltraLong;

  // Calculate train journey emissions
  const trainEmissions = 
    (travelData.localTrainJourneys || 0) * 100 * TRAIN_FACTORS.localTrain +
    (travelData.shortTrainJourneys || 0) * 300 * TRAIN_FACTORS.shortTrain +
    (travelData.mediumTrainJourneys || 0) * 800 * TRAIN_FACTORS.mediumTrain +
    (travelData.longTrainJourneys || 0) * 1200 * TRAIN_FACTORS.longTrain;

  // Calculate gasoline car emissions
  const gasolineCarEmissions = 
    (travelData.localGasolineTrips || 0) * 100 * CAR_FACTORS.gasolineLocal +
    (travelData.shortGasolineTrips || 0) * 300 * CAR_FACTORS.gasolineShort +
    (travelData.mediumGasolineTrips || 0) * 800 * CAR_FACTORS.gasolineMedium +
    (travelData.longGasolineTrips || 0) * 1200 * CAR_FACTORS.gasolineLong;

  // Calculate electric car emissions
  const electricCarEmissions = 
    (travelData.localElectricTrips || 0) * 100 * CAR_FACTORS.electricLocal +
    (travelData.shortElectricTrips || 0) * 300 * CAR_FACTORS.electricShort +
    (travelData.mediumElectricTrips || 0) * 800 * CAR_FACTORS.electricMedium +
    (travelData.longElectricTrips || 0) * 1200 * CAR_FACTORS.electricLong;

  return domesticFlightEmissions + internationalFlightEmissions + trainEmissions + 
         gasolineCarEmissions + electricCarEmissions;
};

const calculateLifestyleFootprint = (lifestyleData) => {
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
    totalEmissions += WASTE_FACTORS.composting * annualWaste * 0.2; // 80% reduction
  } else {
    totalEmissions += WASTE_FACTORS.landfilling * annualWaste;
  }

  // Calculate fashion emissions
  if (lifestyleData.fashionFrequency) {
    totalEmissions += FASHION_FACTORS[lifestyleData.fashionFrequency] * 12; // Annual fashion footprint
  }

  return totalEmissions;
};

export default Results; 