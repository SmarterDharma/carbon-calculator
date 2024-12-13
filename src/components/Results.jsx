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

const Results = ({ formData }) => {
  const [savedResults, setSavedResults] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);

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

  // Add a section to show historical results
  const renderHistoricalResults = () => {
    if (savedResults.length <= 1) return null;

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Previous Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Total (Ton CO₂e)</th>
                <th className="px-4 py-2">Energy</th>
                <th className="px-4 py-2">Commute</th>
                <th className="px-4 py-2">Travel</th>
                <th className="px-4 py-2">Lifestyle</th>
              </tr>
            </thead>
            <tbody>
              {savedResults
                .slice()
                .reverse()
                .slice(1) // Skip current result
                .map(result => (
                  <tr key={result.id}>
                    <td className="border px-4 py-2">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {result.total.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {result.energy.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {result.commute.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {result.travel.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {result.lifestyle.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Add progress comparison if there are previous results
  const renderProgress = () => {
    if (savedResults.length <= 1) return null;

    const previousResult = savedResults[savedResults.length - 2];
    const currentTotal = currentResult?.total || 0;
    const previousTotal = previousResult?.total || 0;
    const difference = currentTotal - previousTotal;
    const percentageChange = (difference / previousTotal) * 100;

    return (
      <div className="mt-4 p-4 rounded-lg bg-gray-50">
        <h4 className="font-medium mb-2">Comparison with Previous Result</h4>
        <p className={`${difference < 0 ? 'text-green-600' : 'text-red-600'}`}>
          {difference < 0 ? 'Decreased' : 'Increased'} by{' '}
          {Math.abs(percentageChange).toFixed(1)}% 
          ({Math.abs(difference).toFixed(2)} Ton CO₂e)
        </p>
      </div>
    );
  };

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
      <h2 className="text-2xl font-bold mb-6">Results</h2>
      
      <div className="mb-8 text-center">
        <p className="text-lg mb-2">
          Dear <span className="text-green-600 font-semibold">{formData.personal?.name}</span>,
          here's your Personal Carbon Story
        </p>
        <p className="text-gray-600">
          A closer look at how you contribute to global emissions
        </p>
      </div>

      {/* Total Footprint Display */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
        <h1 className="text-5xl font-bold text-green-600 mb-2">
          {currentResult?.total.toFixed(2) || 0}
        </h1>
        <p className="text-gray-600">Annual Carbon Footprint in Ton CO₂e</p>
      </div>

      {/* Individual Footprints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="flex justify-between">
            <span>Energy Consumption:</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Footprint Breakdown</h3>
          <Pie data={pieChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Comparison</h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Add progress comparison */}
      {renderProgress()}

      {/* Add historical results */}
      {renderHistoricalResults()}
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
    shortHaul: 0.121,
    mediumHaul: 0.121,
    longHaul: 0.0741,
    ultraLongHaul: 0.007963
  };

  // Calculate flight emissions
  const flightEmissions = 
    (travelData.shortHaulFlights || 0) * 1000 * FLIGHT_FACTORS.shortHaul +
    (travelData.mediumHaulFlights || 0) * 2750 * FLIGHT_FACTORS.mediumHaul +
    (travelData.longHaulFlights || 0) * 6500 * FLIGHT_FACTORS.longHaul +
    (travelData.ultraLongHaulFlights || 0) * 12000 * FLIGHT_FACTORS.ultraLongHaul;

  return flightEmissions;
};

const calculateLifestyleFootprint = (lifestyleData) => {
  if (!lifestyleData) return 0;
  
  const MEAL_FACTORS = {
    vegan: 0.575,
    vegetarian: 0.66,
    ovoVegetarian: 0.675,
    nonVeg: 0.71,
    redMeat: 1
  };

  const WASTE_FACTORS = {
    composting: 0.32,   // kg CO2e per kg of waste
    landfilling: 1.29   // kg CO2e per kg of waste
  };

  const FASHION_FACTORS = {
    once: 100,      // kg CO2e per month
    twice: 200,     // kg CO2e per month
    thrice: 300     // kg CO2e per month
  };

  let totalEmissions = 0;

  // Calculate food emissions
  if (lifestyleData.selectedDiet === 'vegan') {
    totalEmissions += (lifestyleData.veganMeals || 0) * MEAL_FACTORS.vegan * 52;
  } else if (lifestyleData.selectedDiet === 'vegetarian') {
    totalEmissions += (lifestyleData.vegetarianMeals || 0) * MEAL_FACTORS.vegetarian * 52;
  } else if (lifestyleData.selectedDiet === 'ovoVegetarian') {
    totalEmissions += (lifestyleData.eggMeals || 0) * MEAL_FACTORS.ovoVegetarian * 52;
  } else if (lifestyleData.selectedDiet === 'nonVegetarian') {
    totalEmissions += (lifestyleData.nonVegMeals || 0) * MEAL_FACTORS.nonVeg * 52;
    totalEmissions += (lifestyleData.redMeatMeals || 0) * MEAL_FACTORS.redMeat * 52;
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