/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { saveResult, getAllResults } from '../utils/storage';
import {
  calculateEnergyFootprint,
  calculateCommuteFootprint,
  calculateTravelFootprint,
  calculateLifestyleFootprint,
  calculateSavingsSummary,
  calculateRequiredTrees,
  calculatePercentageDifferences,
  generateRecommendations
} from './utils';

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

    return {
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

  const savingsSummary = calculateSavingsSummary(formData, currentResult);
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
              const diff = calculatePercentageDifferences(currentResult?.total);
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
          {generateRecommendations(formData).map((rec, index) => (
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

export default Results; 