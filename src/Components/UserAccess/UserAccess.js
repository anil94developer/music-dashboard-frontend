import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { useUserProfile } from "../../Context/UserProfileContext";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import { SideBar } from '../Common/SideBar'
import "./styles.css";
import "../Common/RoleSpecificStyles.css";
const UserAccess = (props) => {
  const { userProfile } = useUserProfile()
  const [search, setSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState("All");
  const [permissionLevel, setPermissionLevel] = useState("All");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const handleDelete = (login) => {
    setUsers(users.filter((user) => user.login !== login));
  };
  useEffect(() => {
    getUserList();
  }, [props])
  const getUserList = async () => {
    let result = await getData(base.getUserList);
    console.log("my user list=========>", result.data)
    setUsers(result.data)
  }

  const deleteAction = async (userid) => {
      let body={
        id : userid 
      }
      console.log(body)
      let result = await postData(base. deleteUserparmanent, body);
      if (result.data.status === true) {
        Swal.fire("Success", result.message , result.message) 
        getUserList();
        let updateArr= users.filter(item=> item._id !== userid)
        setUsers(updateArr)
  
      } else {
        Swal.fire("Error", result.message, result.message);
      }
      
    }
  const user_delete = async (userId, status) => {
    try {
      let body = {
        "userId": userId,
        status: status == 1 ? 0 : 1
      }
      let result = await postData(base.deleteUser, body)
      if (result.data.status === true) {
        Swal.fire("Success", result.data.message, "success");
        getUserList();
      } else {
        Swal.fire("Error", result.data.message, "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  }
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
          <div className="user-access-page">
            {/* Page Header */}
            <div className="page-header-section">
              <div className="header-content">
                <div>
                  <h1>
                    <i className="fa fa-users"></i> User Management
                  </h1>
                  <p className="page-subtitle">Manage your team's TunePlus access and permissions</p>
                </div>
                <a className="btn-add-user" href="add-user">
                  <i className="fa fa-plus"></i> Add New User
                </a>
              </div>
            </div>

            {/* Info Card */}
            <div className="info-card">
              <div className="info-icon">
                <i className="fa fa-info-circle"></i>
              </div>
              <div className="info-content">
                <p>
                  <strong>Administrator Control:</strong> As an administrator, you're in control of your team's TunePlus access. 
                  Easily create new user accounts, tailoring their experience by specifying their catalog scope, permission level, 
                  and access to specific TunePlus sections. Once you've configured their settings, they'll automatically receive 
                  an email with their login details and be ready to go.
                </p>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="users-table-card">
              <div className="card-header-section">
                <h3>
                  <i className="fa fa-list"></i> Users List
                </h3>
                <div className="user-count-badge">
                  {users?.length || 0} {users?.length === 1 ? 'User' : 'Users'}
                </div>
              </div>
              <div className="table-container">
                <div className="table-wrapper">
                  {users && users.length > 0 ? (
                    <table className="modern-user-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Client Number</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user?.userDetails?._id}>
                            <td className="index-cell">{index + 1}</td>
                            <td className="name-cell">
                              <i className="fa fa-user"></i> {user?.userDetails?.companyName || 'N/A'}
                            </td>
                            <td className="client-cell">{user?.userDetails?.clientNumber || 'N/A'}</td>
                            <td className="email-cell">
                              <i className="fa fa-envelope"></i> {user?.userDetails?.email || 'N/A'}
                            </td>
                            <td>
                              <span className={`status-badge ${user?.userDetails?.is_deleted == 1 ? 'status-inactive' : 'status-active'}`}>
                                <i className={`fa ${user?.userDetails?.is_deleted == 1 ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                                {user?.userDetails?.is_deleted == 1 ? "Inactive" : "Active"}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <button
                                  className={`btn-action btn-toggle-status ${user?.userDetails?.is_deleted == 0 ? 'btn-deactivate' : 'btn-activate'}`}
                                  onClick={() => {
                                    user_delete(user?.userDetails?._id, user?.userDetails?.is_deleted);
                                  }}
                                  title={user?.userDetails?.is_deleted == 0 ? "Deactivate User" : "Activate User"}
                                >
                                  <i className={`fa ${user?.userDetails?.is_deleted == 0 ? 'fa-ban' : 'fa-check'}`}></i>
                                  {user?.userDetails?.is_deleted == 0 ? "Deactivate" : "Activate"}
                                </button>
                                <button 
                                  className="btn-action btn-edit" 
                                  onClick={() => { navigate("/edit-permission", { state: { userData: user } }); }}
                                  title="Edit Permissions"
                                >
                                  <i className="fa fa-edit"></i> Edit
                                </button>
                                <button 
                                  title="Delete User" 
                                  className="btn-action btn-delete"
                                  onClick={async () => {
                                    Swal.fire({
                                      title: "Are you sure?",
                                      text: `You want to permanently delete ${user?.userDetails?.companyName || user?.userDetails?.name}`,
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonText: "Yes, delete",
                                      cancelButtonText: "Cancel",
                                      confirmButtonColor: "#dc3545",
                                      cancelButtonColor: "#6c757d",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        deleteAction(user?.userDetails?._id)
                                      }
                                    });
                                  }}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-data-message">
                      <i className="fa fa-users"></i>
                      <h3>No Users Found</h3>
                      <p>Get started by adding your first user</p>
                      <a className="btn-add-user" href="add-user">
                        <i className="fa fa-plus"></i> Add New User
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserAccess;