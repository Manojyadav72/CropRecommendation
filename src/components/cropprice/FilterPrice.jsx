import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./FilterPrice.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faSearch, faRotate, faHouse, faStore } from "@fortawesome/free-solid-svg-icons";


function MandiFilter() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stateVal, setStateVal] = useState("");
    const [district, setDistrict] = useState("");
    const [market, setMarket] = useState("");
    const [commodity, setCommodity] = useState("");
    const [result, setResult] = useState([]);
    const [validationError, setValidationError] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5000/api/data")
            .then(res => res.json())
            .then(data => { setData(data); setLoading(false); })
            .catch(err => { console.error("ERROR:", err); setLoading(false); });
    }, []);

    const getUnique = (key, arr) => {
        return [...new Set(arr.map(item => item[key]).filter(Boolean))].sort();
    };

    const handleSearch = () => {
        if (!stateVal || !district || !market || !commodity) {
            const missing = [];
            if (!stateVal) missing.push("State");
            if (!district) missing.push("District");
            if (!market) missing.push("Market");
            if (!commodity) missing.push("Commodity");
            setValidationError(`Please select: ${missing.join(", ")}`);
            setResult([]);
            return;
        }
        setValidationError("");
        let temp = data;
        if (stateVal) temp = temp.filter(d => d.state === stateVal);
        if (district) temp = temp.filter(d => d.district === district);
        if (market) temp = temp.filter(d => d.market === market);
        if (commodity) temp = temp.filter(d => d.commodity === commodity);
        setResult(temp);
    };

    const handleReset = () => {
        setStateVal(""); setDistrict(""); setMarket(""); setCommodity("");
        setResult([]); setValidationError("");
    };

    return (
        <div className="mandi-section">
            <div className="section-header">
                {/* <span className="section-icon">📊</span> */}
                <h2>{t('mandi.title', 'Mandi Price Finder')}</h2>
                <p>{t('mandi.desc', 'Check real-time crop market prices across India')}</p>
            </div>

            {loading && (
                <div className="mandi-loading">
                    <div className="mandi-loading-spinner"></div>
                    <p>Loading market data...</p>
                </div>
            )}
            {error && <p className="mandi-error">❌ Error: {error}</p>}

            <div className="mandi-container">
                {/* Filter Controls */}
                <div className="mandi-filters">
                    <div className="filter-grid">
                        <div className="filter-group">
                            <label><FontAwesomeIcon icon={faLocationCrosshairs} /> {t('mandi.state', 'State')}</label>
                            <select value={stateVal} onChange={(e) => { setStateVal(e.target.value); setDistrict(""); setMarket(""); setCommodity(""); }} disabled={loading || data.length === 0}>
                                <option value="">{t('mandi.state', 'Select State')}</option>
                                {data.length > 0 && getUnique("state", data).map((s, i) => (<option key={i} value={s}>{s}</option>))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label><FontAwesomeIcon icon={faHouse} /> {t('mandi.district', 'District')}</label>
                            <select value={district} onChange={(e) => { setDistrict(e.target.value); setMarket(""); setCommodity(""); }} disabled={!stateVal}>
                                <option value="">{t('mandi.district', 'Select District')}</option>
                                {stateVal && getUnique("district", data.filter(d => d.state === stateVal)).map((d, i) => (<option key={i} value={d}>{d}</option>))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label><FontAwesomeIcon icon={faStore} /> {t('mandi.market', 'Market')}</label>
                            <select value={market} onChange={(e) => { setMarket(e.target.value); setCommodity(""); }} disabled={!district}>
                                <option value="">{t('mandi.market', 'Select Market')}</option>
                                {district && getUnique("market", data.filter(d => d.state === stateVal && d.district === district)).map((m, i) => (<option key={i} value={m}>{m}</option>))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>🌾 {t('mandi.commodity', 'Commodity')}</label>
                            <select value={commodity} onChange={(e) => setCommodity(e.target.value)} disabled={!market}>
                                <option value="">{t('mandi.crop', 'Select Crop')}</option>
                                {market && getUnique("commodity", data.filter(d => d.state === stateVal && d.district === district && d.market === market)).map((c, i) => (<option key={i} value={c}>{c}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="filter-actions">
                        <button className="mandi-search-btn" onClick={handleSearch}>
                            ⚡ {t('mandi.checkPrices', 'Search Prices')}
                        </button>
                        <button className="mandi-reset-btn" onClick={handleReset}>
                            🔄 Reset
                        </button>
                    </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                    <div className="mandi-validation">
                        <span>⚠️</span> {validationError}
                    </div>
                )}

                {/* Results */}
                {result.length > 0 && (
                    <div className="mandi-results">
                        <div className="results-header">
                            <h3>📋 {t('mandi.resultsTitle', 'Price Results')}</h3>
                            <span className="results-count">{result.length} record{result.length !== 1 ? 's' : ''} found</span>
                        </div>
                        <div className="mandi-cards-grid">
                            {result.slice(0, 20).map((item, i) => (
                                <div key={i} className="mandi-price-card" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div className="price-card-header">
                                        <span className="crop-name">🌾 {item.commodity}</span>
                                        <span className="modal-price">₹{item.modal_price}/quintal</span>
                                    </div>
                                    <div className="price-card-body">
                                        <div className="price-detail">
                                            <span className="price-detail-label"><FontAwesomeIcon icon={faLocationCrosshairs} /> {t('mandi.state', 'State')}</span>
                                            <span className="price-detail-value">{item.state}</span>
                                        </div>
                                        <div className="price-detail">
                                            <span className="price-detail-label"><FontAwesomeIcon icon={faHouse} /> {t('mandi.district', 'District')}</span>
                                            <span className="price-detail-value">{item.district}</span>
                                        </div>
                                        <div className="price-detail">
                                            <span className="price-detail-label"><FontAwesomeIcon icon={faStore} /> {t('mandi.market', 'Market')}</span>
                                            <span className="price-detail-value">{item.market}</span>
                                        </div>
                                    </div>
                                    <div className="price-card-footer">
                                        <div className="price-range min">
                                            <span>{t('mandi.minPrice', 'Min')}</span>
                                            <strong>₹{item.min_price}</strong>
                                        </div>
                                        <div className="price-range-divider"></div>
                                        <div className="price-range max">
                                            <span>{t('mandi.maxPrice', 'Max')}</span>
                                            <strong>₹{item.max_price}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* {result.length === 0 && !validationError && !loading && (
                    <div className="mandi-empty">
                        <span className="empty-icon">🔍</span>
                        <p>Select filters above and click Search to find market prices</p>
                    </div>
                )} */}
            </div>
        </div>
    );
}

export default MandiFilter;