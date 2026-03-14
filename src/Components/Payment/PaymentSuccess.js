import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postData, getData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import { useUserProfile } from '../../Context/UserProfileContext';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUserProfile } = useUserProfile();
  const [status, setStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      verifyPaymentAndCompleteLogin(orderId);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Payment',
        text: 'No order ID found. Please contact support.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/Login');
      });
    }
  }, []);

  const verifyPaymentAndCompleteLogin = async (orderId) => {
    try {
      setStatus('verifying');
      
      // Check for pending membership payment
      const pendingPayment = localStorage.getItem('pendingMembershipPayment');
      let pendingLogin = null;
      
      if (pendingPayment) {
        try {
          const paymentInfo = JSON.parse(pendingPayment);
          pendingLogin = paymentInfo.pendingLogin;
          
          // Verify payment status
          const verifyResult = await getData(`${base.verifyPayment}?orderId=${orderId}`);
          console.log('Payment verification result:', verifyResult);
          
          if (verifyResult?.data?.status === true && verifyResult?.data?.data?.status === 'SUCCESS') {
            // Payment successful
            setStatus('success');
            setPaymentData(verifyResult.data.data);
            
            // Complete login if pending login exists
            if (pendingLogin && pendingLogin.email && pendingLogin.password) {
              await completeLogin(pendingLogin);
            } else {
              // No pending login, just show success
              Swal.fire({
                icon: 'success',
                title: 'Payment Successful!',
                text: 'Your membership has been activated. You can now login.',
                confirmButtonText: 'Go to Login'
              }).then(() => {
                localStorage.removeItem('pendingMembershipPayment');
                localStorage.removeItem('pendingLogin');
                navigate('/Login');
              });
            }
          } else {
            // Payment not successful
            setStatus('failed');
            Swal.fire({
              icon: 'error',
              title: 'Payment Failed',
              text: 'Your payment could not be verified. Please contact support.',
              confirmButtonText: 'OK'
            });
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          setStatus('error');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while processing your payment. Please contact support.',
            confirmButtonText: 'OK'
          });
        }
      } else {
        // No pending payment info - might be a regular registration
        // Just verify payment and show success
        const verifyResult = await getData(`${base.verifyPayment}?orderId=${orderId}`);
        if (verifyResult?.data?.status === true && verifyResult?.data?.data?.status === 'SUCCESS') {
          setStatus('success');
          setPaymentData(verifyResult.data.data);
        } else {
          setStatus('failed');
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('error');
      Swal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: 'Unable to verify payment status. Please contact support.',
        confirmButtonText: 'OK'
      });
    }
  };

  const completeLogin = async (pendingLogin) => {
    try {
      // Login with stored credentials
      const loginBody = {
        email: pendingLogin.email,
        password: pendingLogin.password
      };

      const loginResult = await postData(base.login, loginBody);
      
      if (loginResult?.data?.status === true) {
        const loginData = loginResult.data.data;
        
        // Store login data
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("userData", typeof loginData === 'string' ? loginData : JSON.stringify(loginData));
        
        // Set user profile
        setUserProfile(loginData);
        
        // Clear pending data
        localStorage.removeItem('pendingMembershipPayment');
        localStorage.removeItem('pendingLogin');
        
        // Show success and redirect
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'Your membership has been activated and you have been logged in.',
          confirmButtonText: 'Go to Dashboard',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          window.location.href = "/Dashboard";
        });
      } else {
        throw new Error(loginResult?.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error completing login:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Payment Successful',
        text: 'Your membership has been activated. However, automatic login failed. Please login manually.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        localStorage.removeItem('pendingMembershipPayment');
        localStorage.removeItem('pendingLogin');
        navigate('/Login');
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#f59e0b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px',
              color: 'white'
            }}>
              ⏳
            </div>
            <h1 style={{ color: '#f59e0b', marginBottom: '15px' }}>Verifying Payment...</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Please wait while we verify your payment status.
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px',
              color: 'white'
            }}>
              ✓
            </div>
            <h1 style={{ color: '#22c55e', marginBottom: '15px' }}>Payment Successful!</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Your membership has been activated successfully.
            </p>
            {paymentData && (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f4ff', borderRadius: '10px' }}>
                <p style={{ margin: '5px 0' }}><strong>Order ID:</strong> {paymentData.orderId || 'N/A'}</p>
                <p style={{ margin: '5px 0' }}><strong>Amount:</strong> ₹{paymentData.amount || 'N/A'}</p>
              </div>
            )}
            <div style={{ marginTop: '30px' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>
                Redirecting to dashboard...
              </p>
            </div>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px',
              color: 'white'
            }}>
              ✗
            </div>
            <h1 style={{ color: '#ef4444', marginBottom: '15px' }}>Payment Failed</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Your payment could not be verified. Please contact support.
            </p>
            <button
              onClick={() => navigate('/Login')}
              style={{
                padding: '12px 30px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Go to Login
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '50px',
              color: 'white'
            }}>
              ⚠
            </div>
            <h1 style={{ color: '#ef4444', marginBottom: '15px' }}>Error</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              An error occurred while processing your payment. Please contact support.
            </p>
            <button
              onClick={() => navigate('/Login')}
              style={{
                padding: '12px 30px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

