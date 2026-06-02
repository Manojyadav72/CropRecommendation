import React, { useState } from "react";
import "./CropCalendar.css";

const cropData = {
  UP: [
    { month: "January", crops: ["Wheat", "Mustard", "Barley", "Peas"] },
    { month: "February", crops: ["Wheat", "Barley", "Gram", "Lentil"] },
    { month: "March", crops: ["Sugarcane", "Summer Moong", "Tomato", "Brinjal"] },
    { month: "April", crops: ["Watermelon", "Cucumber", "Bottle Gourd", "Maize"] },
    { month: "May", crops: ["Bajra", "Jowar", "Groundnut", "Sesame"] },
    { month: "June", crops: ["Paddy", "Arhar", "Urad", "Moong"] },
    { month: "July", crops: ["Paddy", "Maize", "Cotton", "Soybean"] },
    { month: "August", crops: ["Paddy", "Ragi", "Turmeric", "Ginger"] },
    { month: "September", crops: ["Paddy", "Sugarcane", "Vegetables", "Sunflower"] },
    { month: "October", crops: ["Wheat", "Mustard", "Peas", "Garlic"] },
    { month: "November", crops: ["Wheat", "Barley", "Lentil", "Onion"] },
    { month: "December", crops: ["Wheat", "Gram", "Mustard", "Potato"] }
  ],
  Bihar: [
    { month: "January", crops: ["Wheat", "Maize", "Gram", "Lentil"] },
    { month: "February", crops: ["Wheat", "Barley", "Mustard", "Peas"] },
    { month: "March", crops: ["Sugarcane", "Summer Veggies", "Mango", "Litchi"] },
    { month: "April", crops: ["Maize", "Watermelon", "Cucumber", "Bitter Gourd"] },
    { month: "May", crops: ["Bajra", "Jowar", "Arhar", "Urad"] },
    { month: "June", crops: ["Paddy", "Moong", "Maize", "Sesame"] },
    { month: "July", crops: ["Paddy", "Arhar", "Urad", "Soybean"] },
    { month: "August", crops: ["Paddy", "Maize", "Turmeric", "Chilli"] },
    { month: "September", crops: ["Paddy", "Sugarcane", "Vegetables", "Sunflower"] },
    { month: "October", crops: ["Wheat", "Mustard", "Peas", "Potato"] },
    { month: "November", crops: ["Wheat", "Barley", "Lentil", "Onion"] },
    { month: "December", crops: ["Wheat", "Gram", "Mustard", "Cauliflower"] }
  ],
  MP: [
    { month: "January", crops: ["Wheat", "Gram", "Mustard", "Barley"] },
    { month: "February", crops: ["Wheat", "Lentil", "Peas", "Sugarcane"] },
    { month: "March", crops: ["Summer Moong", "Urad", "Tomato", "Brinjal"] },
    { month: "April", crops: ["Watermelon", "Cucumber", "Maize", "Groundnut"] },
    { month: "May", crops: ["Bajra", "Jowar", "Arhar", "Sesame"] },
    { month: "June", crops: ["Paddy", "Moong", "Maize", "Cotton"] },
    { month: "July", crops: ["Paddy", "Soybean", "Urad", "Turmeric"] },
    { month: "August", crops: ["Paddy", "Maize", "Arhar", "Chilli"] },
    { month: "September", crops: ["Paddy", "Sugarcane", "Sunflower", "Vegetables"] },
    { month: "October", crops: ["Wheat", "Mustard", "Peas", "Garlic"] },
    { month: "November", crops: ["Wheat", "Barley", "Lentil", "Onion"] },
    { month: "December", crops: ["Wheat", "Gram", "Mustard", "Potato"] }
  ]
};

export default function CropCalendar() {
  const [state, setState] = useState("UP");
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const months = cropData[state] || [];

  return (
    <div className="calendar-app">
      <div className="calendar-header">
        <h1>🌾 Crop Calendar</h1>
        <p>Smart planting guide · Month by month</p>
      </div>

      <div className="state-picker">
        <label>Select State</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="UP">Uttar Pradesh</option>
          <option value="Bihar">Bihar</option>
          <option value="MP">Madhya Pradesh</option>
        </select>
      </div>

      <div className="months-grid">
        {months.map((month, idx) => {
          const isActive = month.month === currentMonth;
          return (
            <div key={idx} className={`month-card ${isActive ? "active" : ""}`}>
              <div className="month-header">
                <span className="month-icon">{getMonthIcon(month.month)}</span>
                <h3>{month.month}</h3>
                {isActive && <span className="current-badge">Now</span>}
              </div>
              <div className="crops-list">
                {month.crops.map((crop, i) => (
                  <span key={i} className="crop-chip">
                    🌱 {crop}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getMonthIcon(month) {
  const icons = {
    January: "❄️", February: "🌬️", March: "🌸", April: "☀️",
    May: "🔥", June: "🌧️", July: "⛈️", August: "🌦️",
    September: "🍂", October: "🍁", November: "🌫️", December: "⛄"
  };
  return icons[month] || "🌿";
}