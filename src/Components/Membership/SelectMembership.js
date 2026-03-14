import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import Swal from 'sweetalert2';
import '../Common/RoleSpecificStyles.css';

const SelectMembership = () => {
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(null);

  useEffect(() => {
    // Get pending login data from localStorage
    const pendingLoginData = localStorage.getItem('pendingLogin');
    if (pendingLoginData) {
      try {
        setPendingLogin(JSON.parse(pendingLoginData));
      } catch (e) {
        console.error('Error parsing pending login:', e);
      }
    } else {
      // If no pending login, redirect to login page
      Swal.fire({
        icon: 'warning',
        title: 'No Login Session',
        text: 'Please login first to select a membership plan.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/Login');
      });
    }

    // Fetch active memberships
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setIsLoading(true);
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
        confirmButtonText: 'Retry'
      }).then(() => {
        fetchMemberships();
      });
    } finally {
      setIsLoading(false);
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

    if (!pendingLogin) {
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your login session has expired. Please login again.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        localStorage.removeItem('pendingLogin');
        navigate('/Login');
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get user ID from pending login data (check multiple possible locations)
      const userId = pendingLogin.userId || 
                     pendingLogin.loginData?.userId || 
                     pendingLogin.loginData?.profile?._id || 
                     pendingLogin.loginData?._id;

      if (!userId) {
        console.error('Pending login data:', pendingLogin);
        throw new Error('User ID not found in login data. Please login again.');
      }

      // Create payment order
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

      if (paymentResult?.data?.status === true && paymentResult?.data?.data) {
        const paymentData = paymentResult.data.data;
        const paymentSessionId = paymentData.paymentSessionId;
        const orderId = paymentData.orderId;
        const paymentUrl = paymentData.paymentUrl || 
                         paymentData.payment_url || 
                         paymentData.paymentLink ||
                         paymentData.payment_link;

        if (!paymentSessionId) {
          throw new Error('Payment session ID not received');
        }

        // Store order ID and user info for after payment
        localStorage.setItem('pendingMembershipPayment', JSON.stringify({
          orderId: orderId,
          membershipId: selectedMembershipId,
          userId: userId,
          pendingLogin: pendingLogin
        }));

        // Close SweetAlert
        Swal.close();

        // Redirect to payment gateway
        if (paymentUrl && (paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://'))) {
          window.location.href = paymentUrl;
        } else {
          // Fallback: Use Cashfree SDK if available
          if (window.Cashfree) {
            const cashfree = window.Cashfree({
              mode: process.env.REACT_APP_CASHFREE_SDK_MODE || "production"
            });
            cashfree.checkout({
              paymentSessionId: paymentSessionId,
              redirectTarget: "_self"
            });
          } else {
            throw new Error('Payment URL not available');
          }
        }
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
      setIsProcessing(false);
    }
  };

  const selectedMembership = memberships.find(m => (m._id || m.id) === selectedMembershipId);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', marginBottom: '1rem' }}>
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{ fontSize: '1.2rem' }}>Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '50px 40px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: 'bold' }}>
            Select Membership Plan
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Choose a membership plan to continue accessing your account
          </p>
        </div>

        {/* Membership Plans */}
        <div style={{ padding: '40px' }}>
          {memberships.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>No membership plans available at the moment.</p>
              <button 
                onClick={fetchMemberships}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
              }}>
                {memberships.map((membership) => {
                  const isSelected = (membership._id || membership.id) === selectedMembershipId;
                  return (
                    <div
                      key={membership._id || membership.id}
                      onClick={() => handleMembershipSelect(membership._id || membership.id)}
                      style={{
                        border: isSelected ? '3px solid #667eea' : '2px solid #e0e0e0',
                        borderRadius: '16px',
                        padding: '30px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        background: isSelected ? '#f0f4ff' : 'white',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isSelected ? '0 10px 30px rgba(102, 126, 234, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#333' }}>
                          {membership.name}
                        </h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
                          ₹{membership.price}
                        </div>
                        <div style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
                          {membership.duration} {membership.durationType || 'months'}
                        </div>
                        {membership.description && (
                          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                            {membership.description}
                          </p>
                        )}
                        {isSelected && (
                          <div style={{
                            marginTop: '20px',
                            padding: '10px',
                            background: '#667eea',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                          }}>
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Proceed Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || !selectedMembershipId}
                  style={{
                    padding: '15px 40px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: isProcessing || !selectedMembershipId ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isProcessing || !selectedMembershipId ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s'
                  }}
                >
                  {isProcessing ? 'Processing...' : `Proceed to Payment - ₹${selectedMembership?.price || 0}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectMembership;

