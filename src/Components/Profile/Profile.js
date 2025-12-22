import React from 'react';
import { useUserProfile } from '../../Context/UserProfileContext';
import useProfileController from '../../Controllers/Profile-Controller/useProfileController';
import { Nav } from '../Common/Nav';
import { SideBar } from '../Common/SideBar'

export default function Profile() {
const {userProfile}= useUserProfile()
const { profile, handleChange, handleSubmit, handleLogoChange, logoPreview, logoFile } = useProfileController();

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
      <section className="profile-page">
        {/* Page Header */}
        <div className="profile-page-header">
          <h1>
            <i className="fa fa-user-circle"></i> Profile
          </h1>
          <p className="profile-page-subtitle">Manage your profile information</p>
        </div>

        <form className="profile-form-modern" onSubmit={handleSubmit}>
          <div className="profile-card">
            <div className="card-body-profile">
              <div className="row">
              {/* Admin Profile - Only Brand Name, Logo, and Copyright */}
              {userProfile?.role === "Admin" ? (
                <>
                  {/* Brand Name */}
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <label>Brand Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter brand name"
                        name="brandName"
                        value={profile.brandName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {/* Logo Upload */}
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <label>Logo</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(logoPreview || profile.logo) && (
                          <div style={{ marginBottom: '10px' }}>
                            <img 
                              src={logoPreview || profile.logo} 
                              alt="Logo Preview" 
                              style={{ 
                                maxWidth: '200px', 
                                maxHeight: '100px', 
                                objectFit: 'contain',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                padding: '5px',
                                backgroundColor: '#f9f9f9'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleLogoChange}
                          style={{ padding: '8px' }}
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                          Upload a logo image (Max 5MB). Supported formats: JPG, PNG, GIF
                        </small>
                      </div>
                    </div>
                  </div>
                  {/* Copyright */}
                  <div className="col-lg-12 col-md-12 col-12">
                    <div className="form-group">
                      <label>Copyright</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter copyright text (e.g., © 2024 Company Name)"
                        name="copyright"
                        value={profile.copyright}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Company Role Fields */}
                  {userProfile?.role == "company" &&
                  <>
                  {/* Company Name */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label for="exampleInputEmail1">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter company name"
                        name="companyName"
                        value={profile.companyName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Client Number */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Client Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter client number"
                        name="clientNumber"
                        value={profile.clientNumber}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Main Email */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Main Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter main email address"
                        name="mainEmail"
                        value={profile.mainEmail}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Royalties Email */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Royalties Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter royalties email address"
                        name="royaltiesEmail"
                        value={profile.royaltiesEmail}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  </>
                  }
                  {/* First Name */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter first name"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter last name"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Phone Number */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter phone number"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Postal Address */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Postal Address</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter postal address"
                        name="postalAddress"
                        value={profile.postalAddress}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Postal Code */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter postal code"
                        name="postalCode"
                        value={profile.postalCode}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* City */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter city"
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Country */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Country</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter country"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Time Zone */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Default Time Zone</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter default time zone"
                        name="timeZone"
                        value={profile.timeZone}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                  {/* Language */}
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="form-group">
                      <label >Default Language</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter default language"
                        name="language"
                        value={profile.language}
                        onChange={handleChange}
                        required
                        />
                    </div>
                  </div>
                </>
              )}
              </div>
              <div className="profile-form-footer">
                <button type="Submit" className="btn-update-profile">
                  <i className="fa fa-save"></i> Update Profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>
</div>
);
}