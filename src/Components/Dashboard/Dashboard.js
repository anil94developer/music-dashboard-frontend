import React, { useEffect, useState } from 'react'
import { base } from '../../Constants/Data.constant';
import { useUserProfile } from '../../Context/UserProfileContext';
import useDashboardController from '../../Controllers/Dashboard-Controller/useDashboardController';
import { getData, postData } from '../../Services/Ops';
import MarketGraph from '../Common/Chart/MarketGraph';
import SimpleGraph from '../Common/Chart/SimpleGraph';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import '../Common/RoleSpecificStyles.css'
export const Dashboard = () => {
  const { dashboardData } = useDashboardController();
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();

  const [marketList, setMarketList] = useState([])
  const [overviewDataList, setOverviewDataList] = useState([])
  const [currentMembership, setCurrentMembership] = useState(null);
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);
  const [showPlansPopup, setShowPlansPopup] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  useEffect(() => {
    getOverView({});
    // Company ke liye current membership fetch karo
    if (userProfile?.role === "company" && userProfile?._id) {
      fetchCurrentMembership(userProfile._id);
    }
  }, [])
  // const getMarket = async () => {
  //   let result = await getData(base.getMarket)
  //   console.log(result)
  //   if (result?.status) {
  //     let arr = []
  //     result.data?.map((item, index) => {
  //       arr.push({ x: index, label: item.Market, y: item.Quantity })
  //     })
  //     setMarketList(arr);
  //   }
  // }


  const getOverView = async (query) => {
    let result = await getData(base.getOverViewReport + `?${query}`)
    console.log("result stream-------", result)
    if (result?.status) {
        let arr = []
        result.data?.map((item, index) => {
            arr.push({ x: index, label: item.Date, y: item.Earnings_GBP, Excel: item.Excel })
        })
        setOverviewDataList(arr);
    } else {
      setOverviewDataList([]);

    }
}

  const fetchCurrentMembership = async (userId) => {
    try {
      setIsLoadingMembership(true);
      const result = await getData(`${base.userMemberships || 'admin/user-memberships'}?userId=${userId}`);
      if (result?.data?.status === true && result?.data?.data) {
        setCurrentMembership(result.data.data.activeMembership || null);
      } else if (result?.status === true && result?.data) {
        setCurrentMembership(result.data.activeMembership || null);
      } else {
        setCurrentMembership(null);
      }
    } catch (error) {
      console.error("Error fetching current membership:", error);
      setCurrentMembership(null);
    } finally {
      setIsLoadingMembership(false);
    }
  };

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const result = await getData(base.activeMemberships);
      let list = [];
      if (result?.data?.status === true && Array.isArray(result.data.data)) list = result.data.data;
      else if (Array.isArray(result?.data)) list = result.data;
      else if (Array.isArray(result)) list = result;
      setMemberships(list);
      if (list.length > 0 && !selectedMembershipId) setSelectedMembershipId(list[0]._id || list[0].id);
    } catch (error) {
      console.error("Error fetching plans:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load plans.' });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const openPlansPopup = () => {
    setShowPlansPopup(true);
    setSelectedMembershipId('');
    fetchPlans();
  };

  const handleMembershipSelect = (id) => setSelectedMembershipId(id);

  const handleProceedToPayment = async () => {
    if (!selectedMembershipId) {
      Swal.fire({ icon: 'warning', title: 'Select a plan', text: 'Please select a membership plan.' });
      return;
    }
    const userId = userProfile?._id || userProfile?.userId;
    if (!userId) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'User not found. Please login again.' });
      return;
    }
    setIsProcessingPayment(true);
    try {
      const paymentOrderBody = {
        userId,
        membershipId: selectedMembershipId,
        amount: memberships.find(m => (m._id || m.id) === selectedMembershipId)?.price || 0
      };
      Swal.fire({ icon: 'info', title: 'Processing...', text: 'Redirecting to payment.', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
      const paymentResult = await postData(base.createPaymentOrder, paymentOrderBody);
      if (paymentResult?.data?.status === true && paymentResult?.data?.data) {
        const d = paymentResult.data.data;
        const paymentSessionId = d.paymentSessionId || d.payment_session_id || d.sessionId || d.session_id;
        const orderId = d.orderId || d.order_id;
        const paymentUrl = d.paymentUrl || d.payment_url || d.paymentLink || d.payment_link || d.url;
        if (!paymentSessionId) throw new Error('Payment session not received.');
        localStorage.setItem('pendingMembershipPayment', JSON.stringify({ orderId, membershipId: selectedMembershipId, userId }));
        Swal.close();
        if (paymentUrl && (paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://'))) {
          window.location.href = paymentUrl;
        } else if (window.Cashfree && typeof window.Cashfree === 'function') {
          const cashfree = window.Cashfree({ mode: process.env.REACT_APP_CASHFREE_SDK_MODE || 'production' });
          cashfree.checkout({ paymentSessionId, redirectTarget: '_self', platformName: 'custom' });
        } else {
          throw new Error('Payment URL not available.');
        }
      } else {
        throw new Error(paymentResult?.data?.message || paymentResult?.message || 'Payment failed.');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Payment failed. Try again.' });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  const go = (path) => () => navigate(path);

  return (
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-main">
          <section className="dash-main content">
            {userProfile?.role === "company" && (
              <div className="row mb-3">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="dash-detail company-dashboard-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <div className="inner">
                      <p>Current Plan</p>
                      {isLoadingMembership ? (
                        <h4>Loading...</h4>
                      ) : currentMembership ? (
                        <>
                          <h3>{currentMembership.membershipId?.name || currentMembership.membershipName || "N/A"}</h3>
                          <p style={{ marginTop: '8px', fontSize: '13px' }}>
                            Expires on{" "}
                            {currentMembership.expiryDate
                              ? new Date(currentMembership.expiryDate).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </>
                      ) : (
                        <h4>No Active Plan</h4>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={openPlansPopup}
                      style={{
                        marginTop: '12px',
                        padding: '10px 16px',
                        background: 'rgba(255,255,255,0.25)',
                        border: '2px solid rgba(255,255,255,0.8)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      View / Buy Plans
                    </button>
                  </div>
                </div>
              </div>
            )}
            {(userProfile?.role == "company" || userProfile?.role === "employee") &&
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div 
                    className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}
                    onClick={go("/All releases")}
                    role="button"
                    title="View all releases"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="inner">
                      <p>All Release</p>
                      <h3>{dashboardData?.myReleaseCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="All Release" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div 
                    className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}
                    onClick={go("/all tracks")}
                    role="button"
                    title="View all tracks"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="inner">
                      <p>All Tracks</p>
                      <h3>{dashboardData?.myTracksCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="All Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Total Tracks</p>
                      <h3>{dashboardData?.totalTracks || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Total Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Total Pending Tracks</p>
                      <h3>{dashboardData?.totalPendingTracks || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Pending Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Approve Content</p>
                      <h3>{dashboardData?.approveContent || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Approve Content" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className={`dash-detail d-flex flex-wrap ${userProfile?.role === "company" ? "company-dashboard-card" : "employee-dashboard-card"}`}>
                    <div className="inner">
                      <p>Reject Content</p>
                      <h3>{dashboardData?.rejectContent || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Reject Content" />
                    </div>
                  </div>
                </div>

              </div>
            }
            {userProfile?.role == "Admin" &&

              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div 
                    className="dash-detail d-flex flex-wrap admin-dashboard-card"
                    onClick={go("/All releases")}
                    role="button"
                    title="View all releases"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="inner">
                      <p>All Release</p>
                      <h3>{dashboardData?.myReleaseCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="All Release" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div 
                    className="dash-detail d-flex flex-wrap admin-dashboard-card"
                    onClick={go("/all tracks")}
                    role="button"
                    title="View all tracks"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="inner">
                      <p>All Tracks</p>
                      <h3>{dashboardData?.myTracksCount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="All Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Total Tracks</p>
                      <h3>{dashboardData?.totalTracks || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Total Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Total Pending Tracks</p>
                      <h3>{dashboardData?.totalPendingTracks || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Pending Tracks" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Approve Content</p>
                      <h3>{dashboardData?.approveContent || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Approve Content" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Reject Content</p>
                      <h3>{dashboardData?.rejectContent || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon2.png')} alt="Reject Content" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="dash-detail d-flex flex-wrap admin-dashboard-card">
                    <div className="inner">
                      <p>Master Account</p>
                      <h3>{dashboardData?.masterAccount || 0}</h3>
                    </div>
                    <div className="icon">
                      <img className="img-fluid" src={require('../../assets/images/dash-icon1.png')} alt="Master Account" />
                    </div>
                  </div>
                </div>
              </div>

            }
          </section>
          {userProfile?.role === "company" &&
            <section className="sale-graph" style={{ marginTop: '30px' }}>
              {overviewDataList.length > 0 ?
                <SimpleGraph data={overviewDataList} title={"Overview"} type={'column'} />
                :
                <div className="text-center" style={{ padding: '40px' }}>
                  <h2 style={{ color: '#4a90e2', marginBottom: '20px' }}>Market Data</h2>
                  <img className="img-fluid" title="Dashboard" src={require('../../assets/images/nodatafound.png')} alt="No Data Found" />
                </div>
              }
            </section>
          }
        </div>
      </div>

      {/* Membership Plans Popup */}
      {showPlansPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, padding: '20px'
          }}
          onClick={() => {}}
        >
          <div
            style={{
              background: 'white', borderRadius: '20px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPlansPopup(false)}
              style={{
                position: 'absolute', top: '15px', right: '15px', background: '#f0f0f0', border: 'none', borderRadius: '50%',
                width: '35px', height: '35px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', zIndex: 10001
              }}
            >
              ×
            </button>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px', textAlign: 'center', borderRadius: '20px 20px 0 0' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Membership Plans</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Select a plan to upgrade or renew</p>
            </div>
            <div style={{ padding: '40px' }}>
              {isLoadingPlans ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}><span className="sr-only">Loading...</span></div>
                  <p style={{ marginTop: '15px', color: '#666' }}>Loading plans...</p>
                </div>
              ) : memberships.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: '#666' }}>No plans available.</p>
                  <button onClick={fetchPlans} style={{ marginTop: '15px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Retry</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                    {memberships.map((m) => {
                      const isSelected = (m._id || m.id) === selectedMembershipId;
                      return (
                        <div
                          key={m._id || m.id}
                          onClick={() => handleMembershipSelect(m._id || m.id)}
                          style={{
                            border: isSelected ? '3px solid #667eea' : '2px solid #e0e0e0', borderRadius: '12px', padding: '25px', cursor: 'pointer',
                            background: isSelected ? '#f0f4ff' : 'white', transform: isSelected ? 'scale(1.02)' : 'scale(1)', boxShadow: isSelected ? '0 8px 20px rgba(102,126,234,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex', flexDirection: 'column', height: '100%'
                          }}
                        >
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#333' }}>{m.name}</h3>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>₹{m.price}</div>
                          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>{m.duration} {m.durationType || 'months'}</div>
                          {m.description && (
                            <div style={{ textAlign: 'left', marginBottom: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0', flexGrow: 1 }}>
                              <span style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block' }}>{m.description}</span>
                            </div>
                          )}
                          {m.features && Array.isArray(m.features) && m.features.length > 0 && (
                            <div style={{ textAlign: 'left', marginBottom: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Features:</div>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#555' }}>
                                {m.features.map((f, idx) => (
                                  <li key={idx} style={{ marginBottom: '4px', paddingLeft: '18px', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: '#667eea', fontWeight: 'bold' }}>✓</span> {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {m.noOfLabels != null && <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#555' }}>{m.noOfLabels} Labels</div>}
                          {isSelected && <div style={{ marginTop: '12px', padding: '8px', background: '#667eea', color: 'white', borderRadius: '8px', fontSize: '0.9rem' }}>✓ Selected</div>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={handleProceedToPayment}
                      disabled={isProcessingPayment || !selectedMembershipId}
                      style={{
                        padding: '15px 40px', fontSize: '1.1rem', fontWeight: 'bold',
                        background: (isProcessingPayment || !selectedMembershipId) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white', border: 'none', borderRadius: '10px', cursor: (isProcessingPayment || !selectedMembershipId) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isProcessingPayment ? 'Processing...' : `Proceed to Payment - ₹${memberships.find(m => (m._id || m.id) === selectedMembershipId)?.price || 0}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
