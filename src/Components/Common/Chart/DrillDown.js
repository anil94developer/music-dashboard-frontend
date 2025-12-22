import React, { useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const totalVisitors = 829500;

const doughnutData = {
  labels: ["New Visitors", "Returning Visitors"],
  datasets: [
    {
      data: [522460, 307040],
      backgroundColor: ["#E7823A", "#546BC1"],
      hoverBackgroundColor: ["#D67130", "#3F5BA1"],
    },
  ],
};

const drilldownData = {
  "New Visitors": {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "New Visitors",
        data: [37000, 39960, 41160, 42240, 42200, 43600, 45560, 47280, 48800, 52720, 56840, 58400],
        backgroundColor: "#E7823A",
      },
    ],
  },
  "Returning Visitors": {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Returning Visitors",
        data: [19000, 21040, 21840, 22760, 24800, 24400, 25440, 27720, 27200, 29280, 31160, 32400],
        backgroundColor: "#546BC1",
      },
    ],
  },
};

const DrillDown = () => {
  const [view, setView] = useState("main");

  return (
    <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
      <h2 style={{ color: "#fff" }}>New vs Returning Visitors</h2>
      {view === "main" ? (
        <Doughnut
          data={doughnutData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    let value = tooltipItem.raw;
                    let percentage = ((value / totalVisitors) * 100).toFixed(2);
                    return `${value} (${percentage}%)`;
                  },
                },
              },
            },
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const label = doughnutData.labels[elements[0].index];
                setView(label);
              }
            },
          }}
        />
      ) : (
        <>
          <Bar data={drilldownData[view]} options={{ responsive: true }} />
          <button onClick={() => setView("main")} style={buttonStyle}>
            &lt; Back
          </button>
        </>
      )}
    </div>
  );
};

const buttonStyle = {
  borderRadius: "4px",
  padding: "8px",
  border: "none",
  fontSize: "16px",
  backgroundColor: "#2eacd1",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};

export default DrillDown;
