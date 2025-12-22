import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { base } from '../../Constants/Data.constant';
import { getData, postData } from '../../Services/Ops';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import "./styles.css";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../Context/UserProfileContext';

import DataTable from "../Common/DataTable/DataTable";
import { Box, Button, Modal, Typography } from '@mui/material';


export default function PaymentOperations() {
  const navigate = useNavigate()
  const { userProfile } = useUserProfile();
  const [amount, setAmount] = useState();
  const [widthdraw, setWidthdraw] = useState([]);
  const [userData, setUserData] = useState({})
  const [withdrawalRequest, setWithdrawalRequest] = useState([]);

  useEffect(() => {
    getWidthdrawal()
    getProfile()
  }, [])
  const getProfile = async () => {
    try {
      // const userId = "671e08391a2071afe4269f80";
      const result = await getData(base.userProfile); // pass as query parameter
      console.log(result)
      if (result && result.status === true) {
        setUserData(result.data); // Assuming result.data has user data directly
      } else {
        Swal.fire({
          icon: 'error', // Use "error" icon for unauthorized message
          title: 'Unauthorized !!', // Set your custom title here
          text: 'You do not have permission to access this resource.' // Custom message (optional)
        });
        // Uncomment if you want to redirect:
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.'
      });
    }
  };
  const handleSubmit = async () => {
    if (userData?.wallet < 100) {
      Swal.fire("Error", "Please enter miimum € 100", "error");
    } else {
      let body = {
        amount: userData?.wallet
      }
      let result = await postData(base.sendWithdrawal, body);
      if (result.data.status === true) {
        Swal.fire("Success", result.data.message, "success");
        window.location.reload();
      } else {
        Swal.fire("Error", result.message, "error");
      }
    }
  }
  const getWidthdrawal = async () => {
    let result = await getData(base.getWithdraw);
    console.log("setWidthdraw",result)

    setWidthdraw(result?.data)

    // const resultList = Array.isArray(result?.data)
    //   ? result.data
    //     .map((item, index) => ({
    //       id: index + 1,
    //       amount: item.amount,
    //       status: item.status,
          
    //     }))
    //   : [];
    setWithdrawalRequest(result?.data)
  }
  const columns = [
    { field: 'id', headerName: '#', headerClassName: 'black-header', },
    { field: 'amount', headerName: 'AMOUNT', headerClassName: 'black-header', },
    { field: 'status', headerName: 'STATUS', headerClassName: 'black-header', },
  ];
  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  return (
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-main">
          <section className="payment-operations-page">
            {/* Page Header */}
            <div className="payment-page-header">
              <h1>
                <i className="fa fa-credit-card"></i> Payment Operations
              </h1>
              <p className="payment-page-subtitle">Manage your withdrawals and payment requests</p>
            </div>

            <div className="row">
              {/* Left Column - Balance/Status Card */}
              <div className="col-lg-5 col-12">
                {widthdraw[widthdraw?.length - 1]?.amount > 0 && widthdraw[widthdraw?.length - 1]?.status == "Pending" ? (
                  /* Pending Payment Status Card */
                  <div className="payment-status-card">
                    <div className="card-header-gradient">
                      <h2>
                        <i className="fa fa-clock"></i> Pending Payment
                      </h2>
                    </div>
                    <div className="card-body-payment">
                      <div className="balance-info-section">
                        <div className="balance-amount-display">
                          <span className="balance-label">Payment Amount</span>
                          <span className="balance-value">€ {JSON.stringify(widthdraw[widthdraw?.length - 1]?.amount)}</span>
                        </div>
                        <p className="balance-description">
                          Your Available balance is calculated according to your royalties and your advance, if you have an active advance.
                        </p>
                        <a href="#" className="faq-link-modern">
                          <i className="fa fa-question-circle"></i> Find out more on the FAQ
                        </a>
                      </div>

                      <div className="payment-status-section">
                        <h3 className="status-title">Payment Status</h3>
                        <div className="status-steps-modern">
                          <div className={widthdraw[widthdraw?.length - 1]?.status == 'Pending' ? "status-step active" : "status-step"}>
                            <div className="step-circle">
                              <i className="fa fa-check"></i>
                            </div>
                            <span className="step-label">Requested</span>
                          </div>
                          <div className={widthdraw[widthdraw?.length - 1]?.status == 'active' || widthdraw[widthdraw?.length - 1]?.status == 'Active' ? "status-step active" : "status-step"}>
                            <div className="step-circle">
                              <i className="fa fa-cog"></i>
                            </div>
                            <span className="step-label">Processed</span>
                          </div>
                          <div className={widthdraw[widthdraw?.length - 1]?.status == 'complete' || widthdraw[widthdraw?.length - 1]?.status == 'Complete' ? "status-step active" : "status-step"}>
                            <div className="step-circle">
                              <i className="fa fa-check-circle"></i>
                            </div>
                            <span className="step-label">Complete</span>
                          </div>
                        </div>
                        <div className="payment-details-info">
                          <p>
                            <i className="fa fa-info-circle"></i> You have requested the payment <strong>{widthdraw[widthdraw?.length - 1]?._id}</strong> of € {JSON.stringify(widthdraw[widthdraw?.length - 1]?.amount)} on {moment(widthdraw[widthdraw?.length - 1]?.createdAt).format("DD-MM-YYYY HH:MM:SS")}.
                          </p>
                          <p className="processing-time">
                            <i className="fa fa-hourglass-half"></i> Your payment request will be confirmed by our team and sent to the payout provider within 7 days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Request Withdrawal Card */
                  <div className="wallet-card">
                    <div className="card-header-gradient">
                      <h2>
                        <i className="fa fa-wallet"></i> Withdrawal Request
                      </h2>
                    </div>
                    <div className="card-body-wallet">
                      <div className="wallet-balance-display">
                        <div className="balance-icon-wrapper">
                          <i className="fa fa-money-bill-wave"></i>
                        </div>
                        <div className="balance-details">
                          <h3>Available Balance</h3>
                          <p className="balance-amount">€ {userData?.wallet || '0.00'}</p>
                          <p className="balance-note">Minimum withdrawal: € 100</p>
                        </div>
                      </div>
                      {userData?.wallet >= 100 ? (
                        <div className="withdrawal-action-section">
                          <button 
                            type="button" 
                            className="btn-request-withdrawal"
                            onClick={() => { handleSubmit() }}
                          >
                            <i className="fa fa-paper-plane"></i> Request Withdrawal
                          </button>
                          <p className="withdrawal-info">
                            <i className="fa fa-info-circle"></i> You can withdraw your full available balance
                          </p>
                        </div>
                      ) : (
                        <div className="insufficient-balance-section">
                          <div className="insufficient-balance-alert">
                            <i className="fa fa-exclamation-triangle"></i>
                            <p>Insufficient balance. Minimum withdrawal amount is € 100.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Transaction History */}
              <div className="col-lg-7 col-12">
                <div className="transaction-history-card">
                  <div className="card-header-gradient">
                    <h2>
                      <i className="fa fa-history"></i> Withdrawal History
                    </h2>
                  </div>
                  <div className="card-body-transactions">
                    {withdrawalRequest?.length > 0 ? (
                      <div className="table-container-transactions">
                        <div className="table-wrapper-transactions">
                          <table className="modern-table-transactions">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {withdrawalRequest.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="amount-cell">€ {item.amount}</td>
                                  <td>
                                    <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td className="date-cell">
                                    {moment(item.createdAt).format("DD-MM-YYYY HH:mm")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="no-transactions-message">
                        <i className="fa fa-inbox"></i>
                        <h3>No Withdrawal History</h3>
                        <p>You haven't made any withdrawal requests yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}