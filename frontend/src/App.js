// import React, { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// import BillingInfo from "./components/BillingInfo"; // Import BillingInfo component
// import "./style.css";

// function App() {
//   const [forecastData, setForecastData] = useState({
//     actual_hourly_kVAh: [],
//     forecasted_kVAh: [],
//   });
//   const [billingInfo, setBillingInfo] = useState(null); // State for billing info
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [forecastHours, setForecastHours] = useState(24); // Default forecast hours

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     try {
//       const response = await fetch("http://localhost:5000/forecast", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           start_date: startDate,
//           end_date: endDate,
//           forecast_hours: forecastHours,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Error fetching forecast data");
//       }

//       const data = await response.json();
//       setBillingInfo(data.billing_info); // Set billing info from the response
//       fetchForecastData(); // Fetch forecast data for the chart
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const fetchForecastData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/forecast-data");
//       const data = await response.json();
//       setForecastData(data);
//     } catch (error) {
//       console.error("Error fetching forecast data:", error);
//     }
//   };

//   // Combine actual and forecasted data for chart rendering
//   const combinedData = forecastData.actual_hourly_kVAh.map((actual) => {
//     const forecast = forecastData.forecasted_kVAh.find(
//       (forecast) => forecast.DateTime === actual.DateTime
//     );

//     return {
//       DateTime: actual.DateTime,
//       kVah_diff: actual.kVah_diff,
//       Forecasted_kVah: forecast ? forecast.Forecasted_kVah : null,
//     };
//   });

//   return (
//     <div>
//       <h1>Energy Forecasting</h1>
//       <div className="form-container">
//         <form onSubmit={handleSubmit}>
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             Forecast Hours:
//             <input
//               type="number"
//               value={forecastHours}
//               onChange={(e) => setForecastHours(e.target.value)}
//               min="1"
//               required
//             />
//           </label>
//           <button type="submit">Get Billing Info</button>
//         </form>
//       </div>
//       {billingInfo && <BillingInfo billingInfo={billingInfo} />} {/* Display Billing Info */}
//       {combinedData.length > 0 ? (
//         <div>
//           <h2>kVAh Comparison</h2>
//           <LineChart
//             width={700}
//             height={500}
//             data={combinedData}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="DateTime" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="kVah_diff" stroke="#8884d8" name="Actual kVAh" />
//             <Line
//               type="monotone"
//               dataKey="Forecasted_kVah"
//               stroke="#82ca9d"
//               name="Forecasted kVAh"
//             />
//           </LineChart>
//         </div>
//       ) : (
//         <div>Loading data...</div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import BillingInfo from "./components/BillingInfo";
import "./style.css";

function App() {
  const [forecastData, setForecastData] = useState({
    actual_hourly_kVAh: [],
    forecasted_kVAh: [],
  });
  const [billingInfo, setBillingInfo] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [forecastHours, setForecastHours] = useState(24);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          forecast_hours: forecastHours,
        }),
      });

      if (!response.ok) throw new Error("Error fetching forecast data");

      const data = await response.json();
      setBillingInfo(data.billing_info);
      fetchForecastData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/forecast-data");
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  // Combine actual and forecasted data
  const combinedData = [
    ...forecastData.actual_hourly_kVAh.map((actual) => ({
      DateTime: actual.DateTime,
      kVah_diff: actual.kVah_diff,
      Forecasted_kVah: null,
    })),
    ...forecastData.forecasted_kVAh.map((forecast) => ({
      DateTime: forecast.DateTime,
      kVah_diff: null,
      Forecasted_kVah: forecast.Forecasted_kVah,
    })),
  ].sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime)); // Sort by DateTime

  return (
    <div className="app-container">
      <h1>Energy Forecasting</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <label>
          Forecast Hours:
          <input
            type="number"
            value={forecastHours}
            onChange={(e) => setForecastHours(e.target.value)}
            min="1"
            required
          />
        </label>
        <button type="submit">Get Billing Info</button>
      </form>

      {billingInfo && (
        <div className="billing-info-container">
          <h2>Billing Information</h2>
          {Object.entries(billingInfo).map(([key, value]) => (
            <div key={key}>
              <span>{key.replace(/_/g, " ")}:</span>
              <span>{value.toFixed(2)}</span>
            </div>
          ))}
          <div className="total-charges">Total Charges: {billingInfo.total_charges.toFixed(2)}</div>
        </div>
      )}

      {combinedData.length > 0 ? (
        <div className="chart-container">
          <h2 className="chart-title">kVAh Comparison</h2>
          <LineChart
            width={700}
            height={400}
            data={combinedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="DateTime" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="kVah_diff" stroke="#8884d8" name="Actual kVAh" />
            <Line
              type="monotone"
              dataKey="Forecasted_kVah"
              stroke="#82ca9d"
              name="Forecasted kVAh"
            />
          </LineChart>
        </div>
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  );
}

export default App;
