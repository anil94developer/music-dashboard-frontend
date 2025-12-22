import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData, clearCache } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from "../Common/SideBar";
import { useUserProfile } from "../../Context/UserProfileContext";
import "./styles.css";

const UserPlan = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    noOfLabels: "",
    noOfArtists: ""
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
    // Clear cache before fetching to ensure fresh data
    clearCache(base.userList);
    getUserList(currentPage, limit);
  }, [currentPage, limit]);

  useEffect(() => {
    if (search !== "") {
      setCurrentPage(1);
      getUserList(1, limit);
    }
  }, [search]);

  const getUserList = async (page = 1, pageLimit = 10) => {
    setIsLoading(true);
    try {
      const url = base.userList + `?page=${page}&limit=${pageLimit}&search=${search}`;
      let result = await getData(url);
      
      console.log("User List API Response (Full):", JSON.stringify(result, null, 2)); // Debug log
      
      // Handle different response structures
      let userData = null;
      
      // Structure 1: { status: true, data: { data: [...], total: ..., totalPages: ... } }
      if (result?.status === true && result?.data) {
        // Check if data has nested data property (paginated response)
        if (result.data.data && Array.isArray(result.data.data)) {
          userData = result.data;
          console.log("Using structure 1 - Paginated: result.data with nested data array");
        }
        // Check if data is direct array
        else if (Array.isArray(result.data)) {
          userData = { data: result.data, total: result.data.length, totalPages: 1 };
          console.log("Using structure 1 - Direct array: result.data");
        }
        // Check if data is object with data property
        else if (result.data && typeof result.data === 'object') {
          userData = result.data;
          console.log("Using structure 1 - Object: result.data");
        }
      }
      // Structure 2: { data: { status: true, data: { data: [...], total: ..., totalPages: ... } } }
      else if (result?.data?.status === true && result?.data?.data) {
        userData = result.data.data;
        console.log("Using structure 2 - Nested: result.data.data");
      }
      // Structure 3: Direct array (fallback)
      else if (Array.isArray(result)) {
        userData = { data: result, total: result.length, totalPages: 1 };
        console.log("Using structure 3 - Direct array: result");
      }
      
      if (userData) {
        // Extract users array
        const usersArray = Array.isArray(userData.data) ? userData.data : (Array.isArray(userData) ? userData : []);
        
        console.log(`Found ${usersArray.length} users in response`);
        
        const resultList = usersArray.map((item, index) => {
          console.log(`User ${index + 1}:`, {
            _id: item._id,
            email: item.email,
            hasMembership: !!item.activeMembership,
            membershipName: item.activeMembership?.name || "N/A"
          });
          
          return {
            _id: item._id,
            id: (page - 1) * pageLimit + index + 1,
            name: item.name || item.companyName || "",
            email: item.email || "",
            clientNumber: item.clientNumber || "",
            noOfLabels: item.noOfLabel || item.noOfLabels || 0,
            noOfArtists: item.noOfArtists || (item.artist ? (Array.isArray(item.artist) ? item.artist.length : 0) : 0),
            status: item.is_deleted == 0 ? "Active" : "Inactive",
            activeMembership: item.activeMembership || null // Include membership data
          };
        });
        
        console.log("Processed user list:", resultList);
        console.log("Users with membership:", resultList.filter(u => u.activeMembership).length);
        
        setUsers(resultList);
        setTotalPages(userData.totalPages || 1);
      } else {
        console.warn("No user data found. Response structure:", result);
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setUsers([]);
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

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    
    // Use membership values if available, otherwise use user's current values
    const membershipLabels = user.activeMembership?.noOfLabels || 0;
    const membershipArtists = user.activeMembership?.noOfArtists || 0;
    
    setFormData({
      noOfLabels: user.noOfLabels || user.noOfLabel || membershipLabels || "",
      noOfArtists: user.noOfArtists || membershipArtists || ""
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      noOfLabels: "",
      noOfArtists: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.noOfLabels || !formData.noOfArtists) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      const submitData = {
        userId: selectedUser._id,
        noOfLabels: parseInt(formData.noOfLabels),
        noOfArtists: parseInt(formData.noOfArtists)
      };

      const result = await postData(base.updateUserPlan, submitData);

      console.log("User Plan API Response:", result);

      const responseData = result?.data || result;
      
      if (responseData?.status === true) {
        Swal.fire("Success", responseData.message || "User plan updated successfully", "success");
        handleCloseModal();
        getUserList(currentPage, limit);
      } else {
        const errorMessage = responseData?.message || result?.message || "Failed to update user plan";
        console.error("User plan update error:", errorMessage, responseData);
        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      console.error("Error updating user plan:", error);
      Swal.fire("Error", error.message || "Something went wrong. Please try again.", "error");
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
                    <h4 className="card-title">Edit User Plan</h4>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name or email..."
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
                                <th>Email</th>
                                <th>Client Number</th>
                                <th>Membership Plan</th>
                                <th>No. of Labels</th>
                                <th>No. of Artists</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.length === 0 ? (
                                <tr>
                                  <td colSpan="9" className="text-center py-4">
                                    No users found
                                  </td>
                                </tr>
                              ) : (
                                users.map((user) => (
                                  <tr key={user._id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.clientNumber}</td>
                                    <td>
                                      {user.activeMembership ? (
                                        <span className="badge badge-info" title={`Expires: ${new Date(user.activeMembership.expiryDate).toLocaleDateString()}`}>
                                          {user.activeMembership.name}
                                        </span>
                                      ) : (
                                        <span className="badge badge-secondary">No Membership</span>
                                      )}
                                    </td>
                                    <td>{user.noOfLabels}</td>
                                    <td>{user.noOfArtists}</td>
                                    <td>
                                      <span className={`badge ${user.status === "Active" ? "badge-success" : "badge-secondary"}`}>
                                        {user.status}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleOpenModal(user)}
                                        title="Edit Plan"
                                        disabled={!user.activeMembership}
                                      >
                                        <i className="fa fa-edit"></i> Edit Plan
                                      </button>
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

      {/* Edit Plan Modal */}
      {showModal && selectedUser && (
        <>
          <div className="modal-backdrop show" onClick={handleCloseModal}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Plan for {selectedUser.name}
                  </h5>
                  <button type="button" className="close" onClick={handleCloseModal}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {selectedUser.activeMembership && (
                      <div className="alert alert-info mb-3">
                        <strong>Active Membership:</strong> {selectedUser.activeMembership.name}<br />
                        <small>
                          Plan Labels: {selectedUser.activeMembership.noOfLabels} | 
                          Plan Artists: {selectedUser.activeMembership.noOfArtists} | 
                          Purchases: {selectedUser.activeMembership.purchaseCount} | 
                          Expires: {new Date(selectedUser.activeMembership.expiryDate).toLocaleDateString()}
                        </small>
                      </div>
                    )}
                    {!selectedUser.activeMembership && (
                      <div className="alert alert-warning mb-3">
                        <strong>No Active Membership:</strong> This user does not have an active membership plan.
                      </div>
                    )}
                    <div className="form-group">
                      <label>No. of Labels <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="noOfLabels"
                        value={formData.noOfLabels}
                        onChange={handleInputChange}
                        min="0"
                        required
                        style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        placeholder={selectedUser.activeMembership ? `Plan: ${selectedUser.activeMembership.noOfLabels}` : ""}
                      />
                      {selectedUser.activeMembership && (
                        <small className="form-text text-muted">
                          Membership plan includes: {selectedUser.activeMembership.noOfLabels} labels
                        </small>
                      )}
                    </div>
                    <div className="form-group">
                      <label>No. of Artists <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="noOfArtists"
                        value={formData.noOfArtists}
                        onChange={handleInputChange}
                        min="0"
                        required
                        style={{ color: '#000000', backgroundColor: '#ffffff' }}
                        placeholder={selectedUser.activeMembership ? `Plan: ${selectedUser.activeMembership.noOfArtists}` : ""}
                      />
                      {selectedUser.activeMembership && (
                        <small className="form-text text-muted">
                          Membership plan includes: {selectedUser.activeMembership.noOfArtists} artists
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Plan
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

export default UserPlan;

