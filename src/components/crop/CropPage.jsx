import React, { useState } from "react";
import Header from "../header/Header.jsx";
import { useTranslation } from "react-i18next";
import "./CropPage.css";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import WeatherCard from "../weather/WeatherCard.jsx"; // adjust path if needed
import Chatbot from "../chatbot/Chatbot.jsx"; 

// -----------------------------
// 🔑 Your API Key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// -----------------------------
// 🌦️ Weather API (used only for auto-fill)
async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=25.4358&lon=81.8463&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    if (data.cod !== 200) {
      alert("API Error: " + data.message);
      return null;
    }
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain ? data.rain["1h"] || 0 : 0,
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    alert("Network error");
    return null;
  }
}

// -----------------------------
// Range Config
const crop_value_ranges = {
  nitrogen: [0, 150],
  phosphorous: [5, 145],
  potassium: [5, 205],
  temperature: [0, 50],
  humidity: [1, 100],
  ph: [3, 10],
  rainfall: [0, 300],
};

// -----------------------------
// Range generator
const createRange = (min, max, step = 1) => {
  let arr = [];
  for (let i = min; i <= max; i += step) {
    arr.push(Number(i.toFixed(1)));
  }
  return arr;
};

// -----------------------------
const CROP_ENDPOINT = "http://localhost:8080/crop_recommend";

// -----------------------------
export function CropPage() {
  // console.log("API Result:", result);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  // -----------------------------
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -----------------------------
  const isInvalid = (field, value) => {
    if (value === "") return false;
    const [min, max] = crop_value_ranges[field];
    return value < min || value > max;
  };

  // -----------------------------
  const handlePredict = () => {
    for (let key in formData) {
      if (formData[key] === "") {
        alert("Please fill all fields");
        return;
      }
      if (isInvalid(key, formData[key])) {
        alert(`Invalid value in ${key}`);
        return;
      }
    }

    setLoading(true);

    const payload = {
      array: [
        Number(formData.nitrogen),
        Number(formData.phosphorous),
        Number(formData.potassium),
        Number(formData.temperature),
        Number(formData.humidity),
        Number(formData.ph),
        Number(formData.rainfall),
      ],
    };

    fetch(CROP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);

        // Save to Search History if logged in
        const token = localStorage.getItem("token");
        if (token) {
          fetch("http://localhost:5000/api/history/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              type: "crop",
              inputs: {
                nitrogen: formData.nitrogen,
                phosphorous: formData.phosphorous,
                potassium: formData.potassium,
                temperature: formData.temperature,
                humidity: formData.humidity,
                ph: formData.ph,
                rainfall: formData.rainfall
              },
              result: {
                predicted_crop: result.predicted_crop,
                optional_crops: result.optional_crops
              }
            })
          }).catch((err) => console.error("Failed to save search history:", err));
        }

        navigate("/crop_result", {
          state: { 
            predicted_crop: result.predicted_crop,
            optional_crops: result.optional_crops 
          },
        });
      })
      .catch(() => {
        setLoading(false);
        alert("Backend error. Make sure FastAPI is running.");
      });
  };

  // -----------------------------
  // 🌦️ Auto Fill Weather (uses same fetchWeather)
  const handleAutoFillWeather = async () => {
    const weather = await fetchWeather();
    if (!weather) {
      alert("Weather fetch failed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: weather.rainfall,
    }));
  };

  // -----------------------------
  const renderField = (label, field, step = 1, icon = "🌾") => {
    const [min, max] = crop_value_ranges[field];

    return (
      <div className="input-group">
        <div className="input-icon">{icon}</div>
        <div className="input-field">
          <Autocomplete
            options={createRange(min, max, step)}
            value={formData[field] || null}
            inputValue={formData[field] || ""}

            onChange={(e, newValue) => {
              handleChange(field, newValue);
            }}

            onInputChange={(e, newInputValue) => {
              handleChange(field, newInputValue);
            }}

            freeSolo
            blurOnSelect
            disablePortal
            autoHighlight
            selectOnFocus
            clearOnBlur={false}
            handleHomeEndKeys

            ListboxProps={{
              style: {
                maxHeight: 220,
                scrollBehavior: "smooth"
              }
            }}

            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                type="number"
                fullWidth

                error={isInvalid(field, formData[field])}
                helperText={
                  isInvalid(field, formData[field])
                    ? `Value must be between ${min} – ${max}`
                    : `Range: ${min} – ${max}`
                }
              />
            )}
          />
        </div>
      </div>
    );
  };

  // -----------------------------
  return (
    <>
      <Header />

      {loading && <LinearProgress color="success" />}

      <div className="crop-page">
        <div className="hero-section">
          <div className="ai-section">
               <Chatbot />
          </div>
          <h1 className="crop-title">
            {t('cropForm.title', 'AI Crop Recommendation').replace('Recommendation', '')} <span className="highlight">Recommendation</span>
          </h1>
          <p className="crop-subtitle">
            {t('cropForm.desc', 'Get data-driven insights for maximum yield and sustainable farming')}
          </p>
        </div>

        <div className="crop-card">
          <div className="card-header">
            <div className="header-icon">🌾</div>
            <h2>{t('cropForm.analysisTitle', 'Soil Health Analysis')}</h2>
            <p>{t('cropForm.analysisDesc', 'Enter your soil parameters for accurate crop prediction')}</p>
          </div>

          <div className="crop-container">
            {renderField(t('cropForm.nitrogen', "Nitrogen (N)"), "nitrogen", 1, "💧")}
            {renderField(t('cropForm.phosphorous', "Phosphorous (P)"), "phosphorous", 1, "🔬")}
            {renderField(t('cropForm.potassium', "Potassium (K)"), "potassium", 1, "⚡")}
            {renderField(t('cropForm.temperature', "Temperature (°C)"), "temperature", 1, "🌡️")}
            {renderField(t('cropForm.humidity', "Relative Humidity (%)"), "humidity", 1, "💨")}
            {renderField(t('cropForm.ph', "Soil pH Level"), "ph", 0.1, "🧪")}
            {renderField(t('cropForm.rainfall', "Annual Rainfall (mm)"), "rainfall", 1, "☔")}
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleAutoFillWeather}>
              <span className="btn-icon">🌤️</span>
              {t('cropForm.autoFill', 'Auto Fill Weather')}
            </button>
            <button className="btn btn-primary" onClick={handlePredict}>
              <span className="btn-icon">🌾</span>
              {t('cropForm.getRecommendation', 'Predict Crop')}
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        {/* WeatherCard – fully self‑contained */}
        <WeatherCard
          title="Live Weather Conditions"
          showInsight={true}
        />
      </div>
    </>
  );
}