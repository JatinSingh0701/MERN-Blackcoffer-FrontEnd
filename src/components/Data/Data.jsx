import React, { useState, useEffect } from "react";
import Intensity from "../Home/Intensity";
import axios from "axios";

function Data() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      let response = await axios.get(`https://kind-pink-rabbit-sock.cyclic.app/api`);
      console.log("Response from API:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
}

export default Data;
