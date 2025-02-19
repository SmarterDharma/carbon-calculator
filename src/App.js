import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import PersonalInfo from "./components/PersonalInfo";
import Energy from "./components/Energy";
import Commute from "./components/Commute";
import Travel from "./components/Travel";
import Lifestyle from "./components/Lifestyle";
import Results from "./components/Results";
import { saveResult } from "./utils/storage";
import logo from "./sd_logo.svg";
import { ArrowRight, TreePine, Lightbulb, Globe } from "lucide-react";

function App() {
  const [activeBucket, setActiveBucket] = useState("personal");
  const [formData, setFormData] = useState({
    personal: {},
    energy: {},
    commute: {},
    travel: {},
    lifestyle: {},
  });
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Get company from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const company = urlParams.get("company");

    if (company) {
      // Update form data with company without showing it
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          company,
        },
      }));
    }
  }, []); // Empty dependency array means this runs once on mount

  const bucketOrder = [
    "personal",
    "energy",
    "commute",
    "travel",
    "lifestyle",
    "result",
  ];

  const updateFormData = (bucket, data) => {
    setFormData((prev) => ({
      ...prev,
      [bucket]: { ...prev[bucket], ...data },
    }));
  };

  const handleNext = () => {
    const currentIndex = bucketOrder.indexOf(activeBucket);
    if (currentIndex < bucketOrder.length - 1 && validateCurrentSection()) {
      setActiveBucket(bucketOrder[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    const currentIndex = bucketOrder.indexOf(activeBucket);
    if (currentIndex > 0) {
      setActiveBucket(bucketOrder[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  const validateCurrentSection = () => {
    switch (activeBucket) {
      case "personal":
        return validatePersonalInfo();
      case "energy":
        return validateEnergy();
      case "commute":
        return validateCommute();
      case "travel":
        return validateTravel();
      case "lifestyle":
        return validateLifestyle();
      default:
        return true;
    }
  };

  const validatePersonalInfo = () => {
    const { name, email, age, gender, pincode, household } =
      formData.personal || {};
    if (!name || !email || !age || !gender || !pincode || !household) {
      alert("Please fill in all required fields in Personal Information");
      return false;
    }
    return true;
  };

  const validateEnergy = () => {
    const { electricityUnits } = formData.energy || {};
    if (!electricityUnits && !formData.energy?.dontKnowUnits) {
      alert(
        'Please enter your electricity units or select "Don\'t know your units"'
      );
      return false;
    }
    return true;
  };

  const validateCommute = () => {
    const {
      officeWorkDays,
      walkCycleDistance,
      publicTransportDistance,
      twoWheelerDistance,
      threeWheelerDistance,
      fourWheelerDistance,
    } = formData.commute || {};

    if (!officeWorkDays || officeWorkDays < 1) {
      alert("Please specify at least 1 day of office work per week");
      return false;
    }

    // Check if any mode has a distance value greater than 0
    const hasValidCommute =
      walkCycleDistance > 0 ||
      publicTransportDistance > 0 ||
      (twoWheelerDistance > 0 && formData.commute?.twoWheelerType) ||
      (threeWheelerDistance > 0 && formData.commute?.threeWheelerType) ||
      (fourWheelerDistance > 0 && formData.commute?.carType);

    if (!hasValidCommute) {
      alert("Please enter travel distance for at least one mode of commute");
      return false;
    }
    return true;
  };

  const validateTravel = () => {
    const {
      // Domestic Flights
      domesticVeryShortFlights,
      domesticShortFlights,
      domesticMediumFlights,
      domesticLongFlights,
      // International Flights
      internationalShortFlights,
      internationalMediumFlights,
      internationalLongFlights,
      internationalUltraLongFlights,
      // Train Journeys
      localTrainJourneys,
      shortTrainJourneys,
      mediumTrainJourneys,
      longTrainJourneys,
      // Gasoline Car Trips
      localGasolineTrips,
      shortGasolineTrips,
      mediumGasolineTrips,
      longGasolineTrips,
      // Electric Car Trips
      localElectricTrips,
      shortElectricTrips,
      mediumElectricTrips,
      longElectricTrips,
    } = formData.travel || {};

    // Check if any travel mode has trips greater than 0
    const hasValidTravel =
      // Domestic Flights
      domesticVeryShortFlights > 0 ||
      domesticShortFlights > 0 ||
      domesticMediumFlights > 0 ||
      domesticLongFlights > 0 ||
      // International Flights
      internationalShortFlights > 0 ||
      internationalMediumFlights > 0 ||
      internationalLongFlights > 0 ||
      internationalUltraLongFlights > 0 ||
      // Train Journeys
      localTrainJourneys > 0 ||
      shortTrainJourneys > 0 ||
      mediumTrainJourneys > 0 ||
      longTrainJourneys > 0 ||
      // Gasoline Car Trips
      localGasolineTrips > 0 ||
      shortGasolineTrips > 0 ||
      mediumGasolineTrips > 0 ||
      longGasolineTrips > 0 ||
      // Electric Car Trips
      localElectricTrips > 0 ||
      shortElectricTrips > 0 ||
      mediumElectricTrips > 0 ||
      longElectricTrips > 0;

    if (!hasValidTravel) {
      alert("Please enter at least one trip in any travel section");
      return false;
    }
    return true;
  };

  const validateLifestyle = () => {
    const { selectedDiet } = formData.lifestyle || {};
    if (!selectedDiet) {
      alert("Please select your diet preference");
      return false;
    }
    return true;
  };

  const resetCalculator = () => {
    setActiveBucket("personal");
    setFormData({
      personal: {},
      energy: {},
      commute: {},
      travel: {},
      lifestyle: {},
    });
  };

  const captureResult = () => {
    saveResult(formData);
    handleNext();
  };

  const renderNavigationButtons = () => {
    const currentIndex = bucketOrder.indexOf(activeBucket);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === bucketOrder.length - 1;

    return (
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
            ${
              isFirst
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          disabled={isFirst}
        >
          Previous
        </button>
        <button
          onClick={
            currentIndex === bucketOrder.length - 2 ? captureResult : handleNext
          }
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
            ${
              isLast
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          disabled={isLast}
        >
          {currentIndex === bucketOrder.length - 2 ? "View Results" : "Next"}
        </button>
      </div>
    );
  };

  const renderActiveBucket = () => {
    switch (activeBucket) {
      case "personal":
        return (
          <PersonalInfo
            formData={formData.personal}
            updateFormData={updateFormData}
          />
        );
      case "energy":
        return (
          <Energy
            formData={formData.energy}
            updateFormData={updateFormData}
            pincode={formData.personal?.pincode}
          />
        );
      case "commute":
        return (
          <Commute
            formData={formData.commute}
            updateFormData={updateFormData}
          />
        );
      case "travel":
        return (
          <Travel formData={formData.travel} updateFormData={updateFormData} />
        );
      case "lifestyle":
        return (
          <Lifestyle
            formData={formData.lifestyle}
            updateFormData={updateFormData}
          />
        );
      case "result":
        return (
          <Results formData={formData} resetCalculator={resetCalculator} />
        );
      default:
        return <PersonalInfo />;
    }
  };

  const handleNavigationClick = (bucket) => {
    // Don't allow clicking on result section directly
    if (bucket === "result") return;

    // Get the current index and target index
    const currentIndex = bucketOrder.indexOf(activeBucket);
    const targetIndex = bucketOrder.indexOf(bucket);

    // Only allow going backwards or to already validated sections
    if (targetIndex < currentIndex || isValidUpTo(targetIndex)) {
      setActiveBucket(bucket);
      window.scrollTo(0, 0);
    }
  };

  // Helper function to check if all sections up to an index are valid
  const isValidUpTo = (targetIndex) => {
    for (let i = 0; i < targetIndex; i++) {
      const bucket = bucketOrder[i];
      switch (bucket) {
        case "personal":
          if (!validatePersonalInfo()) return false;
          break;
        case "energy":
          if (!validateEnergy()) return false;
          break;
        case "commute":
          if (!validateCommute()) return false;
          break;
        case "travel":
          if (!validateTravel()) return false;
          break;
        case "lifestyle":
          if (!validateLifestyle()) return false;
          break;
        default:
          break;
      }
    }
    return true;
  };

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Discover Your Environmental Impact
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Understanding your carbon footprint is the first step towards a
            sustainable future.
            <br /> Join thousands making a difference.
          </p>
          <button
            onClick={() => setShowLanding(false)}
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
                Get detailed insights about your carbon footprint based on your
                lifestyle and daily habits.
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
                Receive tailored suggestions to reduce your environmental impact
                and save money.
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
                Monitor your improvement over time and see your contribution to
                a greener planet.
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showLanding ? (
        <>
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center relative">
                <a
                  href="https://www.smarterdharma.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img src={logo} alt="SDplus Logo" className="h-8 md:h-10" />
                </a>
                <h1 className="text-2xl font-bold text-[#22567B] absolute left-1/2 -translate-x-1/2">
                  Dharma Meter
                </h1>
              </div>
            </div>
          </header>
          {renderLandingPage()}
        </>
      ) : (
        <>
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center relative">
                <a
                  href="https://www.smarterdharma.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img src={logo} alt="SDplus Logo" className="h-8 md:h-10" />
                </a>
                <h1 className="text-2xl font-bold text-[#22567B] absolute left-1/2 -translate-x-1/2">
                  Dharma Meter
                </h1>
              </div>
            </div>
          </header>
          <Navigation
            activeBucket={activeBucket}
            onNavigationClick={handleNavigationClick}
          />
          <main className="flex-1 container mx-auto px-4 py-4 md:py-8 max-w-4xl">
            {renderActiveBucket()}
            {activeBucket !== "result" && renderNavigationButtons()}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
