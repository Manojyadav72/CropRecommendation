import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../header/Header.jsx";
import "./HistoryPage.css";

const HistoryPage = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // 🔍 Fetch Search History from backend
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("http://localhost:5000/api/history/search", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setHistory(data);
                }
            } catch (err) {
                console.error("Failed to load search history:", err);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this search history item?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/history/search/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                setHistory(prev => prev.filter(item => item._id !== id));
            } else {
                alert("Failed to delete history item");
            }
        } catch (err) {
            console.error("Error deleting history item:", err);
            alert("Error deleting history item");
        }
    };

    return (
        <>
            <Header />
            <div className="history-page">
                <div className="history-card-centered">
                    <h3>🌱 {t('profile.historyTitle', 'Farming Activity History')}</h3>

                    {historyLoading ? (
                        <p style={{ color: "#aaa" }}>Loading history...</p>
                    ) : history.length === 0 ? (
                        <div className="history-empty">
                            <p>🌾 {t('profile.noHistory', 'No past activity found. Start analyzing soil on the Crop or Fertilizer pages!')}</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((item, idx) => (
                                <div 
                                    key={item._id || idx} 
                                    className={`history-item ${item.type === "fertilizer" ? "fertilizer" : ""}`}
                                >
                                    <div className="history-item-header">
                                        <span className={`history-type-badge ${item.type}`}>
                                            {item.type === "crop" 
                                                ? `🌾 ${t('profile.crop', 'Crop')}` 
                                                : `🧪 ${t('profile.fertilizer', 'Fertilizer')}`
                                            }
                                        </span>
                                        <div className="history-header-right">
                                            <span className="history-date">{formatDate(item.timestamp)}</span>
                                            <button 
                                                className="history-delete-btn"
                                                onClick={(e) => handleDelete(item._id, e)}
                                                title="Delete search"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>

                                    {/* Parameter Grid */}
                                    {item.type === "crop" ? (
                                        <div className="history-details">
                                            <div className="history-param">
                                                <span>N</span>
                                                <strong>{item.inputs?.nitrogen || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>P</span>
                                                <strong>{item.inputs?.phosphorous || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>K</span>
                                                <strong>{item.inputs?.potassium || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>pH</span>
                                                <strong>{item.inputs?.ph || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>Temp</span>
                                                <strong>{Number(item.inputs?.temperature || 0).toFixed(1)}°C</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>Humidity</span>
                                                <strong>{Number(item.inputs?.humidity || 0).toFixed(1)}%</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>Rainfall</span>
                                                <strong>{Number(item.inputs?.rainfall || 0).toFixed(0)}mm</strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="history-details">
                                            <div className="history-param">
                                                <span>N</span>
                                                <strong>{item.inputs?.nitrogen || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>P</span>
                                                <strong>{item.inputs?.phosphorous || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>K</span>
                                                <strong>{item.inputs?.potassium || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>Soil</span>
                                                <strong>{item.inputs?.soil || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>Crop</span>
                                                <strong>{item.inputs?.crop || "N/A"}</strong>
                                            </div>
                                            <div className="history-param">
                                                <span>Moisture</span>
                                                <strong>{Number(item.inputs?.moisture || 0).toFixed(0)}%</strong>
                                            </div>
                                        </div>
                                    )}

                                    {/* Result Text */}
                                    {item.type === "crop" ? (
                                        <div className="history-result">
                                            {t('profile.predicted', 'Recommended Crop')}: <strong>{item.result?.predicted_crop}</strong>
                                            {item.result?.optional_crops?.length > 0 && (
                                                <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "4px" }}>
                                                    {t('profile.optional', 'Optional')}: {item.result.optional_crops.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="history-result fertilizer">
                                            {t('profile.predicted', 'Recommended Fertilizer')}: <strong>{item.result}</strong>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HistoryPage;
