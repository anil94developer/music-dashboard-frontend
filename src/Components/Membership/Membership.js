import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData, clearCache } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from "../Common/SideBar";
import { useUserProfile } from "../../Context/UserProfileContext";
import "./styles.css";

const Membership = () => {
  const [search, setSearch] = useState("");
  const [memberships, setMemberships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    durationType: "months",
    features: [],
    discount: "",
    maxUsers: "",
    priority: "",
    noOfLabels: "",
    noOfArtists: "",
    is_active: 1
  });
  const [featureInput, setFeatureInput] = useState("");
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  useEffect(() => {
    getMembershipList(currentPage, limit);
  }, [currentPage, limit]);

  useEffect(() => {
    if (search !== "") {
      setCurrentPage(1);
      getMembershipList(1, limit);
    }
  }, [search]);

  const getMembershipList = async (page = 1, pageLimit = 10) => {
    setIsLoading(true);
    try {
      const url = base.membershipList + `?page=${page}&limit=${pageLimit}&search=${search}`;
      let result = await getData(url);
      
      console.log("Membership list API response:", result);
      
      // Handle different response structures
      let membershipData = null;
      if (result?.status === true && result?.data) {
        // Direct response structure: { status: true, data: {...} }
        membershipData = result.data;
      } else if (result?.data?.status === true && result?.data?.data) {
        // Nested response structure: { data: { status: true, data: {...} } }
        membershipData = result.data.data;
      }
      
      if (membershipData) {
        const resultList = Array.isArray(membershipData.data)
          ? membershipData.data.map((item, index) => ({
              _id: item._id,
              id: (page - 1) * pageLimit + index + 1,
              name: item.name,
              description: item.description || "",
              price: item.price,
              duration: item.duration,
              durationType: item.durationType || "months",
              features: item.features || [],
              discount: item.discount || 0,
              maxUsers: item.maxUsers || 1,
              priority: item.priority || 0,
              noOfLabels: item.noOfLabels || 0,
              noOfArtists: item.noOfArtists || 0,
              status: item.is_active == 1 ? "Active" : "Inactive",
              createdAt: item.createdAt
            }))
          : [];
        console.log("Processed membership list:", resultList);
        setMemberships(resultList);
        setTotalPages(membershipData.totalPages || 1);
      } else {
        console.warn("No membership data found in response:", result);
        setMemberships([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching membership list:", error);
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleOpenModal = (membership = null) => {
    if (membership) {
      setEditingMembership(membership);
      setFormData({
        name: membership.name || "",
        description: membership.description || "",
        price: membership.price || "",
        duration: membership.duration || "",
        durationType: membership.durationType || "months",
        features: membership.features || [],
        discount: membership.discount || "",
        maxUsers: membership.maxUsers || "",
        priority: membership.priority || "",
        noOfLabels: membership.noOfLabels || "",
        noOfArtists: membership.noOfArtists || "",
        is_active: membership.status === "Active" ? 1 : 0
      });
    } else {
      setEditingMembership(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        durationType: "months",
        features: [],
        discount: "",
        maxUsers: "",
        priority: "",
        noOfLabels: "",
        noOfArtists: "",
        is_active: 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMembership(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      durationType: "months",
      features: [],
      discount: "",
      maxUsers: "",
      priority: "",
      noOfLabels: "",
      noOfArtists: "",
      is_active: 1
    });
    setFeatureInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.duration) {
      Swal.fire("Error", "Please fill all required fields (Name, Price, Duration)", "error");
      return;
    }

    try {
      // Check token before making request
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "Please login again. Token not found.", "error");
        return;
      }

      const submitData = {
        name: formData.name,
        description: formData.description || "",
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        durationType: formData.durationType || "months",
        features: formData.features || [],
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        maxUsers: formData.maxUsers ? parseInt(formData.maxUsers) : 1,
        priority: formData.priority ? parseInt(formData.priority) : 0,
        noOfLabels: formData.noOfLabels ? parseInt(formData.noOfLabels) : 0,
        noOfArtists: formData.noOfArtists ? parseInt(formData.noOfArtists) : 0,
        is_active: formData.is_active !== undefined ? parseInt(formData.is_active) : 1
      };

      console.log("Submitting membership data:", submitData);
      console.log("Token exists:", !!token);

      let result;
      if (editingMembership) {
        result = await postData(`${base.updateMembership}/${editingMembership._id}`, submitData);
      } else {
        result = await postData(base.addMembership, submitData);
      }

      console.log("Membership API Response:", result);

      // Handle both response formats: result.data or result directly
      const responseData = result?.data || result;
      
      if (responseData?.status === true) {
        Swal.fire("Success", responseData.message || "Membership saved successfully", "success");
        handleCloseModal();
        // Clear cache for membership list to ensure fresh data
        clearCache(base.membershipList);
        // Reset to page 1 to see the newly added membership
        setCurrentPage(1);
        // Refresh the list (will be triggered by useEffect when currentPage changes)
        setTimeout(() => {
          getMembershipList(1, limit);
        }, 100);
      } else {
        const errorMessage = responseData?.message || result?.message || "Failed to save membership";
        console.error("Membership save error:", errorMessage, responseData);
        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", error.message || "Something went wrong. Please try again.", "error");
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await postData(`${base.deleteMembership}/${id}`, {});
        if (deleteResult?.data?.status === true) {
          Swal.fire("Success", "Membership deleted successfully", "success");
          clearCache(base.membershipList);
          getMembershipList(currentPage, limit);
        } else {
          Swal.fire("Error", deleteResult.data?.message || "Failed to delete membership", "error");
        }
      } catch (error) {
        console.error("Error deleting membership:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? 0 : 1;
    const actionText = currentStatus === "Active" ? "deactivate" : "activate";
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this membership?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const statusResult = await postData(`${base.changeMembershipStatus}/${id}`, { status: newStatus });
        if (statusResult?.data?.status === true) {
          Swal.fire("Success", `Membership ${actionText}d successfully`, "success");
          clearCache(base.membershipList);
          getMembershipList(currentPage, limit);
        } else {
          Swal.fire("Error", statusResult.data?.message || "Failed to update status", "error");
        }
      } catch (error) {
        console.error("Error changing status:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={getMainContentClass()}>
      <SideBar />
      <div className="content-wrapper">
        <Nav />
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title">Membership Management</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenModal()}
                    >
                      <i className="fa fa-plus"></i> Add Membership
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name or description..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Features</th>
                                <th>Discount</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberships.length === 0 ? (
                                <tr>
                                  <td colSpan="8" className="text-center py-4">
                                    No memberships found
                                  </td>
                                </tr>
                              ) : (
                                memberships.map((membership) => (
                                  <tr key={membership._id}>
                                    <td>{membership.id}</td>
                                    <td>{membership.name}</td>
                                    <td>${membership.price}</td>
                                    <td>{membership.duration} {membership.durationType}</td>
                                    <td>
                                      {membership.features.length > 0 ? (
                                        <span className="badge badge-info">
                                          {membership.features.length} features
                                        </span>
                                      ) : (
                                        <span className="text-muted">No features</span>
                                      )}
                                    </td>
                                    <td>{membership.discount}%</td>
                                    <td>
                                      <span className={`badge ${membership.status === "Active" ? "badge-success" : "badge-secondary"}`}>
                                        {membership.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button
                                          className="btn btn-sm btn-info"
                                          onClick={() => handleOpenModal(membership)}
                                          title="Edit"
                                        >
                                          <i className="fa fa-edit"></i>
                                        </button>
                                        <button
                                          className={`btn btn-sm ${membership.status === "Active" ? "btn-warning" : "btn-success"}`}
                                          onClick={() => handleStatusChange(membership._id, membership.status)}
                                          title={membership.status === "Active" ? "Deactivate" : "Activate"}
                                        >
                                          <i className={`fa ${membership.status === "Active" ? "fa-ban" : "fa-check"}`}></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => handleDelete(membership._id, membership.name)}
                                          title="Delete"
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        {totalPages > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <span>Page {currentPage} of {totalPages}</span>
                            </div>
                            <div>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={previousPage}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary ml-2"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={handleCloseModal}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingMembership ? "Edit Membership" : "Add New Membership"}
                  </h5>
                  <button type="button" className="close" onClick={handleCloseModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Price <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price || ""}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Duration <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className="form-control"
                          name="duration"
                          value={formData.duration || ""}
                          onChange={handleInputChange}
                          min="1"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Duration Type</label>
                        <select
                          className="form-control"
                          name="durationType"
                          value={formData.durationType}
                          onChange={handleInputChange}
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        >
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Discount (%)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="discount"
                          value={formData.discount || ""}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Max Users</label>
                        <input
                          type="number"
                          className="form-control"
                          name="maxUsers"
                          value={formData.maxUsers || ""}
                          onChange={handleInputChange}
                          min="1"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      style={{ color: '#000000', backgroundColor: '#ffffff' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Features</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control feature-input-field"
                        placeholder="Add a feature..."
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        style={{ 
                          color: '#000000', 
                          backgroundColor: '#ffffff',
                          WebkitTextFillColor: '#000000'
                        }}
                        autoComplete="off"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddFeature}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="badge feature-badge mr-2 mb-2 p-2">
                          {feature}
                          <button
                            type="button"
                            className="ml-2 feature-remove-btn"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>No. of Labels</label>
                        <input
                          type="number"
                          className="form-control"
                          name="noOfLabels"
                          value={formData.noOfLabels || ""}
                          onChange={handleInputChange}
                          min="0"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>No. of Artists</label>
                        <input
                          type="number"
                          className="form-control"
                          name="noOfArtists"
                          value={formData.noOfArtists || ""}
                          onChange={handleInputChange}
                          min="0"
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Priority</label>
                        <input
                          type="number"
                          className="form-control"
                          name="priority"
                          value={formData.priority || ""}
                          onChange={handleInputChange}
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          className="form-control"
                          name="is_active"
                          value={formData.is_active}
                          onChange={handleInputChange}
                          style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMembership ? "Update" : "Add"} Membership
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Membership;

