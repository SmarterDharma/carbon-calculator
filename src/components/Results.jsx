/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import {
  calculateSavingsSummary,
  calculateRequiredTrees,
  calculatePercentageDifferences,
  generateRecommendations,
  calculateUpdatedEmissions,
  calculateFootprints
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
  const [currentResult, setCurrentResult] = useState(null);
  const [selectedPledges, setSelectedPledges] = useState([]);
  const [pledgeAccepted, setPledgeAccepted] = useState(false);

  const handleRetake = () => {
    if (window.confirm('Are you sure you want to retake the calculator? All current data will be lost.')) {
      resetCalculator();
    }
  };

  useEffect(() => {
    // Calculate and save result when component mounts
    const result = calculateFootprints(formData);
    setCurrentResult(result);
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

  const handlePledgeToggle = (pledgeId) => {
    setSelectedPledges(prev => 
      prev.includes(pledgeId) 
        ? prev.filter(p => p !== pledgeId)
        : [...prev, pledgeId]
    );
  };

  const handlePledgeAcceptance = () => {
    if (selectedPledges.length === 0) {
      alert('Please select at least one recommendation to pledge.');
      return;
    }
    setPledgeAccepted(true);
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
          {generateRecommendations(formData, selectedPledges, currentResult).map((rec, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-green-600 mb-2">{rec.title}</h4>
              <p className="text-gray-700">{rec.description}</p>
              {rec.isTreePlanting && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>
                    After implementing other selected pledges, you'll need to plant{' '}
                    <span className="font-medium text-green-600">
                      {calculateRequiredTrees(calculateUpdatedEmissions(formData, selectedPledges, currentResult))}
                    </span>{' '}
                    trees to offset your remaining emissions of{' '}
                    <span className="font-medium text-green-600">
                      {Math.round(calculateUpdatedEmissions(formData, selectedPledges, currentResult))} Kg CO₂e
                    </span>.
                  </p>
                  <p className="mt-1">
                    Trees take approximately 10 years to fully offset this amount of carbon.
                  </p>
                </div>
              )}
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
              {remainingEmissions <= 0 ? (
                <>
                  <h4 className="font-medium text-green-600 mb-2">Carbon Negative Achievement!</h4>
                  <p className="text-2xl font-bold flex items-baseline">
                    <span>{Math.abs(Math.round(remainingEmissions))}</span>
                    <span className="text-gray-500 text-xl ml-2">Kg CO₂e</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your changes would make you carbon negative, removing an additional {Math.abs(Math.round(remainingEmissions))} Kg CO₂e from the atmosphere!
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-red-600 mb-2">Remaining Emissions After Changes</h4>
                  <p className="text-2xl font-bold flex items-baseline">
                    <span>{Math.round(remainingEmissions)}</span>
                    <span className="text-gray-500 text-xl ml-2">Kg CO₂e</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pledge Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-green-600 mb-4">Take the Pledge!</h3>
        <div className="space-y-4">
          {pledgeAccepted ? (
            <div className="text-center py-6 space-y-4">
              <div className="text-green-600 text-6xl mb-4">🎉</div>
              <h4 className="text-2xl font-bold text-green-600">Congratulations!</h4>
              <p className="text-gray-700">
                Thank you for pledging to reduce your carbon footprint. Your commitment to implementing
                {selectedPledges.length === 1 
                  ? ' this change ' 
                  : ` these ${selectedPledges.length} changes `}
                will help create a more sustainable future.
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  You've committed to reducing your emissions by{' '}
                  <span className="font-bold text-green-600">
                    {Math.round(currentResult?.total - calculateUpdatedEmissions(formData, selectedPledges, currentResult))} Kg CO₂e
                  </span>{' '}
                  annually.
                </p>
              </div>
              
              {/* Add update pledge button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
                <button
                  onClick={() => setPledgeAccepted(false)}
                  className="px-6 py-3 rounded-lg font-medium text-green-600 border-2 border-green-600 hover:bg-green-50 transition-colors w-full sm:w-auto"
                >
                  Update My Pledge
                </button>
                
                <a 
                  href="https://forestfirstsamithi.org/contribute/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
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
          ) : (
            <>
              <p className="text-gray-700 mb-2">Select recommendations to implement:</p>
              <div className="space-y-3">
                {generateRecommendations(formData, selectedPledges, currentResult).map((rec, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border transition-colors cursor-pointer
                      ${selectedPledges.includes(rec.id) 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'}
                      ${(rec.isTreePlanting || rec.isForestFirst) ? 'bg-green-50/50' : ''}`}
                    onClick={() => handlePledgeToggle(rec.id)}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPledges.includes(rec.id)}
                        onChange={() => handlePledgeToggle(rec.id)}
                        className="mt-1 h-4 w-4 text-green-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                          {(rec.isTreePlanting || rec.isForestFirst) && (
                            <span className="text-sm font-medium text-green-600">
                              {calculateRequiredTrees(calculateUpdatedEmissions(formData, selectedPledges, currentResult))} trees needed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{rec.description}</p>
                        {rec.isTreePlanting && (
                          <div className="mt-2 text-xs text-gray-500">
                            <p>
                              After implementing selected changes, you'll need to plant{' '}
                              <span className="font-medium text-green-600">
                                {calculateRequiredTrees(calculateUpdatedEmissions(formData, selectedPledges, currentResult))}
                              </span>{' '}
                              trees to offset your remaining emissions.
                            </p>
                            <p className="mt-1">
                              Trees take approximately 10 years to fully offset this amount of carbon.
                            </p>
                          </div>
                        )}
                        {rec.isForestFirst && (
                          <div className="mt-2">
                            <a 
                              href={rec.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-green-600 hover:text-green-700"
                            >
                              Learn more about Forest First Samithi
                              <svg 
                                className="ml-1 w-3 h-3" 
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
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              

              {/* Existing buttons */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handlePledgeAcceptance}
                  disabled={selectedPledges.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium text-white w-full sm:w-auto text-center
                    ${selectedPledges.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 transition-colors'}`}
                >
                  I Accept This Pledge
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results; 