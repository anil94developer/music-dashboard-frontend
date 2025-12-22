import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData, clearCache } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from "../Common/SideBar";
import { useUserProfile } from "../../Context/UserProfileContext";
import "./styles.css";

const MasterLabels = () => {
  const [search, setSearch] = useState("");
  const [labels, setLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: 1
  });
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  useEffect(() => {
    getLabelList(currentPage, limit);
  }, [currentPage, limit]);

  useEffect(() => {
    if (search !== "") {
      setCurrentPage(1);
      getLabelList(1, limit);
    }
  }, [search]);

  const getLabelList = async (page = 1, pageLimit = 10) => {
    setIsLoading(true);
    try {
      const url = base.masterLabelList + `?page=${page}&limit=${pageLimit}&search=${search}`;
      let result = await getData(url);
      
      if (result?.status === true && result?.data) {
        const labelData = result.data;
        const resultList = Array.isArray(labelData.data)
          ? labelData.data.map((item, index) => ({
              _id: item._id,
              id: (page - 1) * pageLimit + index + 1,
              name: item.name,
              description: item.description || "",
              status: item.is_active == 1 ? "Active" : "Inactive",
              createdAt: item.createdAt
            }))
          : [];
        setLabels(resultList);
        setTotalPages(labelData.totalPages || 1);
      } else {
        setLabels([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching label list:", error);
      setLabels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? parseInt(value) : value
    }));
  };

  const handleOpenModal = (label = null) => {
    if (label) {
      setEditingLabel(label);
      setFormData({
        name: label.name || "",
        description: label.description || "",
        is_active: label.status === "Active" ? 1 : 0
      });
    } else {
      setEditingLabel(null);
      setFormData({
        name: "",
        description: "",
        is_active: 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLabel(null);
    setFormData({
      name: "",
      description: "",
      is_active: 1
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim() === "") {
      Swal.fire("Error", "Please fill all required fields (Name)", "error");
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
        name: formData.name.trim(),
        description: formData.description || "",
        is_active: formData.is_active !== undefined ? parseInt(formData.is_active) : 1
      };

      console.log("Submitting label data:", submitData);
      console.log("Token exists:", !!token);

      let result;
      if (editingLabel) {
        result = await postData(`${base.updateMasterLabel}/${editingLabel._id}`, submitData);
      } else {
        result = await postData(base.addMasterLabel, submitData);
      }

      console.log("Label API Response:", result);
      console.log("Label API Response.data:", result?.data);

      // postData returns axios response object: { data: { status, message, data } }
      // Check if result has data property (axios response)
      let responseData;
      if (result?.data && typeof result.data === 'object' && 'status' in result.data) {
        // postData response structure (axios response)
        responseData = result.data;
      } else if (result && typeof result === 'object' && 'status' in result) {
        // Direct response (error case)
        responseData = result;
      } else {
        // Fallback
        responseData = result?.data || result;
      }
      
      console.log("Processed responseData:", responseData);
      
      if (responseData?.status === true) {
        Swal.fire("Success", responseData.message || "Label saved successfully", "success");
        handleCloseModal();
        clearCache(base.masterLabelList);
        setCurrentPage(1);
        setTimeout(() => {
          getLabelList(1, limit);
        }, 100);
      } else {
        const errorMessage = responseData?.message || result?.message || "Failed to save label";
        console.error("Label save error:", errorMessage);
        console.error("Full response:", JSON.stringify(responseData, null, 2));
        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", error.message || "Something went wrong. Please try again.", "error");
    }
  };


  const handleStatusChange = async (label) => {
    const newStatus = label.status === "Active" ? 0 : 1;
    const actionText = label.status === "Active" ? "deactivate" : "activate";
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this label?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await postData(`${base.changeMasterLabelStatus}/${label._id}`, {
          status: newStatus
        });
        
        if (response?.data?.status === true) {
          Swal.fire("Success", `Label ${actionText}d successfully`, "success");
          clearCache(base.masterLabelList);
          getLabelList(currentPage, limit);
        } else {
          Swal.fire("Error", response?.data?.message || "Failed to update status", "error");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  const handleDelete = async (label) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${label.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await postData(`${base.deleteMasterLabel}/${label._id}`, {});
        
        if (response?.data?.status === true) {
          Swal.fire("Success", "Label deleted successfully", "success");
          clearCache(base.masterLabelList);
          getLabelList(currentPage, limit);
        } else {
          Swal.fire("Error", response?.data?.message || "Failed to delete label", "error");
        }
      } catch (error) {
        console.error("Error deleting label:", error);
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
                    <h4 className="card-title">Master Labels Management</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenModal()}
                    >
                      <i className="fa fa-plus"></i> Add Label
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search labels by name or description..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {labels.length > 0 ? (
                                labels.map((label) => (
                                  <tr key={label._id}>
                                    <td>{label.id}</td>
                                    <td><strong>{label.name}</strong></td>
                                    <td>{label.description ? (label.description.length > 50 ? label.description.substring(0, 50) + "..." : label.description) : "-"}</td>
                                    <td>
                                      <span className={`badge ${label.status === "Active" ? "badge-success" : "badge-secondary"}`}>
                                        {label.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button
                                          className="btn btn-sm btn-info"
                                          onClick={() => handleOpenModal(label)}
                                          title="Edit"
                                        >
                                          <i className="fa fa-edit"></i>
                                        </button>
                                        <button
                                          className={`btn btn-sm ${label.status === "Active" ? "btn-warning" : "btn-success"}`}
                                          onClick={() => handleStatusChange(label)}
                                          title={label.status === "Active" ? "Deactivate" : "Activate"}
                                        >
                                          <i className={`fa ${label.status === "Active" ? "fa-ban" : "fa-check"}`}></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() => handleDelete(label)}
                                          title="Delete"
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center py-4">
                                    <p className="text-muted mb-0">No labels found</p>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {totalPages > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <span className="text-muted">
                                Showing page {currentPage} of {totalPages}
                              </span>
                            </div>
                            <div>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                disabled={currentPage === 1}
                                onClick={previousPage}
                              >
                                <i className="fa fa-chevron-left"></i> Previous
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary ml-2"
                                disabled={currentPage === totalPages}
                                onClick={nextPage}
                              >
                                Next <i className="fa fa-chevron-right"></i>
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
                    {editingLabel ? "Edit Label" : "Add New Label"}
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
                            required
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
                    <div className="row">
                      <div className="col-md-12">
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
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingLabel ? "Update" : "Add"} Label
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

export default MasterLabels;

