import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SplineChart = () => {
  const dataPoints = [
    { x: 2008, y: 70.735 },
    { x: 2009, y: 74.102 },
    { x: 2010, y: 72.569 },
    { x: 2011, y: 72.743 },
    { x: 2012, y: 72.381 },
    { x: 2013, y: 71.406 },
    { x: 2014, y: 73.163 },
    { x: 2015, y: 74.270 },
    { x: 2016, y: 72.525 },
    { x: 2017, y: 73.121 },
  ];

  const chartData = {
    labels: dataPoints.map((point) => point.x),
    datasets: [
      {
        label: "Net Generation (in Billion kWh)",
        data: dataPoints.map((point) => point.y),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.5)",
        pointBackgroundColor: "#4CAF50",
        pointBorderColor: "#FFF",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Year", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
        grid: { color: "#444444" },
      },
      y: {
        title: { display: true, text: "Net Generation (bn kWh)", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
        grid: { color: "#444444" },
      },
    },
    plugins: {
      legend: { labels: { color: "#FFFFFF" } },
    },
  };

  return (
    <div style={{ backgroundColor: "#000", padding: "20px", borderRadius: "8px" }}>
      <h2 style={{ color: "#FFF", textAlign: "center" }}>Nuclear Electricity Generation in US</h2>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SplineChart;
