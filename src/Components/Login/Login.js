import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import LoginController from '../../Controllers/Login-controller/LoginController';
import '../Common/RoleSpecificStyles.css';
export const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, email, setEmail, password, setPassword, isLoading } = LoginController();
  const [errors, setErrors] = useState({ email: '', password: '' });
  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSubmit(e); // Call your login handler
    }
  };
  return (
    <div className="music-login-page">
      {/* Animated Background Elements */}
      <div className="music-bg-animation">
        <div className="sound-wave wave1"></div>
        <div className="sound-wave wave2"></div>
        <div className="sound-wave wave3"></div>
        <div className="sound-wave wave4"></div>
        <div className="sound-wave wave5"></div>
      </div>
      
      {/* Floating Music Notes */}
      <div className="music-notes">
        <div className="music-note note1">♪</div>
        <div className="music-note note2">♫</div>
        <div className="music-note note3">♪</div>
        <div className="music-note note4">♫</div>
      </div>

      <div className="music-login-container">
        <div className="music-login-card">
          <div className="music-login-header">
            <h1 className="music-login-title">Welcome to TunePlus</h1>
            <p className="music-login-subtitle">Your music journey starts here</p>
          </div>

          <div className="music-login-body">
            <form id="dataform" onSubmit={onSubmit} className="music-login-form">
              <div className="music-form-group">
                <label htmlFor="email" className="music-form-label">
                  <span className="music-icon">✉</span>
                  Email Address
                </label>
                  <input
                    type="text"
                  className={`music-form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                {errors.email && (
                  <span className="music-error-message">{errors.email}</span>
                )}
                </div>

              <div className="music-form-group">
                <label htmlFor="password" className="music-form-label">
                  <span className="music-icon">🔒</span>
                  Password
                </label>
                  <input
                    type="password"
                  className={`music-form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                {errors.password && (
                  <span className="music-error-message">{errors.password}</span>
                    )}
                  </div>

              <div className="music-form-footer">
                <Link to="/forgetpassword" className="music-forget-link">
                  Forgot Password?
                </Link>
                  </div>

              <button 
                className="music-login-btn" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="music-btn-loader"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="music-btn-icon">♪</span>
                    Sign In to Your Music
                  </>
                )}
              </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};