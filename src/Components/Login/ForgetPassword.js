import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';

export const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [Otp, setOtp] = useState('');
  const [newpassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email'); // email, otp, or password
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = () => {
    if (!email) {
      setError('Email is required.');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return false;
    }
    setError('');
    return true;
  };

  const validateOtp = () => {
    if (!Otp) {
      setError('OTP is required.');
      return false;
    } else if (Otp.length !== 6 || isNaN(Otp)) {
      setError('OTP must be a 6-digit number.');
      return false;
    }
    setError('');
    return true;
  };

  const validatePasswords = () => {
    if (!newpassword || !confirmPassword) {
      setError('Both password fields are required.');
      return false;
    } else if (newpassword !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    } else if (newpassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      const body = { email };
      const result = await postData(base.forgetPassword, body);
      if (result.status) {
        setSuccessMessage(result.message);
        setStep('otp'); // Move to OTP verification step
      } else {
        setError(result.message || 'Failed to send OTP. Try again.');
      }
    } catch (error) {
      console.error('Error in forget password:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    try {
      const body = { email, Otp };
      const result = await postData(base.verifyOtp, body); // Endpoint for OTP verification
      if (result.status) {
        setSuccessMessage('OTP verified successfully. Proceed to set a new password.');
        setStep('password'); // Move to password reset step
      } else {
        setError(result.message || 'Invalid OTP. Try again.');
      }
    } catch (error) {
      console.error('Error in OTP verification:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      const body = { email, newpassword };
      const result = await postData(base.setPassword, body); // Endpoint for resetting the password
      if (result.status) {
        setSuccessMessage('Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(result.message || 'Failed to reset password. Try again.');
      }
    } catch (error) {
      console.error('Error in password reset:', error);
      setError('An error occurred. Please try again.');
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
            <div className="music-logo-wrapper">
              <img 
                className="music-login-logo" 
                title="TunePlus" 
                src={require('../../assets/images/logo.png')} 
                alt="TunePlus Logo" 
              />
            </div>
            <h1 className="music-login-title">Reset Password</h1>
            <p className="music-login-subtitle">
              {step === 'email' && 'Enter your email to receive OTP'}
              {step === 'otp' && 'Enter the OTP sent to your email'}
              {step === 'password' && 'Create a new password for your account'}
            </p>
          </div>

          <div className="music-login-body">
            {error && (
              <div className="music-alert music-alert-error">
                <span className="music-alert-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="music-alert music-alert-success">
                <span className="music-alert-icon">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="music-login-form">
                <div className="music-form-group">
                  <label htmlFor="email" className="music-form-label">
                    <span className="music-icon">✉</span>
                    Email Address
                  </label>
                      <input
                        type="text"
                    className={`music-form-input ${error && error.includes('email') ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                <div className="music-form-actions">
                  <button 
                    className="music-btn-secondary" 
                    type="button" 
                    onClick={() => navigate('/')}
                  >
                          Back to Login
                        </button>
                  <button className="music-login-btn" type="submit">
                    <span className="music-btn-icon">✉</span>
                    Send OTP
                  </button>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="music-login-form">
                <div className="music-form-group">
                  <label htmlFor="otp" className="music-form-label">
                    <span className="music-icon">🔑</span>
                    Enter OTP
                  </label>
                      <input
                        type="text"
                    className={`music-form-input ${error && error.includes('OTP') ? 'error' : ''}`}
                    placeholder="Enter 6-digit OTP"
                    id="otp"
                        value={Otp}
                        onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                      />
                  <p className="music-hint">Check your email for the 6-digit OTP code</p>
                    </div>
                <div className="music-form-actions">
                  <button 
                    className="music-btn-secondary" 
                    type="button" 
                    onClick={() => setStep('email')}
                  >
                    Resend OTP
                  </button>
                  <button className="music-login-btn" type="submit">
                    <span className="music-btn-icon">✓</span>
                          Verify OTP
                        </button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="music-login-form">
                <div className="music-form-group">
                  <label htmlFor="newpassword" className="music-form-label">
                    <span className="music-icon">🔒</span>
                    New Password
                  </label>
                      <input
                        type="password"
                    className={`music-form-input ${error && error.includes('password') ? 'error' : ''}`}
                    placeholder="Enter new password"
                    id="newpassword"
                        value={newpassword}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                <div className="music-form-group">
                  <label htmlFor="confirmPassword" className="music-form-label">
                    <span className="music-icon">🔒</span>
                    Confirm Password
                  </label>
                      <input
                        type="password"
                    className={`music-form-input ${error && error.includes('match') ? 'error' : ''}`}
                    placeholder="Confirm new password"
                    id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                <div className="music-form-actions">
                  <button 
                    className="music-btn-secondary" 
                    type="button" 
                    onClick={() => setStep('otp')}
                  >
                    Back
                  </button>
                  <button className="music-login-btn" type="submit">
                    <span className="music-btn-icon">♪</span>
                          Reset Password
                        </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
