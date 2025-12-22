import React from 'react'
import useChangePasswordController from '../../Controllers/Change-Password/useChangePasswordController'
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import { useUserProfile } from '../../Context/UserProfileContext';
import '../Common/RoleSpecificStyles.css';

export default function Password() {
const { userProfile } = useUserProfile();
const { newPassword,
setNewPassword,
oldPassword, setOldPassword,
handleSubmit,
} = useChangePasswordController();

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
      <div className="password-change-page">
        {/* Page Header */}
        <div className="page-header-section">
          <div className="header-content">
            <div>
              <h1>
                <i className="fa fa-lock"></i> Change Password
              </h1>
              <p className="page-subtitle">Update your account password to keep it secure</p>
            </div>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="form-card">
          <div className="card-header-section">
            <h3>
              <i className="fa fa-key"></i> Password Settings
            </h3>
          </div>
          <div className="card-body-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-lock"></i> Old Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control-modern"
                    placeholder="Enter your current password"
                    aria-label="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <i className="fa fa-key"></i> New Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control-modern"
                    placeholder="Enter your new password"
                    aria-label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit-form">
                  <i className="fa fa-check"></i> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
)
}