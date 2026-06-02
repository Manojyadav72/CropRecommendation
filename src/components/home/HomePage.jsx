
import Header from "../header/Header.jsx";
import Background3D from "../3dmodel/Model.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useState, useEffect, useRef } from "react";
import { HashLoader } from "react-spinners";
import Container from "@mui/material/Container";
import WeatherCard from "../weather/WeatherCard.jsx";
import CropCalendar from "../calendar/cropCalendar.jsx";
import Chatbot from "../chatbot/Chatbot.jsx";
import Footer from "../footer/Footer.jsx";
import MandiFilter from "../cropprice/FilterPrice.jsx";
import ContactSection from "../contact/ContactSection.jsx";
import { useTranslation } from "react-i18next";

const MODEL_PATH = "/Model/scene.gltf";

// ─── Get Current Indian Crop Season ────────────────────
function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 6 && month <= 10) return { name: "Kharif", emoji: "🌧️" };
  if (month >= 11 || (month >= 1 && month <= 3)) return { name: "Rabi", emoji: "❄️" };
  return { name: "Zaid", emoji: "☀️" };
}

// ─── Scroll Reveal Hook ────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── Animated Counter ──────────────────────────────────
function AnimatedCounter({ end, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1800;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div className="stat-counter" ref={ref}>
      <span className="stat-number">{count.toLocaleString()}{suffix}</span>
      <span className="stat-label-text">{label}</span>
    </div>
  );
}

// ─── Section Divider ───────────────────────────────────
function SectionDivider() {
  return (
    <div className="section-divider">
      <div className="divider-line"></div>
      <div className="divider-icon"></div>
      <div className="divider-line"></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════
function HomePage({ children }) {
  const navigate = useNavigate();
  const heroRef = useScrollReveal();
  const howRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const mandiRef = useScrollReveal();
  const weatherRef = useScrollReveal();
  const seasonRef = useScrollReveal();
  const calendarRef = useScrollReveal();
  const contactRef = useScrollReveal();
  const season = getCurrentSeason();
  const { t } = useTranslation();

  // Performance Optimization: Pause/Unmount 3D WebGL Canvas when scrolled away
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroWrapperRef = useRef(null);

  useEffect(() => {
    const el = heroWrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      {/* ───── HERO SECTION ───── */}
      <div className="home-wrapper" ref={heroWrapperRef}>
        <div className="background-3d">
          {isHeroVisible ? children : <div style={{ height: "100vh", width: "100vw" }} />}
        </div>

        <div className="home-content reveal-section" ref={heroRef}>
          <div className="ai-section">
            <Chatbot />
          </div>

          <h1 className="hero-title">
            {t('home.title')}{" "}
            <span className="highlight">
              {t('home.titleHighlight', { season: season.name, emoji: season.emoji })}
            </span>
          </h1>

          <p className="hero-description">
            <strong>{t('home.subtitle')}</strong><br />
            {t('home.desc')}
          </p>

          <div className="btn-group">
            <button className="hero-btn" onClick={() => navigate("/crop")}>
              <span className="hero-btn-icon">🌾</span>
              {t('home.btnCrop')}
              <span className="hero-btn-arrow">→</span>
            </button>
            <button className="hero-btn" onClick={() => navigate("/fertilizer")}>
              <span className="hero-btn-icon">🧪</span>
              {t('home.btnFertilizer')}
              <span className="hero-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
     

      {/* ───── HOW IT WORKS ───── */}
      {/* <section className="how-section reveal-section" ref={howRef}>
        <div className="section-header">
          <span className="section-icon">⚙️</span>
          <h2>{t('home.howItWorks')}</h2>
          <p>{t('home.howItWorksSub')}</p>
        </div>

        <div className="how-grid">
          <div className="how-step">
            <div className="step-number">1</div>
            <div className="step-icon-big">📝</div>
            <h3>{t('home.step1')}</h3>
            <p>{t('home.step1Desc')}</p>
          </div>

          <div className="how-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow">▶</div>
          </div>

          <div className="how-step">
            <div className="step-number">2</div>
            <div className="step-icon-big">🤖</div>
            <h3>{t('home.step2')}</h3>
            <p>{t('home.step2Desc')}</p>
          </div>

          <div className="how-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow">▶</div>
          </div>

          <div className="how-step">
            <div className="step-number">3</div>
            <div className="step-icon-big">🌾</div>
            <h3>{t('home.step3')}</h3>
            <p>{t('home.step3Desc')}</p>
          </div>
        </div>
      </section> */}

      {/* <SectionDivider /> */}

      {/* ───── STATS COUNTER ───── */}
      {/* <section className="stats-section reveal-section" ref={statsRef}>
        <AnimatedCounter end={22} label={t('stats.crops', 'Crop Varieties')} suffix="+" />
        <AnimatedCounter end={7} label={t('stats.fertilizers', 'Fertilizer Types')} />
        <AnimatedCounter end={10000} label={t('stats.farmers', 'Farmers Helped')} suffix="+" />
        <AnimatedCounter end={95} label={t('stats.accuracy', 'Accuracy Rate')} suffix="%" />
      </section> */}

      {/* <SectionDivider /> */}
       <div className="footer-divider"></div>

      {/* ───── MANDI PRICES ───── */}
      <section className="reveal-section" ref={mandiRef} id="mandi-section">
        <MandiFilter />
      </section>

      <div className="footer-divider"></div>

      {/* ───── WEATHER ───── */}
      <section className="weather-section-home reveal-section" ref={weatherRef} id="weather-section">
        <div className="section-header">
          {/* <span className="section-icon">🌍</span> */}
          <h2>{t('weather.liveConditions', 'Live Weather Conditions')}</h2>
          <p>{t('weather.liveDesc', 'Real‑time weather data to help you plan your farming activities')}</p>
        </div>
        <WeatherCard title={t('weather.liveConditions', 'Current Weather')} showInsight={true} />
      </section>

      
      <div className="footer-divider"></div>

      {/* ───── CROP SEASONS ───── */}
      <section className="season-section reveal-section" ref={seasonRef}>
        <div className="section-header">
          {/* <span className="section-icon">🌱</span> */}
          <h2>Understanding Crop Seasons in India</h2>
          <p>Choose the right crop based on the season for optimal yield</p>
        </div>

        <div className="season-grid">
          <div className={`season-card kharif ${season.name === "Kharif" ? "season-active" : ""}`}>
            <div className="card-icon">🌧️</div>
            <h3>{t('season.kharif', 'Kharif Crops')}</h3>
            <div className="season-month">{t('season.kharifMonth', 'June – October')}</div>
            {season.name === "Kharif" && <div className="current-season-tag">📌 {t('season.currentTag', 'Current Season')}</div>}
            <p>
              {t('season.kharifDesc', 'Grown during monsoon season. Requires high rainfall and warm climate.')}
              <br />
              <strong>{t('season.examples', 'Examples:')}</strong> Rice, Maize, Cotton, Soybean, Sugarcane
            </p>
            <div className="card-footer">Best for rainy regions</div>
          </div>

          <div className={`season-card rabi ${season.name === "Rabi" ? "season-active" : ""}`}>
            <div className="card-icon">❄️</div>
            <h3>{t('season.rabi', 'Rabi Crops')}</h3>
            <div className="season-month">{t('season.rabiMonth', 'October – March')}</div>
            {season.name === "Rabi" && <div className="current-season-tag">📌 {t('season.currentTag', 'Current Season')}</div>}
            <p>
              {t('season.rabiDesc', 'Grown during winter season. Requires cool climate for growth.')}
              <br />
              <strong>{t('season.examples', 'Examples:')}</strong> Wheat, Mustard, Barley, Peas, Gram
            </p>
            <div className="card-footer">Ideal for winter cultivation</div>
          </div>

          <div className={`season-card zaid ${season.name === "Zaid" ? "season-active" : ""}`}>
            <div className="card-icon">☀️</div>
            <h3>{t('season.zaid', 'Zaid Crops')}</h3>
            <div className="season-month">{t('season.zaidMonth', 'March – June')}</div>
            {season.name === "Zaid" && <div className="current-season-tag">📌 {t('season.currentTag', 'Current Season')}</div>}
            <p>
              {t('season.zaidDesc', 'Grown during summer season. Requires warm, dry weather.')}
              <br />
              <strong>{t('season.examples', 'Examples:')}</strong> Watermelon, Cucumber, Muskmelon, Bitter Gourd
            </p>
            <div className="card-footer">Short duration crops</div>
          </div>
        </div>

        <div className="season-tip">
          <span className="tip-icon">💡</span>
          <p>Our AI considers these seasonal patterns to provide the most accurate crop recommendations for your location.</p>
        </div>
      </section>

       <div className="footer-divider"></div>

      {/* ───── CROP CALENDAR ───── */}
      <section className="reveal-section" ref={calendarRef}>
        <CropCalendar />
      </section>

       <div className="footer-divider"></div>

      {/* ───── GET IN TOUCH ───── */}
      <section className="reveal-section" ref={contactRef}>
        <ContactSection />
      </section>

      <Footer />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// MODEL LOADER
// ═══════════════════════════════════════════════════════
export function ModelLoader() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      MODEL_PATH,
      (gltf) => {
        setModel(gltf);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("❌ Failed to load 3D model:", error);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md">
          <HashLoader
            color="#22c55e"
            cssOverride={{ margin: "20% auto", display: "block" }}
            size={80}
          />
        </Container>
      </>
    );
  }

  if (!model) {
    return (
      <>
        <Header />
        <div className="model-fallback">
          <h2>Failed to load 3D model</h2>
          <p>But you can still use our AI recommendations!</p>
          <button className="btn-primary" onClick={() => (window.location.href = "/crop")}>
            Get Started
          </button>
        </div>
      </>
    );
  }

  return (
    <HomePage>
      <Background3D model={model} />
    </HomePage>
  );
}