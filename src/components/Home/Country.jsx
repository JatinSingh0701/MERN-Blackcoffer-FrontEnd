import React, { useState, useEffect, useRef } from "react";
import { Data } from "../index";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import * as d3 from "d3";
import worldGeoData from "../path-to-world-geojson.json"; // Replace with the actual path

function Country() {
  const [numToShow, setNumToShow] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    sector: "",
    topic: "",
    region: "",
  });

  const data = Data();
  const uniqueSectors = [...new Set(data.map((item) => item.sector))];
  const uniqueTopics = [...new Set(data.map((item) => item.topic))];
  const uniqueRegions = [...new Set(data.map((item) => item.region))];

  const filteredData = data.filter((item) => {
    return (
      (selectedFilters.sector === "" ||
        item.sector === selectedFilters.sector) &&
      (selectedFilters.topic === "" || item.topic === selectedFilters.topic) &&
      (selectedFilters.region === "" || item.region === selectedFilters.region)
    );
  });
  const chartRef = useRef(null);


  const handleLoadMore = () => {
    setNumToShow((prevNum) => prevNum + 100);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setNumToShow((prevNum) => prevNum - 100);
    }
  };

  const handleNext = () => {
    if (numToShow < data.length) {
      setCurrentPage(currentPage + 1);
      setNumToShow((prevNum) => prevNum + 100);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    createGeoChart();
  }, [data, numToShow, currentPage, selectedFilters]);

  const createGeoChart = () => {
    const width = 800;
    const height = 500;

    const projection = d3.geoMercator().fitSize([width, height], worldGeoData);

    const path = d3.geoPath().projection(projection);

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .selectAll("path")
      .data(worldGeoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#ccc"); // Set a fill color for the countries
  };

  return (
    <div className="w-screen">
      <div
        className="chartContainer border border-gray-300 p-4 flex justify-center align-middle"
        ref={chartRef}
      ></div>
      <div className="table w-screen h-full">
        <div className="max-w-3xl mx-auto mt-10">
          <div className="flex justify-between mb-4">
            <div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
            <div>
              <label className="mr-5 block text-center ">Filter by</label>
              <select
                className="border border-gray-300 px-2 py-1"
                name="sector"
                onChange={handleFilterChange}
              >
                <option value="">Select Sector</option>
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 px-2 py-1"
                name="topic"
                onChange={handleFilterChange}
              >
                <option value="">Select Topic</option>
                {uniqueTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 px-2 py-1"
                name="region"
                onChange={handleFilterChange}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-r text-center border-gray-500">
                  S.No
                </th>
                <th className="py-2 px-4 border-b border-r text-center border-gray-500">
                  ID
                </th>
                <th className="py-2 px-4 border-b border-r text-center border-gray-500">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, numToShow).map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="py-2 px-4 border-r text-center border-gray-500">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-r text-center border-gray-500">
                    {item._id}
                  </td>
                  <td className="py-2 px-4 border-r  text-center border-gray-500">
                    {item.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Country;
