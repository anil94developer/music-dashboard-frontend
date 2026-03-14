import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import LoginController from '../../Controllers/Login-controller/LoginController';
import { getData, postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import Swal from 'sweetalert2';
import '../Common/RoleSpecificStyles.css';

export const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, email, setEmail, password, setPassword, isLoading } = LoginController();
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showMembershipPlans, setShowMembershipPlans] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState(null);
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
  useEffect(() => {
    // Load Cashfree SDK
    if (!window.Cashfree) {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.onload = () => {
        console.log('Cashfree SDK loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Cashfree SDK');
      };
      document.body.appendChild(script);
    }
    
    // Check if there's pending login (membership required) - but don't show plans automatically
    // Plans will be shown in popup when membership is required
    const pendingLogin = localStorage.getItem('pendingLogin');
    if (pendingLogin) {
      try {
        const loginData = JSON.parse(pendingLogin);
        setPendingLoginData(loginData);
        // Don't automatically show plans - wait for popup trigger
        // setShowMembershipPlans(true);
        // fetchMemberships();
      } catch (e) {
        console.error('Error parsing pending login:', e);
      }
    }
    
    // Listen for membership required event
    const handleMembershipRequired = () => {
      const pendingLogin = localStorage.getItem('pendingLogin');
      if (pendingLogin) {
        try {
          const loginData = JSON.parse(pendingLogin);
          setPendingLoginData(loginData);
          setShowMembershipPlans(true);
          fetchMemberships();
        } catch (e) {
          console.error('Error parsing pending login:', e);
        }
      }
    };
    
    window.addEventListener('membershipRequired', handleMembershipRequired);
    
    return () => {
      window.removeEventListener('membershipRequired', handleMembershipRequired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMemberships = async () => {
    try {
      setIsLoadingPlans(true);
      const result = await getData(base.activeMemberships);
      console.log('Memberships result:', result);

      let membershipsList = [];
      if (result?.data?.status === true && Array.isArray(result.data.data)) {
        membershipsList = result.data.data;
      } else if (Array.isArray(result?.data)) {
        membershipsList = result.data;
      } else if (Array.isArray(result)) {
        membershipsList = result;
      }

      setMemberships(membershipsList);
      
      // Auto-select first membership if available
      if (membershipsList.length > 0 && !selectedMembershipId) {
        const firstMembership = membershipsList[0];
        setSelectedMembershipId(firstMembership._id || firstMembership.id);
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load membership plans. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleMembershipSelect = (membershipId) => {
    setSelectedMembershipId(membershipId);
  };

  const handleProceedToPayment = async () => {
    if (!selectedMembershipId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Membership',
        text: 'Please select a membership plan to continue.',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!pendingLoginData) {
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your login session has expired. Please login again.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        localStorage.removeItem('pendingLogin');
        setShowMembershipPlans(false);
        setPendingLoginData(null);
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      const userId = pendingLoginData.userId || 
                     pendingLoginData.loginData?.userId || 
                     pendingLoginData.loginData?.profile?._id || 
                     pendingLoginData.loginData?._id;

      if (!userId) {
        throw new Error('User ID not found in login data');
      }

      const paymentOrderBody = {
        userId: userId,
        membershipId: selectedMembershipId,
        amount: memberships.find(m => (m._id || m.id) === selectedMembershipId)?.price || 0
      };

      console.log('Creating payment order:', paymentOrderBody);

      Swal.fire({
        icon: 'info',
        title: 'Processing Payment...',
        text: 'Please wait while we redirect you to the payment gateway.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const paymentResult = await postData(base.createPaymentOrder, paymentOrderBody);
      console.log('Payment order result:', paymentResult);
      console.log('Payment result structure:', {
        hasData: !!paymentResult?.data,
        hasStatus: !!paymentResult?.data?.status,
        status: paymentResult?.data?.status,
        hasDataData: !!paymentResult?.data?.data,
        dataKeys: paymentResult?.data?.data ? Object.keys(paymentResult.data.data) : []
      });

      if (paymentResult?.data?.status === true && paymentResult?.data?.data) {
        const paymentData = paymentResult.data.data;
        const paymentSessionId = paymentData.paymentSessionId || 
                                paymentData.payment_session_id ||
                                paymentData.sessionId ||
                                paymentData.session_id;
        const orderId = paymentData.orderId || paymentData.order_id;
        const paymentUrl = paymentData.paymentUrl || 
                         paymentData.payment_url || 
                         paymentData.paymentLink ||
                         paymentData.payment_link ||
                         paymentData.url;

        console.log('Extracted payment data:', {
          paymentSessionId,
          orderId,
          paymentUrl,
          allKeys: Object.keys(paymentData)
        });

        if (!paymentSessionId) {
          console.error('Payment session ID missing. Available keys:', Object.keys(paymentData));
          throw new Error('Payment session ID not received from server. Please try again.');
        }

        localStorage.setItem('pendingMembershipPayment', JSON.stringify({
          orderId: orderId,
          membershipId: selectedMembershipId,
          userId: userId,
          pendingLogin: pendingLoginData
        }));

        console.log('Payment data:', {
          paymentSessionId,
          orderId,
          paymentUrl,
          cashfreeAvailable: typeof window.Cashfree !== 'undefined'
        });

        // Close SweetAlert before redirect
        Swal.close();

        // Wait a bit for SweetAlert to close completely
        setTimeout(() => {
          // Priority 1: Use payment URL from backend if available
          if (paymentUrl && (paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://'))) {
            console.log('Redirecting using payment URL from backend:', paymentUrl);
            window.location.href = paymentUrl;
          } 
          // Priority 2: Use Cashfree SDK if available
          else if (window.Cashfree && typeof window.Cashfree === 'function') {
            console.log('Using Cashfree SDK for redirect');
            try {
              const cashfree = window.Cashfree({
                mode: process.env.REACT_APP_CASHFREE_SDK_MODE || "production"
              });
              cashfree.checkout({
                paymentSessionId: paymentSessionId,
                redirectTarget: "_self",
                platformName: "custom"
              });
            } catch (sdkError) {
              console.error('Cashfree SDK error:', sdkError);
              // Fallback to constructed URL
              const fallbackUrl = `https://payments.cashfree.com/forms/v2/${paymentSessionId}`;
              console.log('SDK failed, using fallback URL:', fallbackUrl);
              window.location.href = fallbackUrl;
            }
          } 
          // Priority 3: Construct payment URL from session ID
          else if (paymentSessionId) {
            const constructedUrl = `https://payments.cashfree.com/forms/v2/${paymentSessionId}`;
            console.log('Using constructed payment URL:', constructedUrl);
            window.location.href = constructedUrl;
          } 
          else {
            throw new Error('Payment URL or session ID not available');
          }
        }, 300);
      } else {
        throw new Error(paymentResult?.data?.message || paymentResult?.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: error.message || 'Failed to process payment. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Clear any existing pending login before new login attempt
      localStorage.removeItem('pendingLogin');
      setShowMembershipPlans(false);
      setPendingLoginData(null);
      handleSubmit(e);
    }
  };

  const selectedMembership = memberships.find(m => (m._id || m.id) === selectedMembershipId);

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

      {/* Membership Plans Popup/Modal - Show when membership required */}
      {showMembershipPlans && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }} onClick={() => {
          // Don't close on background click - user must select a plan
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => {
                setShowMembershipPlans(false);
                localStorage.removeItem('pendingLogin');
                setPendingLoginData(null);
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                zIndex: 10001
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '20px 20px 0 0'
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                Membership Required
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Please select a membership plan to continue accessing your account
              </p>
            </div>

            {/* Plans Content */}
            <div style={{ padding: '40px' }}>
              {isLoadingPlans ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p style={{ marginTop: '15px', color: '#666' }}>Loading membership plans...</p>
                </div>
              ) : memberships.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: '#666' }}>No membership plans available at the moment.</p>
                  <button 
                    onClick={fetchMemberships}
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '30px'
                  }}>
                    {memberships.map((membership) => {
                      const isSelected = (membership._id || membership.id) === selectedMembershipId;
                      return (
                        <div
                          key={membership._id || membership.id}
                          onClick={() => handleMembershipSelect(membership._id || membership.id)}
                          style={{
                            border: isSelected ? '3px solid #667eea' : '2px solid #e0e0e0',
                            borderRadius: '12px',
                            padding: '25px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            background: isSelected ? '#f0f4ff' : 'white',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isSelected ? '0 8px 20px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                          }}
                        >
                          <div style={{ textAlign: 'center', flexGrow: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#333', fontWeight: 'bold' }}>
                              {membership.name}
                            </h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
                              ₹{membership.price}
                            </div>
                            <div style={{ fontSize: '1rem', color: '#000', marginBottom: '20px', fontWeight: '500' }}>
                              {membership.duration} {membership.durationType || 'months'}
                            </div>
                            
                            {/* Full Description */}
                            {membership.description && (
                              <div style={{ 
                                textAlign: 'left', 
                                marginBottom: '20px',
                                padding: '15px',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0'
                              }}>
                                <span style={{ 
                                  fontSize: '0.95rem', 
                                  color: '#000', 
                                  lineHeight: '1.6',
                                  margin: 0,
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  display: 'block'
                                }}>
                                  {membership.description}
                                </span>
                              </div>
                            )}
                            
                            {/* Features List */}
                            {membership.features && Array.isArray(membership.features) && membership.features.length > 0 && (
                              <div style={{ 
                                textAlign: 'left', 
                                marginBottom: '20px',
                                padding: '15px',
                                background: '#f8f9fa',
                                borderRadius: '8px'
                              }}>
                                <h4 style={{ 
                                  fontSize: '1rem', 
                                  fontWeight: 'bold', 
                                  color: '#333', 
                                  marginBottom: '10px',
                                  textAlign: 'center'
                                }}>
                                  Features:
                                </h4>
                                <ul style={{ 
                                  listStyle: 'none', 
                                  padding: 0, 
                                  margin: 0,
                                  fontSize: '0.9rem',
                                  color: '#555'
                                }}>
                                  {membership.features.map((feature, idx) => (
                                    <li key={idx} style={{ 
                                      marginBottom: '8px',
                                      paddingLeft: '20px',
                                      position: 'relative'
                                    }}>
                                      <span style={{
                                        position: 'absolute',
                                        left: '0',
                                        color: '#667eea',
                                        fontWeight: 'bold'
                                      }}>✓</span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Additional Info */}
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-around', 
                              marginTop: '15px',
                              padding: '10px',
                              background: '#f0f4ff',
                              borderRadius: '8px',
                              fontSize: '0.85rem'
                            }}>
                              {membership.noOfLabels !== undefined && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontWeight: 'bold', color: '#667eea' }}>{membership.noOfLabels}</div>
                                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Labels</div>
                                </div>
                              )}
                              {membership.noOfArtists !== undefined && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontWeight: 'bold', color: '#667eea' }}>{membership.noOfArtists}</div>
                                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Artists</div>
                                </div>
                              )}
                              {membership.maxUsers !== undefined && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontWeight: 'bold', color: '#667eea' }}>{membership.maxUsers}</div>
                                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Users</div>
                                </div>
                              )}
                            </div>
                            
                            {isSelected && (
                              <div style={{
                                marginTop: '20px',
                                padding: '10px',
                                background: '#667eea',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                              }}>
                                ✓ Selected
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={handleProceedToPayment}
                      disabled={isProcessingPayment || !selectedMembershipId}
                      style={{
                        padding: '15px 40px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: isProcessingPayment || !selectedMembershipId ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isProcessingPayment || !selectedMembershipId ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s'
                      }}
                    >
                      {isProcessingPayment ? 'Processing...' : `Proceed to Payment - ₹${selectedMembership?.price || 0}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};