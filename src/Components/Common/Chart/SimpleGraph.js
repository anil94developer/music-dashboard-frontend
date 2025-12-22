import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SimpleGraph = ({ data, title, type = "line" }) => {
  const chartData = {
    labels: data.map((point) => point.label),
    datasets: [
      {
        label: `${title} Data`,
        data: data.map((point) => point.y),
        borderColor: type === "bar" ? "#667eea" : "#764ba2",
        backgroundColor: type === "bar" 
          ? 'rgba(102, 126, 234, 0.8)'
          : "rgba(118, 75, 162, 0.1)",
        pointBackgroundColor: "#764ba2",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: type === "line",
        tension: type === "line" ? 0.4 : 0,
        borderWidth: type === "bar" ? 0 : 3,
        borderRadius: type === "bar" ? 8 : 0,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: { 
          color: "#333333",
          font: {
            size: 13,
            weight: '600'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#764ba2',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
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
        <i className={`fa ${type === "bar" ? "fa-chart-bar" : "fa-chart-line"}`}></i> {title} Data
      </h2>
      <div className="chart-wrapper">
        {type === "bar" ? <Bar data={chartData} options={options} /> : <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default SimpleGraph;
