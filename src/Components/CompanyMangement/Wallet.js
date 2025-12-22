import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Nav } from '../Common/Nav'
import Papa from 'papaparse'
import { getData, postData, postDataContent } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import Swal from 'sweetalert2';
import { SideBar } from '../Common/SideBar';
export default function Wallet() {

  // Add these state variables at the top of your component
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const location = useLocation();
  const userId = location.state?.userId;
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    if (userId) {
      getClientNo(userId);
    }
  }, [userId]);
  
      
const getClientNo = async (userId) => {
    try {
      const body = { userId };
      const result = await postData(base.getUser, body);
      console.log("get user", result);
      setUserDetails(result?.data?.data);
    } catch (error) {
      console.error("Error fetching client number:", error);
      return null;
    }
  };


  // Function to handle wallet amount update
  const handleWalletUpdate = async () => {
    try {
      const body = { 
        userId: userId, 
        amount: walletAmount 
      };
      const result = await postData(base.updateWallet, body);
      
      if (result.data.status === true) {
        Swal.fire("Success", "Wallet updated successfully", "success");
        setShowWalletModal(false);
        // Refresh user details to show updated wallet
        getClientNo(userId);
      } else {
        Swal.fire("Error", result.data.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      Swal.fire("Error", "Failed to update wallet", "error");
    }
  };

  // Add this wallet display component where you want it to appear in your render function
  return (
    <div> 
      <div className="row">
        <div className="col-md-3">
          <div className="card" style={{ backgroundColor: '#000', color: '#fff', borderColor: '#333' }}>
            <div className="card-body text-center">
              <h5 className="card-title">Wallet Balance</h5>
              <h2 className="mt-3 mb-3">€  {userDetails?.wallet || 0}</h2>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                onClick={() => setShowWalletModal(true)}
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
         
      </div>
      
      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#000', color: '#fff', borderColor: '#333' }}>
              <div className="modal-header" style={{ borderColor: '#333' }}>
                <h5 className="modal-title">Add Money to Wallet</h5>
                <button type="button" className="close" onClick={() => setShowWalletModal(false)} style={{ color: '#fff' }}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Amount</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    style={{ backgroundColor: '#333', color: '#fff', borderColor: '#444' }}
                    value={walletAmount} 
                    onChange={(e) => setWalletAmount(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ borderColor: '#333' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ backgroundColor: '#444', borderColor: '#444' }}
                  onClick={() => setShowWalletModal(false)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                  onClick={handleWalletUpdate}
                >
                  Add Money
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}