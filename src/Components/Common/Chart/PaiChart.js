import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const CustomPieChart = ({ data,size =500 }) => {
  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.y, 0);

  // Format data for MUI PieChart
  const chartData = data.map((item, index) => ({
    id: item.name,
    value: item.y,
    label: `${item.name}: ${(item.y / total * 100).toFixed(1)}%`, // Show name + percentage
    color: ["#FF4500", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0"][index % 5], // Assign colors dynamically
  }));

  return (
    <div className="pie-chart-container">
      <h2 className="pie-chart-title">
        <i className="fa fa-chart-pie"></i> Top Store Sales
      </h2>
      <PieChart
        series={[
          {
            data: chartData,
            outerRadius: 120,
            innerRadius: 50,
            paddingAngle: 3,
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 15,
            arcLabelRadius: "75%",
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold",
            fill: "#333333",
            fontSize: "13px",
          },
        }}
        width={size == 'full' ? 900 : 500}
        height={350}
      />
    </div>
  );
};

export default CustomPieChart;
