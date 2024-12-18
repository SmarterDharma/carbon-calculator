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
} from '../constants';
import { calculateUnitsFromBill } from './utils';

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
    const energyFootprint = calculateEnergyFootprint(formData.energy, formData.personal);
    const commuteFootprint = calculateCommuteFootprint(formData.commute);
    const travelFootprint = calculateTravelFootprint(formData.travel);
    const lifestyleFootprint = calculateLifestyleFootprint(formData.lifestyle);

    const totalFootprint = 
      energyFootprint +
      commuteFootprint +
      travelFootprint +
      lifestyleFootprint;

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
  const chartColors = {
    backgroundColor: [
      'rgba(243, 138, 138, 0.8)',  // Remaining emissions: #F38A8A
      'rgba(6, 77, 113, 0.8)',     // Energy: #064D71
      'rgba(104, 151, 208, 0.8)',  // Commute: #6897D0
      'rgba(46, 140, 143, 0.8)',   // Travel: #2E8C8F
      'rgba(47, 95, 152, 0.8)',    // Lifestyle: #2F5F98
    ],
    borderColor: [
      'rgb(243, 138, 138)',  // Remaining emissions: #F38A8A
      'rgb(6, 77, 113)',     // Energy: #064D71
      'rgb(104, 151, 208)',  // Commute: #6897D0
      'rgb(46, 140, 143)',   // Travel: #2E8C8F
      'rgb(47, 95, 152)',    // Lifestyle: #2F5F98
    ]
  };

  const pieChartData = {
    labels: ['Energy', 'Commute', 'Travel', 'Lifestyle'],
    datasets: [{
      data: [
        currentResult?.energy || 0,
        currentResult?.commute || 0,
        currentResult?.travel || 0,
        currentResult?.lifestyle || 0
      ].map(value => ((value / (currentResult?.total || 1)) * 100).toFixed(1)),
      backgroundColor: [
        chartColors.backgroundColor[1],  // Energy
        chartColors.backgroundColor[2],  // Commute
        chartColors.backgroundColor[3],  // Travel
        chartColors.backgroundColor[4],  // Lifestyle
      ],
      borderColor: [
        chartColors.borderColor[1],  // Energy
        chartColors.borderColor[2],  // Commute
        chartColors.borderColor[3],  // Travel
        chartColors.borderColor[4],  // Lifestyle
      ],
      borderWidth: 1
    }]
  };

  const barChartData = {
    labels: ['Your Footprint', 'Indian Average', 'Global Average'],
    datasets: [{
      label: 'Your Footprint (Kg CO₂e)',
      data: [
        currentResult?.total || 0,
        1600,
        3900
      ],
      backgroundColor: chartColors.backgroundColor.slice(1, 4).reverse(),
      borderColor: chartColors.borderColor.slice(1, 4).reverse(),
      borderWidth: 1,
      borderRadius: 4,
    }]
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
      const potentialSaving = meatMeals * 52 * 0.5; // Removed /1000

      recommendations.push({
        title: 'Dietary Changes',
        description: `Reducing meat consumption by half and replacing with plant-based meals could save approximately ${Math.round(potentialSaving)} Kg of CO₂e annually.`
      });
    }

    // Composting Recommendations
    if (formData.lifestyle?.compostOption === 'no') {
      const annualWaste = 0.2 * 365;
      const currentEmissions = annualWaste * 1.29;
      const compostEmissions = annualWaste * 0.32;
      const carbonSaved = currentEmissions - compostEmissions; // Removed /1000

      recommendations.push({
        title: 'Waste Management',
        description: `Starting composting could reduce your waste emissions by approximately ${Math.round(carbonSaved)} Kg of CO₂e annually.`
      });
    }

    return recommendations;
  };

  // Savings calculation functions
  const calculateSolarPVSavings = () => {
    if (!formData.energy?.solarPV) {
      const monthlyUnits = formData.energy?.electricityUnits || 
        (formData.energy?.dontKnowUnits ? (formData.energy?.electricityBill || 0) / 7.11 : 0);
      return monthlyUnits * 12 * 0.716;
    }
    return 0;
  };

  const calculateSolarWaterSavings = () => {
    if (!formData.energy?.solarWater && formData.energy?.geysers > 0) {
      const geysers = formData.energy.geysers;
      const annualElectricitySaved = geysers * 2 * 365;
      return annualElectricitySaved * 0.716;
    }
    return 0;
  };

  const calculatePublicTransportSavings = () => {
    if (formData.commute?.carType === 'suv') {
      const distance = formData.commute?.fourWheelerDistance || 0;
      const annualEmissions = distance * 0.2 * 260;
      const publicTransportEmissions = distance * 0.04 * 260;
      return annualEmissions - publicTransportEmissions;
    }
    return 0;
  };

  const calculateElectricVehicleSavings = () => {
    if (formData.commute?.carType === 'petrol' || formData.commute?.carType === 'diesel') {
      const distance = formData.commute?.fourWheelerDistance || 0;
      const currentEmissions = distance * (formData.commute?.carType === 'suv' ? 0.2 : 0.14) * 260;
      const evEmissions = distance * 0.09 * 260;
      return currentEmissions - evEmissions;
    }
    return 0;
  };

  const calculateVirtualMeetingsSavings = () => {
    const totalFlights = (formData.travel?.domesticShortFlights || 0) + 
                        (formData.travel?.domesticLongFlights || 0);
    if (totalFlights > 6) {
      const reducibleFlights = Math.floor(totalFlights * 0.2);
      const averageEmissionsPerFlight = 130;
      return reducibleFlights * averageEmissionsPerFlight;
    }
    return 0;
  };

  const calculateDietSavings = () => {
    if (formData.lifestyle?.selectedDiet === 'nonVegetarian') {
      const meatMeals = (formData.lifestyle?.chickenFishMeals || 0) + 
                       (formData.lifestyle?.redMeatMeals || 0);
      return meatMeals * 52 * 0.5;
    }
    return 0;
  };

  const calculateCompostingSavings = () => {
    if (formData.lifestyle?.compostOption === 'no') {
      const annualWaste = 0.2 * 365;
      const currentEmissions = annualWaste * 1.29;
      const compostEmissions = annualWaste * 0.32;
      return currentEmissions - compostEmissions;
    }
    return 0;
  };

  const calculateSavingsSummary = () => {
    const summary = {
      energy: {
        solarPV: calculateSolarPVSavings(),
        solarWater: calculateSolarWaterSavings(),
      },
      commute: {
        publicTransport: calculatePublicTransportSavings(),
        electricVehicle: calculateElectricVehicleSavings(),
      },
      travel: {
        virtualMeetings: calculateVirtualMeetingsSavings(),
      },
      lifestyle: {
        diet: calculateDietSavings(),
        composting: calculateCompostingSavings(),
      }
    };

    return {
      energy: Object.values(summary.energy).reduce((a, b) => a + b, 0),
      commute: Object.values(summary.commute).reduce((a, b) => a + b, 0),
      travel: Object.values(summary.travel).reduce((a, b) => a + b, 0),
      lifestyle: Object.values(summary.lifestyle).reduce((a, b) => a + b, 0)
    };
  };

  const savingsSummary = calculateSavingsSummary();
  const totalPotentialSavings = Object.values(savingsSummary).reduce((a, b) => a + b, 0);
  const remainingEmissions = currentResult?.total - totalPotentialSavings;

  const savingsChartData = {
    labels: [
      'Remaining Emissions',
      'Energy Savings',
      'Commute Savings',
      'Travel Savings',
      'Lifestyle Savings'
    ],
    datasets: [{
      data: [
        Math.max(0, remainingEmissions),
        savingsSummary.energy,
        savingsSummary.commute,
        savingsSummary.travel,
        savingsSummary.lifestyle
      ].map(value => ((value / (currentResult?.total || 1)) * 100).toFixed(1)),
      backgroundColor: chartColors.backgroundColor,
      borderColor: chartColors.borderColor,
      borderWidth: 1
    }]
  };

  // Add this calculation function
  const calculateRequiredTrees = (totalEmissions) => {
    return Math.ceil((totalEmissions / 1000) * 7);
  };

  // Chart options configurations
  const pieChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          filter: function(legendItem, data) {
            return data.datasets[0].data[legendItem.index] > 0;
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label}: ${data.datasets[0].data[i]}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: data.datasets[0].data[i] <= 0,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
          text: 'Carbon Footprint (Kg CO₂e)'
        },
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: [{
      id: 'barLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          meta.data.forEach((bar, index) => {
            const data = dataset.data[index];
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(data, bar.x + 5, bar.y);
          });
        });
      }
    }]
  };

  const savingsChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          filter: function(legendItem, data) {
            return data.datasets[0].data[legendItem.index] > 0;
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label}: ${data.datasets[0].data[i]}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: data.datasets[0].data[i] <= 0,
                index: i
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  // Add this function to calculate percentage differences
  const calculatePercentageDifferences = () => {
    const yourFootprint = currentResult?.total || 0;
    const indianAvg = 1600;
    const globalAvg = 3900;

    return {
      indian: ((yourFootprint - indianAvg) / indianAvg * 100).toFixed(1),
      global: ((yourFootprint - globalAvg) / globalAvg * 100).toFixed(1)
    };
  };

  return (
    <div className="section-container max-w-4xl mx-auto">
      {/* Header with retake button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg text-gray-600 mt-2">
            Hey {formData.personal?.name || 'there'}! here's your carbon footprint
          </p>
        </div>
        <button
          onClick={handleRetake}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Retake
        </button>
      </div>

      {/* Total Footprint */}
      <div className="text-center mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-r border-gray-200">
            <h3 className="text-4xl font-bold text-green-600 flex items-baseline justify-center">
              {Math.round(currentResult?.total)}
              <span className="text-2xl text-gray-500 ml-2">Kg CO₂e</span>
            </h3>
            <p className="text-xl text-gray-600 mt-2">Annual Carbon Footprint</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-600 flex items-baseline justify-center">
              {calculateRequiredTrees(currentResult?.total || 0)}
              <span className="text-2xl text-gray-500 ml-2">Trees</span>
            </h3>
            <p className="text-xl text-gray-600 mt-2">Required to Offset</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Trees take about 10 years to offset this amount of carbon
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        <div className="card-responsive">
          <h3 className="text-lg font-semibold mb-4">Footprint Breakdown</h3>
          <div className="aspect-square">
            <Pie data={pieChartData} options={{ ...pieChartOptions, maintainAspectRatio: true }} />
          </div>
        </div>
        <div className="card-responsive">
          <h3 className="text-lg font-semibold mb-4">Comparison</h3>
          <div style={{ height: '200px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="mt-4 space-y-3 text-base">
            {(() => {
              const diff = calculatePercentageDifferences();
              return (
                <>
                  <p className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <span className={`text-xl font-bold ${diff.indian > 0 ? "text-red-500" : "text-green-500"}`}>
                      {diff.indian > 0 ? "↑" : "↓"}
                    </span>
                    <span className="font-medium">
                      <span className="text-lg">{Math.abs(diff.indian)}%</span>
                      <span className="text-gray-600"> {diff.indian > 0 ? "higher" : "lower"} than Indian average</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <span className={`text-xl font-bold ${diff.global > 0 ? "text-red-500" : "text-green-500"}`}>
                      {diff.global > 0 ? "↑" : "↓"}
                    </span>
                    <span className="font-medium">
                      <span className="text-lg">{Math.abs(diff.global)}%</span>
                      <span className="text-gray-600"> {diff.global > 0 ? "higher" : "lower"} than global average</span>
                    </span>
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
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
              <Pie data={savingsChartData} options={{ ...savingsChartOptions, maintainAspectRatio: true }} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-green-600 mb-2">Total Potential Savings</h4>
              <p className="text-2xl font-bold flex items-baseline">
                <span>{Math.round(totalPotentialSavings)}</span>
                <span className="text-gray-500 text-xl ml-2">Kg CO₂e</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {((totalPotentialSavings / currentResult?.total) * 100).toFixed(1)}% reduction from current emissions
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-red-600 mb-2">Remaining Emissions After Changes</h4>
              <p className="text-2xl font-bold flex items-baseline">
                <span>{Math.round(remainingEmissions)}</span>
                <span className="text-gray-500 text-xl ml-2">Kg CO₂e</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pledge Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-green-600 mb-4">Take the Pledge!</h3>
        <div className="space-y-4">
          <p className="text-gray-700">
            Your commitment to reducing carbon emissions is commendable. Take it a step further by pledging to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Implement the recommended interventions to reduce your carbon footprint</li>
            <li>Offset your remaining emissions by planting {calculateRequiredTrees(currentResult?.total || 0)} trees</li>
            <li>Track your progress and maintain sustainable practices</li>
          </ul>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-gray-700">
              <span className="font-semibold">Forest First Samithi</span> is our trusted offset partner. 
              We highly recommend approaching them to help offset your carbon footprint through tree plantation.
            </p>
            <div className="mt-4">
              <a 
                href="https://forestfirstsamithi.org/contribute/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Offset with Forest First Samithi
                <svg 
                  className="ml-2 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculation functions
const calculateEnergyFootprint = (energyData, personalData) => {
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