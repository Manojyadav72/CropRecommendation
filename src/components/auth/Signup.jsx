import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 👁 show/hide states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email && !phone) {
      return setError("Please enter either Email or Phone Number");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful ✅");
        navigate("/login");
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ❌ Close */}
        <button className="close-button" onClick={() => navigate("/")}>
          &times;
        </button>

        <h2>🌾 KrishiDisha Signup</h2>
        <p>Create your account</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder={t('profile.enterName', 'Enter Name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder={t('auth.enterEmail', 'Enter Email (Optional if Phone entered)')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder={t('auth.enterPhone', 'Enter Phone Number (Optional if Email entered)')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Password */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.enterPassword', 'Enter Password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {/* Confirm Password */}
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('auth.enterPassword', 'Confirm Password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          {/* Submit */}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : t('auth.signup', "Signup")}
          </button>
        </form>

        <p className="switch">
          Already have an account?
          <span onClick={() => navigate("/login")}>
            {t('auth.haveAccount', 'Login here')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;