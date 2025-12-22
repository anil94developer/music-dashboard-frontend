import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StreamGraph = ({ list }) => {
  const chartData = {
    labels: list.map((item) => item.dsp),
    datasets: [
      {
        label: "Streams",
        data: list.map((item) => item.streams),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "DSP Platforms", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
        grid: { color: "#444444" },
      },
      y: {
        title: { display: true, text: "Streams", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
        grid: { color: "#444444" },
      },
    },
    plugins: {
      legend: { labels: { color: "#FFFFFF" } },
      tooltip: { enabled: true },
    },
  };

  return (
    <div style={{ backgroundColor: "#000", padding: "20px", borderRadius: "8px" }}>
      <h2 style={{ color: "#FFF", textAlign: "center" }}>Live Streams</h2>
      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StreamGraph;
