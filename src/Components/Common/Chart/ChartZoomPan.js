import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const generateDataPoints = (noOfDps) => {
    let xVal = 1, yVal = 100;
    let dps = [];
    for (let i = 0; i < noOfDps; i++) {
        yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        dps.push({ x: xVal, y: yVal });
        xVal++;
    }
    return dps;
};

const dataPoints = generateDataPoints(500);
const data = {
    labels: dataPoints.map(dp => dp.x),
    datasets: [{
        label: 'Audio Streams',
        data: dataPoints.map(dp => dp.y),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        fill: true,
    }]
};

const ChartZoomPan = () => (
    <div style={{ width: '100%', height: '400px', background: 'red' }}>
        <Line data={data} options={{ responsive: true }} />
    </div>
);

export default ChartZoomPan;
