// /src/components/BillingInfo.js
import React from "react";
import "../style.css";

const BillingInfo = ({ billingInfo }) => (
  <div className="billing-info">
    <h2>Billing Information</h2>
    <ul>
      {Object.entries(billingInfo).map(([key, value]) => (
        <li key={key}>
          <strong>{key.replace("_", " ")}:</strong> {value.toFixed(2)}
        </li>
      ))}
    </ul>
  </div>
);

export default BillingInfo;
