import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ["Airfare", "Food & Drinks", "Accomodation", "Transportation", "Activities", "Misc"],
    datasets: [
        {
            label: "Trip Expenses",
            data: [20, 24, 20, 14, 12, 10], // Percentage values
            backgroundColor: [
                "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
            ],
            hoverBackgroundColor: [
                "#FF4F78", "#2F8DD1", "#FFB940", "#3AAFA9", "#865DFD", "#FF7F24"
            ],
        }
    ]
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        tooltip: {
            enabled: true,
        }
    }
};

const CircleGraph = () => {
    return (
        <div style={{ width: '400px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: 'white' }}>Trip Expenses</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default CircleGraph;
