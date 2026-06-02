import React, { useEffect } from "react";
import Header from "../header/Header";
import "./CropResult.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { output_descriptions, label_image_paths } from "../crop/CropOutputs";

export function CropResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (locationState == null) {
      navigate("/crop");
    }
  }, [locationState, navigate]);

  if (locationState == null) return null;

  const predicted_crop = locationState.predicted_crop;
  const output_image_path = label_image_paths[predicted_crop];

  return (
    <>
      <Header />
      <div className="result-page">
        {/* Background glow */}
        <div className="result-glow"></div>

        {/* Success Banner */}
        <div className="result-banner">
          <div className="banner-badge">
            <span className="badge-pulse"></span>
            <span>🌾 {t('result.cropReady')}</span>
          </div>
          <h1 className="result-heading">
            {t('result.youShouldGrow')}
            <span className="result-crop-name"> {predicted_crop.toUpperCase()} </span>
            <span className="crop-bounce">🌱</span>
          </h1>
        </div>

        {/* Main Result Card */}
        <div className="result-main-card">
          <div className="result-layout">
            {/* Left — Image */}
            <div className="result-image-side">
              <div className="result-img-wrapper">
                <img
                  className="result-img"
                  src={output_image_path}
                  alt={predicted_crop}
                />
                <div className="img-glow-overlay"></div>
              </div>
              <div className="result-quick-info">
                <div className="quick-chip">
                  <span>🌡️</span>
                  <span>{t('result.weatherAdaptive')}</span>
                </div>
                <div className="quick-chip">
                  <span>💧</span>
                  <span>{t('result.soilMatched')}</span>
                </div>
                <div className="quick-chip">
                  <span>📊</span>
                  <span>{t('result.aiVerified')}</span>
                </div>
              </div>
            </div>

            {/* Right — Description */}
            <div className="result-text-side">
              <div className="result-text-header">
                <h2>{t('result.why')} {predicted_crop.charAt(0).toUpperCase() + predicted_crop.slice(1)}?</h2>
                <p className="result-text-sub">{t('result.basedOnSoil')}</p>
              </div>
              <div className="result-description-scroll">
                <p className="result-description">
                  {output_descriptions[i18n.language?.startsWith('hi') ? 'hi' : 'en'][predicted_crop]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="result-tip">
          <span className="tip-emoji">💡</span>
          <p><strong>Pro Tip:</strong> {t('result.cropTip')}</p>
        </div>

        {/* Optional Crops */}
        {locationState.optional_crops && locationState.optional_crops.length > 0 && (
          <div className="optional-crops-section">
            <h3 className="optional-title">{t('result.optionalCrops', 'Other Optional Crops')}</h3>
            <div className="optional-crops-grid">
              {locationState.optional_crops.map((crop) => (
                <div key={crop} className="optional-crop-card">
                  <img src={label_image_paths[crop]} alt={crop} className="optional-crop-img" />
                  <p className="optional-crop-name">{crop.charAt(0).toUpperCase() + crop.slice(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="result-actions">
          <button className="result-btn result-btn-secondary" onClick={() => navigate("/crop")}>
            <span>🔄</span> {t('result.tryAnotherCrop')}
          </button>
          <button className="result-btn result-btn-primary" onClick={() => navigate("/")}>
            <span>🏠</span> {t('result.backToHome')}
          </button>
        </div>
      </div>
    </>
  );
}