// /src/components/ForecastChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const ForecastChart = ({ forecastData }) => {
  const labels = forecastData.map((data) => data.Date_Hourly);
  const forecastedValues = forecastData.map((data) => data.Forecasted_kVah);

  const data = {
    labels,
    datasets: [
      {
        label: "Forecasted kVah",
        data: forecastedValues,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default ForecastChart;
