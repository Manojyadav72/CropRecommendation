

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./WeatherCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faCloudShowersWater, faWind } from "@fortawesome/free-solid-svg-icons";

// Default location
const DEFAULT_LAT = 25.4358;
const DEFAULT_LON = 81.8463;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherCard = ({
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON,
  title = "Live Weather Conditions",
  showInsight = true,
}) => {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ================= FETCH WEATHER =================
  const fetchWeather = async (latitude = lat, longitude = lon) => {
    setLoading(true);
    setError(null);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        )
      ]);

      if (!currentRes.ok || !forecastRes.ok) throw new Error("Weather API error");

      const data = await currentRes.json();
      const forecastJson = await forecastRes.json();

      setLocationName(data.name);

      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        rainfall: data.rain ? data.rain["1h"] || 0 : 0,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });

      // Process 5-day forecast (take one reading per day, typically around noon)
      const dailyForecast = [];
      const seenDates = new Set();
      
      for (const item of forecastJson.list) {
        const date = new Date(item.dt * 1000);
        const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!seenDates.has(dayString) && seenDates.size < 5) {
          seenDates.add(dayString);
          dailyForecast.push({
            day: dayString,
            temp: Math.round(item.main.temp),
            icon: item.weather[0].icon,
            description: item.weather[0].description
          });
        }
      }
      setForecastData(dailyForecast);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH CITY (INDIA ONLY) =================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Geo API call restricted to IN
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery},IN&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error("Failed to find location");
      
      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        throw new Error(t('weather.cityNotFound', 'City not found in India'));
      }

      // We found the city, fetch weather for these coordinates
      await fetchWeather(geoData[0].lat, geoData[0].lon);
      setSearchQuery(""); // clear search
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // ================= AUTO LOCATION =================
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => fetchWeather()
      );
    } else {
      fetchWeather();
    }
  }, []);

  // ================= ICON =================
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // ================= FARMING INSIGHT =================
  const getFarmingInsight = () => {
    if (!weatherData) return "";
    const { rainfall, temperature, humidity, windSpeed } = weatherData;

    if (rainfall > 50) return t('weather.insightHighRain', "High rainfall expected. Ensure proper drainage.");
    if (windSpeed > 10) return t('weather.insightHighWind', "Strong winds detected. Secure tall crops.");
    if (temperature > 35) return t('weather.insightHighTemp', "High temperature alert. Increase irrigation.");
    if (humidity > 70) return t('weather.insightHighHumid', "High humidity. Monitor fungal diseases.");
    if (temperature < 15) return t('weather.insightLowTemp', "Cool conditions. Protect crops.");

    return t('weather.insightOptimal', "Optimal growing conditions!");
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="weather-card modern">
        <div className="weather-card-header">
          <div className="weather-title">
            <span className="title-icon">🌍</span>
            <h3>{t('weather.liveConditions', title)}</h3>
          </div>
        </div>
        <div className="weather-loading">
          <div className="spinner"></div>
          <p>{t('weather.fetching', 'Fetching weather data...')}</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error || !weatherData) {
    return (
      <div className="weather-card modern">
        <div className="weather-card-header">
          <div className="weather-title">
            <span className="title-icon">🌍</span>
            <h3>{t('weather.liveConditions', title)}</h3>
          </div>
        </div>
        <div className="weather-error-state">
          <p>{error || t('weather.errorFetch', 'Unable to fetch weather data')}</p>
          <button onClick={() => fetchWeather()}>{t('weather.tryAgain', 'Try Again')}</button>
        </div>
      </div>
    );
  }

  // ================= SUCCESS UI =================
  return (
    <div className="weather-card modern">
      <div className="weather-card-header">
        <div className="weather-title">
          <span className="title-icon">🌍</span>
          <h3>{t('weather.liveConditions', title)}</h3>
        </div>
        <div className="weather-header-actions">
          <form className="weather-search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder={t('weather.searchCity', 'Search city in India...')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="weather-search-input"
            />
            <button type="submit" className="weather-search-btn" disabled={isSearching}>
              {isSearching ? '⏳' : '🔍'}
            </button>
          </form>
          <button className="refresh-btn" onClick={() => fetchWeather()} title={t('weather.refresh', 'Refresh weather')}>
            🔄
          </button> 
        </div>
      </div>

      <div className="weather-content">
        <div className="weather-main">
          <p className="weather-location-name"><FontAwesomeIcon icon={faLocationCrosshairs} /> {locationName}</p>
          
          <div className="weather-current-display">
            <img
              src={getWeatherIconUrl(weatherData.icon)}
              alt={weatherData.condition}
              className="weather-main-icon"
            />
            <div className="temp-hero">
              <span className="current-temp-large">{Math.round(weatherData.temperature)}</span>
              <span className="temp-unit">°C</span>
            </div>
            <div className="weather-condition-badge">
              {weatherData.description}
            </div>
          </div>

          {showInsight && (
            <div className="farming-insight modern-insight">
              <div className="insight-icon">🌱</div>
              <div className="insight-text">
                {getFarmingInsight()}
              </div>
            </div>
          )}
        </div>

        <div className="weather-details-section">
          <h4 className="section-subtitle">{t('weather.currentDetails', 'Current Details')}</h4>
          <div className="weather-stats-grid">
            <div className="stat-box">
              <div className="stat-icon-small">💧</div>
              <div className="stat-info">
                <span className="stat-label">{t('weather.humidity', 'Humidity')}</span>
                <span className="stat-value">{weatherData.humidity}%</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon-small"><FontAwesomeIcon icon={faWind} /></div>
              <div className="stat-info">
                <span className="stat-label">{t('weather.wind', 'Wind')}</span>
                <span className="stat-value">{weatherData.windSpeed} m/s</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon-small"><FontAwesomeIcon icon={faCloudShowersWater} /></div>
              <div className="stat-info">
                <span className="stat-label">{t('weather.rainfall', 'Rainfall')}</span>
                <span className="stat-value">{weatherData.rainfall} mm</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon-small">🔽</div>
              <div className="stat-info">
                <span className="stat-label">{t('weather.pressure', 'Pressure')}</span>
                <span className="stat-value">{weatherData.pressure} hPa</span>
              </div>
            </div>
          </div>

          <h4 className="section-subtitle forecast-title">{t('weather.forecastTitle', '5-Day Forecast')}</h4>
          <div className="forecast-container">
            {forecastData.map((day, idx) => (
              <div key={idx} className="forecast-day">
                <span className="forecast-day-name">{idx === 0 ? t('weather.today', 'Today') : t(`weather.days.${day.day}`, day.day)}</span>
                <img 
                  src={getWeatherIconUrl(day.icon)} 
                  alt={day.description} 
                  className="forecast-icon"
                  title={day.description}
                />
                <span className="forecast-temp">{day.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;