import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.token) {
        // ✅ SAVE EVERYTHING
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        setError(data.msg || "Invalid email/phone or password");
      }

    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };





  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ❌ Close Button */}
        <button
          type="button"
          className="close-button"
          onClick={() => navigate("/")}
        >
          &times;
        </button>
        <h2>🌾 KrishiDisha Login</h2>
        <p>Welcome back!</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder={t('auth.enterEmailOrPhone', 'Enter Email or Phone Number')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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



          {error && <p className="error">{error}</p>}

          <button type="submit">{t('auth.login', 'Login')}</button>
        </form>



        <p className="switch">
           Don't have an account?
          <span onClick={() => navigate("/signup")}>
            {t('auth.noAccount', "Signup here")}
          </span>
        </p>
      </div>


    </div>
  );
};

export default Login;