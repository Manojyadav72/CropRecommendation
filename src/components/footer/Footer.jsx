import React, { useState, useEffect } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLocationCrosshairs, faEnvelope, faPhone, faShieldAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";


const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'about' | 'privacy' | 'terms' | 'contact' | 'faq'
    const [activeFaq, setActiveFaq] = useState(null);
    const [supportSubmitted, setSupportSubmitted] = useState(false);
    const [supportSending, setSupportSending] = useState(false);
    const [supportForm, setSupportForm] = useState({ name: "", email: "", desc: "" });

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const handleSupportSubmit = (e) => {
        e.preventDefault();
        setSupportSending(true);
        setTimeout(() => {
            setSupportSending(false);
            setSupportSubmitted(true);
            setSupportForm({ name: "", email: "", desc: "" });
            setTimeout(() => setSupportSubmitted(false), 4000);
        }, 1200);
    };

    const handleSupportChange = (e) => {
        setSupportForm({ ...supportForm, [e.target.name]: e.target.value });
    };

    // Close modal on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setActiveModal(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (activeModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [activeModal]);

    const faqData = [
        {
            q: "How does KrishiDisha predict the best crop for my land?",
            a: "KrishiDisha utilizes an advanced Random Forest classification algorithm. By analyzing your soil's Nitrogen, Phosphorus, Potassium (N-P-K) levels, soil pH, ambient temperature, humidity, and annual rainfall metrics, it references historical cultivation success data to recommend the optimal crop."
        },
        {
            q: "Where can I get values for Nitrogen, Phosphorus, Potassium, and pH?",
            a: "These inputs are standard soil metrics that you can obtain from your nearest local agricultural extension center, Government soil testing labs, or by using widely available mobile soil testing kits."
        },
        {
            q: "Are the recommendations 100% guaranteed?",
            a: "While our models display high validation accuracy, agricultural yield is influenced by external variables like seed quality, local irrigation facilities, and unpredictable pest attacks. We suggest cross-referencing our advice with local block extension offices."
        },
        {
            q: "How often are the Mandi market prices updated?",
            a: "We pull live pricing trends and regional arrivals daily from national mandi data feeds, providing you with real-time analytics to negotiate better prices with traders."
        },
        {
            q: "How do I chat with the AI Farming Assistant?",
            a: "Click on the circular floating AI Assistant button in the bottom right corner. You can start a conversation, save historical chats, voice type your queries in Hindi or English, and rename/delete thread records just like ChatGPT!"
        }
    ];

    return (
        <footer className="footer">
           

            <div className="footer-wrapper">
                <div className="footer-container">
                    {/* Brand Section */}
                    <div className="footer-section footer-brand">
                        <h2 className="brand-title">🌾 KrishiDisha</h2>
                        <p className="brand-subtitle">AI-powered farming assistant</p>
                        <p className="brand-description">Empowering farmers with intelligent crop and fertilizer recommendations using cutting-edge machine learning technology.</p>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/manoj-yadav9627/" className="social-link" title="LinkedIn">in</a>
                            <a href="https://github.com/Manojyadav72" className="social-link" title="GitHub"><FontAwesomeIcon icon={faGithub} /></a>
                            <a href="https://x.com/home" className="social-link" title="Twitter">𝕏</a>
                            <a href="https://www.facebook.com/" className="social-link" title="Facebook">f</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/crop">Crop Recommendation</Link></li>
                            <li><Link to="/fertilizer">Fertilizer Guide</Link></li>
                            <li><a href="/#mandi-section">Mandi Prices</a></li>
                            <li><a href="/#weather-section">Weather Updates</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-section">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveModal("about"); }}>About Us</a></li>
                            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setActiveModal("privacy"); }}>Privacy Policy</a></li>
                            <li><a href="#terms" onClick={(e) => { e.preventDefault(); setActiveModal("terms"); }}>Terms & Conditions</a></li>
                            <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveModal("contact"); }}>Contact Support</a></li>
                            <li><a href="#faq" onClick={(e) => { e.preventDefault(); setActiveModal("faq"); }}>FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-section footer-contact-info">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <span className="contact-icon"><FontAwesomeIcon icon={faLocationCrosshairs} /></span>
                            <div>
                                <p className="contact-label">Location</p>
                                <p>Sultanpur, Uttar Pradesh, India</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                            <div>
                                <p className="contact-label">Email</p>
                                <a href="mailto:manojyadav9027@gmail.com">manojyadav9027@gmail.com</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon"><FontAwesomeIcon icon={faPhone} /></span>
                            <div>
                                <p className="contact-label">Phone</p>
                                <p>+91 9876543210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-divider"></div>
            <div className="footer-bottom">
                <p>&copy; 2026 KrishiDisha. All rights reserved.</p>
                <p>Made with <span className="heart">💚</span> For Farmers</p>
            </div>

            {/* ================= RESOURCE MODALS ================= */}
            {activeModal && (
                <div className="footer-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="footer-modal-box" onClick={(e) => e.stopPropagation()}>
                        <button className="footer-modal-close" onClick={() => setActiveModal(null)} title="Close">✕</button>
                        <FontAwesomeIcon icon={faInfoCircle} /> 
                        <div className="footer-modal-body">
                            {/* ABOUT US MODAL */}
                            {activeModal === "about" && (
                                <div className="modal-content-details">
                                    <h3>🌾 About KrishiDisha</h3>
                                    <div className="modal-accent-line"></div>
                                    <p className="modal-intro-text">
                                        <strong>KrishiDisha</strong> is a state-of-the-art agricultural decision assistance platform. 
                                        We integrate Machine Learning algorithms, real-time weather analytics, and Indian mandi prices to empower 
                                        our farming communities with precision insights.
                                    </p>
                                    
                                    <div className="modal-section-block">
                                        <h4>🌱 Our Primary Objectives</h4>
                                        <ul>
                                            <li><strong>Advanced Recommendation Models:</strong> Trained on standard agricultural datasets, recommending high-yielding crops based on soil NPK levels, temperature, and rain patterns.</li>
                                            <li><strong>Optimal Fertilizer Usage:</strong> Helping maintain long-term soil health by calculating fertilizer recommendations that balance specific micro and macro-nutrients.</li>
                                            <li><strong>Mandi Market transparency:</strong> Direct market price visualization prevents middleman exploitation, keeping pricing fair for local farmers.</li>
                                            <li><strong>Agricultural Calendar:</strong> Interactive crop calendars tailored to seasonal Rabi, Kharif, and Zaid cultivation schedules.</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="modal-section-block">
                                        <h4><FontAwesomeIcon icon={faLocationCrosshairs} /> Dedicated to Sultanpur</h4>
                                        <p>Developed with love in Sultanpur, Uttar Pradesh, India, KrishiDisha aims to bridge the gap between complex data science and grassroot agriculture to support sustainable local livelihoods.</p>
                                    </div>
                                </div>
                            )}

                            {/* PRIVACY POLICY MODAL */}
                            {activeModal === "privacy" && (
                                <div className="modal-content-details">
                                    <h3><FontAwesomeIcon icon={faShieldAlt} /> Privacy Policy</h3>
                                    <div className="modal-accent-line"></div>
                                    <p className="modal-intro-text">
                                        Your privacy is vital to us. This statement details the storage, usage, and processing parameters 
                                        governing data entered on the KrishiDisha platform.
                                    </p>

                                    <div className="modal-section-block">
                                        <h4>1. What Data Do We Gather?</h4>
                                        <p>We store basic account details (name, email hash, profile avatar link) and crop search inputs (Nitrogen, Phosphorous, Potassium, Soil pH) along with regional geo-coordinates to populate your farming dashboard and retrieve local weather metrics.</p>
                                    </div>

                                    <div className="modal-section-block">
                                        <h4>2. Strictly Internal Usage</h4>
                                        <p>Your search telemetry and parameters are stored exclusively to offer activity history lists and customize AI Chatbot responses. We do not sell, rent, or distribute data to third-party advertising companies.</p>
                                    </div>

                                    <div className="modal-section-block">
                                        <h4>3. Security Standard</h4>
                                        <p>All passwords are encrypted with bcrypt inside our secure MongoDB records. All transaction tokens are encapsulated using JSON Web Tokens (JWT) for secure authenticated communications.</p>
                                    </div>
                                </div>
                            )}

                            {/* TERMS & CONDITIONS MODAL */}
                            {activeModal === "terms" && (
                                <div className="modal-content-details">
                                    <h3>📜 Terms & Conditions</h3>
                                    <div className="modal-accent-line"></div>
                                    <p className="modal-intro-text">
                                        By using KrishiDisha, you accept and agree to follow our service terms.
                                    </p>

                                    <div className="modal-section-block">
                                        <h4>1. AI Prediction Advisory</h4>
                                        <p>Our crop and fertilizer guidance models output predictive suggestions built upon historical data trends. Because soil health varies based on seeds, water salinity, local pests, and microclimates, farmers are highly encouraged to verify AI outcomes with local block officers or agricultural universities before making financial investments.</p>
                                    </div>

                                    <div className="modal-section-block">
                                        <h4>2. User Responsibilities</h4>
                                        <p>You are responsible for securing your profile credentials. KrishiDisha is not liable for data loss arising from weak login combinations.</p>
                                    </div>

                                    <div className="modal-section-block">
                                        <h4>3. Fair Telemetry Access</h4>
                                        <p>API abuse, bots, crawler scraping, and chat rate-limiting violations will result in account suspension.</p>
                                    </div>
                                </div>
                            )}

                            {/* CONTACT SUPPORT MODAL */}
                            {activeModal === "contact" && (
                                <div className="modal-content-details">
                                    <h3>📬 Contact Support</h3>
                                    <div className="modal-accent-line"></div>
                                    <p className="modal-intro-text">
                                        Need technical help? Submit a ticket below, and our Sultanpur support desk will respond shortly.
                                    </p>

                                    {supportSubmitted ? (
                                        <div className="support-modal-success">
                                            <h4>✅ Ticket Received!</h4>
                                            <p>Your support ticket has been submitted. A team member will get back to you shortly at the email address provided.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSupportSubmit} className="support-modal-form">
                                            <div className="form-group-modal">
                                                <label>Your Name</label>
                                                <input 
                                                    type="text" 
                                                    name="name"
                                                    value={supportForm.name}
                                                    onChange={handleSupportChange}
                                                    placeholder="Enter your name" 
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group-modal">
                                                <label>Email Address</label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    value={supportForm.email}
                                                    onChange={handleSupportChange}
                                                    placeholder="farmer@example.com" 
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group-modal">
                                                <label>How can we help you?</label>
                                                <textarea 
                                                    name="desc"
                                                    value={supportForm.desc}
                                                    onChange={handleSupportChange}
                                                    rows="4" 
                                                    placeholder="Explain the issue with crop prediction, fertilizer recommendation, or login issues..." 
                                                    required
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="support-modal-submit-btn" disabled={supportSending}>
                                                {supportSending ? "Submitting..." : "Submit Support Ticket"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* FAQ MODAL */}
                            {activeModal === "faq" && (
                                <div className="modal-content-details">
                                    <h3>💡 Frequently Asked Questions (FAQ)</h3>
                                    <div className="modal-accent-line"></div>
                                    
                                    <div className="modal-faq-accordion">
                                        {faqData.map((faq, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`modal-faq-item ${activeFaq === idx ? "active" : ""}`}
                                            >
                                                <div 
                                                    className="modal-faq-question" 
                                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                                >
                                                    <span>{faq.q}</span>
                                                    <span className="faq-icon-arrow">{activeFaq === idx ? "▼" : "▶"}</span>
                                                </div>
                                                {activeFaq === idx && (
                                                    <div className="modal-faq-answer">
                                                        <p>{faq.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;