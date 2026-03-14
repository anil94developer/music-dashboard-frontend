import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import { SideBar } from "../Common/SideBar";
import { Nav } from "../Common/Nav";
import { useUserProfile } from "../../Context/UserProfileContext";

export const ClientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();
  const userId = location.state?.userId;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    noOfLabels: "",
    noOfArtists: "",
  });

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  useEffect(() => {
    if (!userId) {
      Swal.fire("Error", "Missing user id", "error");
      navigate("/CompanyManagement");
      return;
    }
    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await postData(base.getUser, { userId });
        const response = result?.data || result;
        if (response?.status === true && response?.data) {
          setUser(response.data);
          setFormData({
            noOfLabels:
              response.data.noOfLabel ??
              response.data.noOfLabels ??
              response.data.activeMembership?.noOfLabels ??
              "",
            noOfArtists:
              response.data.noOfArtists ??
              response.data.activeMembership?.noOfArtists ??
              "",
          });
        } else {
          Swal.fire("Error", response?.message || "Failed to load user", "error");
        }
      } catch (e) {
        Swal.fire("Error", e.message || "Failed to load user", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!formData.noOfLabels || !formData.noOfArtists) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }
    try {
      setSaving(true);
      const submitData = {
        userId,
        noOfLabels: parseInt(formData.noOfLabels),
        noOfArtists: parseInt(formData.noOfArtists),
      };
      const result = await postData(base.updateUserPlan, submitData);
      const response = result?.data || result;
      if (response?.status === true) {
        Swal.fire("Success", response.message || "User plan updated", "success");
      } else {
        Swal.fire("Error", response?.message || "Failed to update", "error");
      }
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to update plan", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-main">
          <section className="page-heading">
            <h1>Client Details</h1>
          </section>
          <section className="content client-details-page">
            {loading ? (
              <div className="text-center py-5">Loading client details…</div>
            ) : !user ? (
              <div className="text-center py-5">Client not found</div>
            ) : (
              <div className="client-details-wrapper">
                <div className="client-header-card">
                  <div className="client-header-left">
                    <div className="client-avatar">{(user.name || 'U').slice(0,1).toUpperCase()}</div>
                    <div className="client-title">
                      <h2>{user.name || 'Unknown'}</h2>
                      <div className="client-meta">
                        <span className="client-badge"><i className="fa fa-id-card"></i> {user.clientNumber || 'N/A'}</span>
                        <span className={`client-status ${user.is_deleted == 0 ? 'active' : 'inactive'}`}>{user.is_deleted == 0 ? 'Active' : 'Inactive'}</span>
                        <span className="client-badge"><i className="fa fa-envelope"></i> {user.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="client-header-right">
                    <div className="client-plan">
                      <span className="plan-label">Membership</span>
                      <span className={`plan-badge ${user.activeMembership ? 'has-plan' : 'no-plan'}`}>
                        {user.activeMembership?.name || 'No Membership'}
                      </span>
                    </div>
                    {user.activeMembership?.expiryDate && (
                      <div className="client-plan">
                        <span className="plan-label">Expires</span>
                        <span className="plan-badge">{new Date(user.activeMembership.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="client-grid">
                  <div className="client-info-card">
                    <h3><i className="fa fa-user"></i> Account Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-key">Name</span>
                        <span className="info-value">{user.name || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-key">Client Number</span>
                        <span className="info-value">{user.clientNumber || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-key">Email</span>
                        <span className="info-value">{user.email || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-key">Status</span>
                        <span className={`info-chip ${user.is_deleted == 0 ? 'chip-success' : 'chip-danger'}`}>{user.is_deleted == 0 ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="client-plan-card">
                    <h3><i className="fa fa-cog"></i> Plan Limits</h3>
                    {user.activeMembership ? (
                      <div className="plan-summary">
                        <div className="summary-item">
                          <span className="summary-key">Labels</span>
                          <span className="summary-value">{user.activeMembership.noOfLabels}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-key">Artists</span>
                          <span className="summary-value">{user.activeMembership.noOfArtists}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-key">Purchases</span>
                          <span className="summary-value">{user.activeMembership.purchaseCount || 0}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-warning">No Active Membership</div>
                    )}

                    <form onSubmit={handleUpdatePlan} className="plan-form-grid">
                      <div className="form-group">
                        <label>No. of Labels <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          name="noOfLabels"
                          className="form-control"
                          min="0"
                          required
                          value={formData.noOfLabels}
                          onChange={handleInputChange}
                        />
                        {user.activeMembership && (
                          <small className="form-text text-muted">
                            Plan includes {user.activeMembership.noOfLabels} labels
                          </small>
                        )}
                      </div>
                      <div className="form-group">
                        <label>No. of Artists <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          name="noOfArtists"
                          className="form-control"
                          min="0"
                          required
                          value={formData.noOfArtists}
                          onChange={handleInputChange}
                        />
                        {user.activeMembership && (
                          <small className="form-text text-muted">
                            Plan includes {user.activeMembership.noOfArtists} artists
                          </small>
                        )}
                      </div>
                      <div className="plan-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => navigate("/CompanyManagement")}
                        >
                          Back
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                          {saving ? "Updating..." : "Update Plan"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
