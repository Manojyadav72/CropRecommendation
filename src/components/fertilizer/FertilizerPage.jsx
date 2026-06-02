import React, { useState } from "react";
import Header from "../header/Header.jsx";
import { useTranslation } from "react-i18next";
import "./FertilizerPage.css";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Chatbot from "../chatbot/Chatbot.jsx";

// -----------------------------
const FERTILIZER_ENDPOINT = "http://localhost:8080/fertilizer_recommend";

// 🔑 Weather API Key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// -----------------------------
// Weather function
async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=25.4358&lon=81.8463&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) return null;

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      moisture: data.main.humidity, // approx
    };
  } catch {
    return null;
  }
}

// -----------------------------
// Ranges
const ranges = {
  nitrogen: [0, 150],
  phosphorous: [5, 145],
  potassium: [5, 205],
  temperature: [0, 50],
  humidity: [1, 100],
  moisture: [0, 100],
};

// -----------------------------
const createRange = (min, max, step = 1) => {
  let arr = [];
  for (let i = min; i <= max; i += step) {
    arr.push(Number(i.toFixed(1)));
  }
  return arr;
};

// -----------------------------
export function FertilizerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    temperature: "",
    humidity: "",
    moisture: "",
    soil: "",
    crop: "",
  });

  // -----------------------------
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -----------------------------
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
      moisture: weather.moisture,
    }));
  };

  // -----------------------------
  const isInvalid = (field, value) => {
    if (value === "") return false;
    const [min, max] = ranges[field];
    return value < min || value > max;
  };

  // -----------------------------
  const handlePredict = () => {
    for (let key in formData) {
      if (formData[key] === "") {
        alert("Please fill all fields");
        return;
      }
    }

    setLoading(true);

    const payload = {
      array: [
        Number(formData.temperature),
        Number(formData.humidity),
        Number(formData.moisture),
        Number(formData.nitrogen),
        Number(formData.potassium),
        Number(formData.phosphorous),
        formData.soil,
        formData.crop,
      ],
    };

    fetch(FERTILIZER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
              type: "fertilizer",
              inputs: {
                nitrogen: formData.nitrogen,
                phosphorous: formData.phosphorous,
                potassium: formData.potassium,
                temperature: formData.temperature,
                humidity: formData.humidity,
                moisture: formData.moisture,
                soil: formData.soil,
                crop: formData.crop
              },
              result: result
            })
          }).catch((err) => console.error("Failed to save search history:", err));
        }

        navigate("/fertilizer_result", {
          state: { predicted_fertilizer: result },
        });
      })
      .catch(() => {
        setLoading(false);
        alert("Backend error");
      });
  };

  // -----------------------------
  const renderField = (label, field, step = 1, icon = "🌾") => {
    const [min, max] = ranges[field];

    return (
      <div className="input-group">
        <div className="input-icon">{icon}</div>
        <div className="input-field">
          <Autocomplete
            options={createRange(min, max, step)}
            value={formData[field] || null}
            inputValue={formData[field] || ""}
            onChange={(e, newValue) => handleChange(field, newValue)}
            onInputChange={(e, newInputValue) => handleChange(field, newInputValue)}
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

      <div className="fertilizer-page">
        <div className="hero-section">
          <div className="ai-section">
               <Chatbot />
          </div>
          <h1 className="fertilizer-title">
            {t('fertForm.title', 'AI Fertilizer Recommendation').replace('Recommendation', '')} <span className="highlight">Recommendation</span>
          </h1>
          <p className="fertilizer-subtitle">
            {t('fertForm.desc', 'Get personalized fertilizer suggestions based on your soil profile and target crop.')}
          </p>
        </div>

        <div className="fertilizer-card">
          <div className="card-header">
            <div className="header-icon">🧪</div>
            <h2>{t('cropForm.analysisTitle', 'Nutrient Analysis')}</h2>
            <p>{t('cropForm.analysisDesc', 'Enter your soil parameters for optimal fertilizer advice')}</p>
          </div>

          <div className="fertilizer-container">
            {renderField(t('fertForm.nitrogen', "Nitrogen (N) in Soil"), "nitrogen", 1, "💧")}
            {renderField(t('fertForm.phosphorous', "Phosphorous (P) in Soil"), "phosphorous", 1, "🔬")}
            {renderField(t('fertForm.potassium', "Potassium (K) in Soil"), "potassium", 1, "⚡")}
            {renderField(t('cropForm.temperature', "Temperature (°C)"), "temperature", 1, "🌡️")}
            {renderField(t('cropForm.humidity', "Humidity (%)"), "humidity", 1, "💨")}
            {renderField(t('cropForm.moisture', "Moisture"), "moisture", 1, "💦")}

            {/* Soil */}
            <div className="input-group">
              <div className="input-icon">🪴</div>
              <div className="input-field">
                <TextField
                  select
                  label="Soil Type"
                  value={formData.soil}
                  onChange={(e) => handleChange("soil", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Sandy">Sandy</MenuItem>
                  <MenuItem value="Loamy">Loamy</MenuItem>
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="Red">Red</MenuItem>
                  <MenuItem value="Clayey">Clayey</MenuItem>
                </TextField>
              </div>
            </div>

            {/* Crop */}
            <div className="input-group">
              <div className="input-icon">🌾</div>
              <div className="input-field">
                <TextField
                  select
                  label={t('fertForm.cropType', "Crop Type")}
                  value={formData.crop}
                  onChange={(e) => handleChange("crop", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Maize">Maize</MenuItem>
                  <MenuItem value="Sugarcane">Sugarcane</MenuItem>
                  <MenuItem value="Cotton">Cotton</MenuItem>
                  <MenuItem value="Paddy">Paddy</MenuItem>
                  <MenuItem value="Wheat">Wheat</MenuItem>
                  <MenuItem value="Barley">Barley</MenuItem>
                  <MenuItem value="Soybean">Soybean</MenuItem>
                  <MenuItem value="Groundnut">Groundnut</MenuItem>
                  <MenuItem value="Mustard">Mustard</MenuItem>
                  <MenuItem value="Millet">Millet</MenuItem>
                  <MenuItem value="Tobacco">Tobacco</MenuItem>
                  <MenuItem value="Coffee">Coffee</MenuItem>
                  <MenuItem value="Tea">Tea</MenuItem>
                </TextField>
              </div>
            </div>
          </div>

          {/* 🌦️ Auto Weather Button */}
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleAutoFillWeather}>
              <span className="btn-icon">🌤️</span>
              {t('cropForm.autoFill', 'Auto Fill Weather')}
            </button>
            <button className="btn btn-primary" onClick={handlePredict}>
              <span className="btn-icon">🧪</span>
              {t('fertForm.getRecommendation', 'Predict Fertilizer')}
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}