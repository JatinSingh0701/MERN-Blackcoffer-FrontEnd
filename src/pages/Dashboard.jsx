import React, { useState } from "react";
import DP from "../assets/images/profile_pic.png";
import {
  Intensity,
  Country,
  Likelihood,
  Region,
  Relevance,
  Topic,
} from "../components";

function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "Intensity":
        return <Intensity />;
      case "Likelihood":
        return <Likelihood />;
      case "Relevance":
        return <Relevance />;
      case "Country":
        return <Country />;
      case "Topic":
        return <Topic />;
      case "Region":
        return <Region />;
      default:
        return <Intensity />;
    }
  };

  return (
    <div className="flex bg-gray-600">
      <div className="w-2/8 p-4">
        <div className="bg-gray-200 p-4 mb-4">
          <img
            src={DP}
            alt="DP"
            className="w-16 h-16 mx-auto mb-2 rounded-full"
          />
          <p className="text-center">Admin</p>
        </div>
        <button
          onClick={() => setSelectedComponent("Intensity")}
          className="block w-full p-2 mb-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Intensity
        </button>
        <button
          onClick={() => setSelectedComponent("Likelihood")}
          className="block w-full p-2 mb-2 bg-purple-500 text-white rounded hover:bg-purple-700"
        >
          Likelihood
        </button>
        <button
          onClick={() => setSelectedComponent("Relevance")}
          className="block w-full p-2 mb-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Relevance
        </button>

        <button
          onClick={() => setSelectedComponent("Country")}
          className="block w-full p-2 mb-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
        >
          Country
        </button>
        <button
          onClick={() => setSelectedComponent("Topic")}
          className="block w-full p-2 mb-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
        >
          Topics
        </button>
        <button
          onClick={() => setSelectedComponent("Region")}
          className="block w-full p-2 mb-2 bg-pink-500 text-white rounded hover:bg-pink-700"
        >
          Region
        </button>
      </div>
      <div className="w-6/8 p-4">{renderSelectedComponent()}</div>
    </div>
  );
}

export default Dashboard;
