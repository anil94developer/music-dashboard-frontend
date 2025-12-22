import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MarketGraph = ({ charDdata }) => {
  // Extract labels and values from charDdata
  const labels = charDdata.map((data) => data.label);
  const values = charDdata.map((data) => data.y);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Market Data",
        data: values,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: '#764ba2',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#764ba2',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: { 
          color: "#333333",
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: { 
          color: "#e0e0e0",
          drawBorder: false
        },
      },
      y: {
        ticks: { 
          color: "#333333",
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: { 
          color: "#e0e0e0",
          drawBorder: false
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container-modern">
      <h2 className="chart-title">
        <i className="fa fa-chart-bar"></i> Market Data
      </h2>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MarketGraph;
