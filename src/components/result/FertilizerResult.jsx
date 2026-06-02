import React, { useEffect } from 'react';
import Header from '../header/Header';
import "./FertilizerResult.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { output_descriptions, label_image_paths } from '../fertilizer/FertilizerOutputs';

export function FertilizerResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (locationState == null) {
      navigate("/fertilizer");
    }
  }, [locationState, navigate]);

  if (locationState == null) return null;

  const predicted_fertilizer = locationState["predicted_fertilizer"];
  const output_image_path = label_image_paths[predicted_fertilizer];

  return (
    <>
      <Header />
      <div className="result-page">
        <div className="result-glow"></div>

        {/* Success Banner */}
        <div className="result-banner">
          <div className="banner-badge">
            <span className="badge-pulse"></span>
            <span>🧪 {t('result.fertReady')}</span>
          </div>
          <h1 className="result-heading">
            {t('result.youShouldUse')}
            <span className="result-crop-name"> {predicted_fertilizer.toUpperCase()} </span>
            <span className="crop-bounce">🌿</span>
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
                  alt={predicted_fertilizer}
                />
                <div className="img-glow-overlay"></div>
              </div>
              <div className="result-quick-info">
                <div className="quick-chip">
                  <span>🧬</span>
                  <span>{t('result.npkBalanced')}</span>
                </div>
                <div className="quick-chip">
                  <span>🌱</span>
                  <span>{t('result.cropSpecific')}</span>
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
                <h2>{t('result.why')} {predicted_fertilizer}?</h2>
                <p className="result-text-sub">{t('result.basedOnSoilFert')}</p>
              </div>
              <div className="result-description-scroll">
                <p className="result-description">
                  {output_descriptions[i18n.language?.startsWith('hi') ? 'hi' : 'en'][predicted_fertilizer]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="result-tip">
          <span className="tip-emoji">💡</span>
          <p><strong>Pro Tip:</strong> {t('result.fertTip')}</p>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <button className="result-btn result-btn-secondary" onClick={() => navigate("/fertilizer")}>
            <span>🔄</span> {t('result.tryAnotherFert')}
          </button>
          <button className="result-btn result-btn-primary" onClick={() => navigate("/")}>
            <span>🏠</span> {t('result.backToHome')}
          </button>
        </div>
      </div>
    </>
  );
}
