import React from 'react';
import { ArrowRight, TreePine,  Lightbulb, Globe } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Discover Your Environmental Impact
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Understanding your carbon footprint is the first step towards a sustainable future. 
            Join thousands making a difference.
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-lg text-lg inline-flex items-center"
          >
            Calculate Your Footprint
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Personalized Analysis</h3>
              <p className="text-gray-600">
                Get detailed insights about your carbon footprint based on your lifestyle and daily habits.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Smart Recommendations</h3>
              <p className="text-gray-600">
                Receive tailored suggestions to reduce your environmental impact and save money.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your improvement over time and see your contribution to a greener planet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-green-100">Users Calculated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15%</div>
              <div className="text-green-100">Average Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-green-100">Trees Worth Saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 