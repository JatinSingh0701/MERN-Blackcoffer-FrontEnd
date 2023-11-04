import React, { useState, useEffect, useRef } from "react";
import { Data } from "../index";
import * as d3 from "d3";

function Topics() {
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

  useEffect(() => {
    createChart();
  }, [data, numToShow, currentPage, selectedFilters]);

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

  const createChart = () => {
    d3.select(chartRef.current).selectAll("*").remove();

    const subsetData = data.slice(
      (currentPage - 1) * numToShow,
      currentPage * numToShow
    );

    const width = 400;
    const height = 500;
    const center = { x: width / 2, y: height / 2 };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const maxScale = 100; // Maximum Topics scale

    const scales = Array.from(
      { length: 5 },
      (_, i) => ((i + 1) * maxScale) / 5
    );

    const radius = d3.scaleLinear().domain([0, maxScale]).range([0, center.x]);

    const line = d3
      .lineRadial()
      .angle((d, i) => (i * Math.PI * 2) / scales.length)
      .radius((d) => radius(d));

    const axisGrid = svg
      .append("g")
      .attr("class", "axisWrapper")
      .attr("transform", `translate(${center.x},${center.y})`);

    const gridCircles = axisGrid
      .selectAll(".gridCircle")
      .data(scales)
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => radius(d))
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-opacity", 0.5)
      .style("stroke-width", 0.5);

    const axisLabels = axisGrid
      .selectAll(".axisLabel")
      .data(scales)
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("y", (d) => -radius(d))
      .attr("dy", "1.5em")
      .style("font-size", "10px")
      .attr("text-anchor", "middle")
      .text((d) => d);

    const radarLine = svg
      .append("path")
      .datum(scales)
      .attr("class", "radarLine")
      .attr("d", line)
      .attr("transform", `translate(${center.x},${center.y})`)
      .style("fill", "none")
      .style("stroke", "blue")
      .style("stroke-width", 2);

    subsetData.forEach((d, i) => {
      const coordinates = scales.map(
        (scale) => (d.Topics / maxScale) * radius(scale)
      );
      coordinates.push(coordinates[0]);

      svg
        .append("path")
        .datum(coordinates)
        .attr("class", "dataLine")
        .attr("d", line)
        .attr("transform", `translate(${center.x},${center.y})`)
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 2);
    });
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
                  Topics
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
                    {item.topic}
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

export default Topics;
