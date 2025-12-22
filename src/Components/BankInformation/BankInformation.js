import React from 'react'
import useBankInformationController from '../../Controllers/Bank-Information-Controller/useBankInformationController'
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import { useUserProfile } from '../../Context/UserProfileContext';
import '../Common/RoleSpecificStyles.css';

export default function BankInformation() {
const { userProfile } = useUserProfile();
const { bankDetails, handleChange, handleSubmit } = useBankInformationController();

const getMainContentClass = () => {
  if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
  if (userProfile?.role === "company") return "main-cotent company-main-content";
  if (userProfile?.role === "employee") return "main-cotent employee-main-content";
  return "main-cotent";
};

return (
<div>
  <SideBar/>
  <div className={getMainContentClass()}>
    <Nav />
    <div className="content-main">
      <div className="bank-information-page">
        {/* Page Header */}
        <div className="page-header-section">
          <div className="header-content">
            <div>
              <h1>
                <i className="fa fa-university"></i> Bank Information
              </h1>
              <p className="page-subtitle">Manage your bank account details for payments and withdrawals</p>
            </div>
          </div>
        </div>

        {/* Bank Information Card */}
        <div className="form-card">
          <div className="card-header-section">
            <h3>
              <i className="fa fa-credit-card"></i> Bank Account Details
            </h3>
          </div>
          <div className="card-body-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-id-card"></i> PAN Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    placeholder="Enter PAN Number"
                    name="panNumber"
                    value={bankDetails.panNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-user"></i> Account Holder Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    placeholder="Enter account holder name"
                    name="accountHolder"
                    value={bankDetails.accountHolder}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-building"></i> Bank Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    placeholder="Enter bank name"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-code"></i> IFSC Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    placeholder="Enter IFSC code"
                    name="ifscCode"
                    value={bankDetails.ifscCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-hashtag"></i> Account Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    placeholder="Enter account number"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-list"></i> Account Type <span className="required">*</span>
                  </label>
                  <select
                    className="form-control-modern"
                    name="accountType"
                    value={bankDetails.accountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit-form">
                  <i className="fa fa-check"></i> Save Bank Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
}