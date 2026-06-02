import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // ✅ SAFE USER PARSE (IMPORTANT FIX)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const name = user?.name || "Farmer";
  const email = user?.email || "No Email";
  const farmerId = user?.farmerId || "N/A";
  const photo = user?.photo || "";

  // ✅ update on route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setShowMenu(false);
    setShowExplore(false);
  }, [location]);

  // Scroll detection for navbar shrink
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && !e.target.closest(".profile-container")) {
        setShowMenu(false);
      }
      if (showExplore && !e.target.closest(".explore-container")) {
        setShowExplore(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, showExplore]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-inner">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon"><img src="image-Photoroom.jpg" alt="KrishiDisha Logo" /></span>
            <span className="logo-text">KrishiDisha</span>
          </Link>
        </div>



        {/* Hamburger Button */}
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive("/") ? "nav-active" : ""}>
                <span className="nav-link-icon">🏠</span>
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/crop" className={isActive("/crop") ? "nav-active" : ""}>
                <span className="nav-link-icon">🌾</span>
                {t('nav.crop')}
              </Link>
            </li>
            <li>
              <Link to="/fertilizer" className={isActive("/fertilizer") ? "nav-active" : ""}>
                <span className="nav-link-icon">🧪</span>
                {t('nav.fertilizer')}
              </Link>
            </li>
            
            {/* Explore Dropdown */}
            <li className="explore-container">
              <div
                className={`explore-trigger-btn ${showExplore ? "active" : ""}`}
                onClick={() => setShowExplore(!showExplore)}
              >
                <span className="nav-link-icon">🔍</span>
                {t('nav.explore')} <span className={`explore-chevron ${showExplore ? "open" : ""}`}>▾</span>
              </div>
              
              {showExplore && (
                <ul className="explore-dropdown-menu">
                  <li>
                    <a href="/#mandi-section" onClick={() => setShowExplore(false)}>
                      <span className="dropdown-link-icon"></span>
                      {t('nav.mandi')}
                    </a>
                  </li>
                  <li>
                    <a href="/#weather-section" onClick={() => setShowExplore(false)}>
                      <span className="dropdown-link-icon"></span>
                      {t('nav.weather')}
                    </a>
                  </li>
                  <li>
                    <Link to="/history" onClick={() => setShowExplore(false)}>
                      <span className="dropdown-link-icon"></span>
                      {t('nav.history')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/blogs" className={isActive("/blogs") ? "nav-active" : ""}>
                <span className="nav-link-icon">📝</span>
                {t('nav.blog')}
              </Link>
            </li>

            {/* Language Switcher */}
            <li className="language-switcher" onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')} style={{ listStyle: 'none' }}>
              <span className="lang-icon"><FontAwesomeIcon icon={faEarthAmericas} /></span>
              <span className="lang-text">{i18n.language === 'en' ? 'हिंदी' : 'English'}</span>
            </li>

            {/* 🔐 PROFILE SECTION */}
            <li className="profile-container">
              {isLoggedIn ? (
                <>
                  <div
                    className="profile-trigger"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt="profile"
                        className="profile-icon"
                      />
                    ) : (
                      <div className="profile-avatar">
                        {getInitials(name)}
                      </div>
                    )}
                    <span className="profile-greeting">
                      Hi, {name.split(" ")[0]}
                    </span>
                    <span className={`profile-chevron ${showMenu ? "open" : ""}`}>▾</span>
                  </div>

                  {showMenu && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {photo ? (
                            <img src={photo} alt="profile" />
                          ) : (
                            <span>{getInitials(name)}</span>
                          )}
                        </div>
                        <div className="dropdown-info">
                          <p className="dropdown-name">{name}</p>
                          <p className="dropdown-email">{email}</p>
                          <p className="dropdown-farmer-id">ID: {farmerId}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/profile")}
                      >
                        <span>👤</span> {t('nav.editProfile')}
                      </button>
                      <button
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <span>🚪</span> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="login-btn">
                  <span></span> {t('nav.login')}
                </Link>
              )}
            </li>
            {/* Theme Toggle */}
            <li className="theme-toggle-item" onClick={toggleTheme} title="Toggle Theme" style={{ listStyle: 'none', cursor: 'pointer', fontSize: '1.4rem', marginLeft: '10px', marginRight: '15px', display: 'flex', alignItems: 'center', transition: 'transform 0.3s ease' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;