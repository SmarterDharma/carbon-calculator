/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { saveResult, getAllResults } from '../utils/storage';

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
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
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

      {/* Recommendations Section */}
      <div className="mt-8 text-left">
        <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
        <div className="space-y-4">
          <p className="text-gray-700">Based on your carbon footprint, here are some suggestions to reduce your impact:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Consider using public transportation or carpooling more frequently</li>
            <li>Switch to energy-efficient appliances</li>
            <li>Reduce meat consumption and opt for more plant-based meals</li>
            <li>Install solar panels or switch to renewable energy sources</li>
            <li>Practice composting and reduce waste generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Calculation functions
const calculateEnergyFootprint = (energyData) => {
  if (!energyData) return 0;
  
  const ELECTRICITY_FACTOR = 0.716; // kg CO2 per unit
  const LPG_FACTOR = 44.446; // kg CO2 per cylinder
  
  const electricityUnits = energyData.electricityUnits || 
    (energyData.dontKnowUnits ? (energyData.electricityBill || 0) / 7.11 : 0);
  
  const electricityFootprint = electricityUnits * ELECTRICITY_FACTOR;
  const lpgFootprint = (energyData.lpgCylinders || 0) * LPG_FACTOR;
  
  return electricityFootprint + lpgFootprint;
};

const calculateCommuteFootprint = (commuteData) => {
  if (!commuteData) return 0;
  
  const EMISSION_FACTORS = {
    'walk-cycle': 0,
    'public-transport': 0.027178,
    'two-wheeler-electric': 0.02864,
    'two-wheeler-petrol': 0.0448,
    'three-wheeler': 0.10768,
    'four-wheeler-electric': 0.0895,
    'four-wheeler-hatchback': 0.1441,
    'four-wheeler-suv': 0.20992
  };

  let totalEmissions = 0;
  const workDays = Math.max(0, 7 - (commuteData.wfhDays || 0)) * 52; // Annual working days

  // Walk/Cycle
  if (commuteData.selectedMode === 'walk-cycle') {
    totalEmissions += (commuteData.walkCycleDistance || 0) * workDays * EMISSION_FACTORS['walk-cycle'];
  }

  // Public Transport
  if (commuteData.selectedMode === 'public-transport') {
    totalEmissions += (commuteData.publicTransportDistance || 0) * workDays * EMISSION_FACTORS['public-transport'];
  }

  // Two Wheeler
  if (commuteData.selectedMode === 'two-wheeler') {
    const factor = commuteData.twoWheelerType === 'electric' 
      ? EMISSION_FACTORS['two-wheeler-electric']
      : EMISSION_FACTORS['two-wheeler-petrol'];
    totalEmissions += (commuteData.twoWheelerDistance || 0) * workDays * factor;
  }

  // Three Wheeler
  if (commuteData.selectedMode === 'three-wheeler') {
    totalEmissions += (commuteData.threeWheelerDistance || 0) * workDays * EMISSION_FACTORS['three-wheeler'];
  }

  // Four Wheeler
  if (commuteData.selectedMode === 'four-wheeler') {
    let factor;
    if (commuteData.carType === 'electric') {
      factor = EMISSION_FACTORS['four-wheeler-electric'];
    } else if (commuteData.carType === 'hatchback') {
      factor = EMISSION_FACTORS['four-wheeler-hatchback'];
    } else if (commuteData.carType === 'suv') {
      factor = EMISSION_FACTORS['four-wheeler-suv'];
    }

    // Divide by number of passengers if carpooling
    const passengers = commuteData.passengerCount || 1;
    totalEmissions += ((commuteData.fourWheelerDistance || 0) * workDays * factor) / passengers;
  }

  return totalEmissions;
};

const calculateTravelFootprint = (travelData) => {
  if (!travelData) return 0;
  
  const FLIGHT_FACTORS = {
    // Domestic Flights (kg CO2 per km)
    domesticVeryShort: 0.145, // Higher per km due to takeoff/landing
    domesticShort: 0.133,
    domesticMedium: 0.127,
    domesticLong: 0.121,
    
    // International Flights
    internationalShort: 0.121,
    internationalMedium: 0.110,
    internationalLong: 0.095,
    internationalUltraLong: 0.085
  };

  const TRAIN_FACTORS = {
    localTrain: 0.029,      // kg CO2 per km
    shortTrain: 0.027,
    mediumTrain: 0.025,
    longTrain: 0.024
  };

  const CAR_FACTORS = {
    gasolineLocal: 0.171,   // kg CO2 per km
    gasolineShort: 0.165,
    gasolineMedium: 0.160,
    gasolineLong: 0.155,
    
    electricLocal: 0.053,   // kg CO2 per km
    electricShort: 0.051,
    electricMedium: 0.049,
    electricLong: 0.047
  };

  // Calculate domestic flight emissions
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
  
  const MEAL_FACTORS = {
    plantBased: 0.42,      // kg CO2e per meal
    vegetarian: 0.52,
    egg: 0.62,
    chickenFish: 0.72,
    redMeat: 1.05
  };

  const WASTE_FACTORS = {
    composting: 0.32,
    landfilling: 1.29
  };

  const FASHION_FACTORS = {
    once: 100,
    twice: 200,
    thrice: 300
  };

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