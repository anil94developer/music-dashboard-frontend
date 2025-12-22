import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import "./styles.css";
import { SideBar } from "../Common/SideBar";
import { useUserProfile } from "../../Context/UserProfileContext";

const CompanyManagement = (props) => {
  const [search, setSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState("All");
  const [permissionLevel, setPermissionLevel] = useState("All");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userProfile, setUserProfile } = useUserProfile();

  const getMainContentClass = () => {
    if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
    if (userProfile?.role === "company") return "main-cotent company-main-content";
    if (userProfile?.role === "employee") return "main-cotent employee-main-content";
    return "main-cotent";
  };

  const handleDelete = (login) => {
    setUsers(users.filter((user) => user.login !== login));
  };


  useEffect(() => {
    getUserList(currentPage, limit);
  }, [props, currentPage, limit])

  useEffect(() => {
    // Reset to page 1 when search changes
    if (search !== "") {
      setCurrentPage(1);
      getUserList(1, limit);
    }
  }, [search])

  const getUserList = async (page = 1, pageLimit = 10) => {
    setIsLoading(true);
    try {
      // Check if API supports pagination parameters
      const url = base.userList + `?page=${page}&limit=${pageLimit}&search=${search}`;
      let result = await getData(url);
    console.log("my user list=========>", result.data)
      
      if (result.data && result.data.data) {
        // If API returns paginated response
        const resultList = Array.isArray(result.data.data)
          ? result.data.data.map((item, index) => ({
              _id: item._id,
              clientNumber: item.clientNumber,
              id: (page - 1) * pageLimit + index + 1,
              name: item.name,
              email: item.email,
              wallet: item.wallet,
              status: item.is_deleted == 0 ? "Active" : "DeActive",
              action: "",
            }))
          : [];
        setUsers(resultList);
        setTotalPages(result.data.totalPages || Math.ceil((result.data.total || resultList.length) / pageLimit));
      } else {
        // Fallback: if API doesn't support pagination, handle client-side
        const allData = Array.isArray(result.data) ? result.data : [];
        const filteredData = search 
          ? allData.filter(item => 
              item.name?.toLowerCase().includes(search.toLowerCase()) ||
              item.email?.toLowerCase().includes(search.toLowerCase()) ||
              item.clientNumber?.toLowerCase().includes(search.toLowerCase())
            )
          : allData;
        
        const startIndex = (page - 1) * pageLimit;
        const endIndex = startIndex + pageLimit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        const resultList = paginatedData.map((item, index) => ({
          _id: item._id,
          clientNumber: item.clientNumber,
          id: startIndex + index + 1,
          name: item.name,
          email: item.email,
          wallet: item.wallet,
          status: item.is_deleted == 0 ? "Active" : "DeActive",
          action: "",
        }));
        
        setUsers(resultList);
        setTotalPages(Math.ceil(filteredData.length / pageLimit));
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      const nextPageNum = currentPage + 1;
      setCurrentPage(nextPageNum);
      getUserList(nextPageNum, limit);
    }
  }

  const previusPage = () => {
    if (currentPage > 1) {
      const prevPageNum = currentPage - 1;
      setCurrentPage(prevPageNum);
      getUserList(prevPageNum, limit);
    }
  }
  const user_delete = async (userId, status, userName) => {
    const newStatus = status === "DeActive" ? "Active" : "DeActive";
    const actionText = status === "DeActive" ? "activate" : "deactivate";
    
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} ${userName || 'this user'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    });

    // If user confirms, proceed with the API call
    if (result.isConfirmed) {
      // Update UI immediately - React will re-render instantly
      setUsers(prevUsers => {
        const updated = prevUsers.map(user => {
          if (user._id === userId) {
            return { 
              ...user, 
              status: newStatus 
            };
          }
          return user;
        });
        return updated;
      });

    try {
      let body = {
        "userId": userId,
          "status": status === "DeActive" ? 0 : 1
      }
        let apiResult = await postData(base.deleteUser, body)
        if (apiResult.data.status === true) {
          // Refresh immediately after status change
          // await getUserList();
          
          Swal.fire({
            title: 'Success!',
            text: apiResult.data.message || `User ${actionText}d successfully`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
      } else {
          // Revert the optimistic update if API call failed
          setUsers(prevUsers => {
            return prevUsers.map(user => {
              if (user._id === userId) {
                return { ...user, status: status };
              }
              return user;
            });
          });
          Swal.fire("Error", apiResult.data.message || "Failed to update status", "error");
      }
    } catch (error) {
        // Revert the optimistic update if API call failed
        setUsers(prevUsers => {
          return prevUsers.map(user => {
            if (user._id === userId) {
              return { ...user, status: status };
            }
            return user;
          });
        });
      console.error("Error Submitting form:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
      }
    }
  }

  const onDetails = (id) => {
    navigate("/UserDetails", { state: { userId: id } });
  }

  const handleViewPassword = () => {
    Swal.fire({
      title: 'Company Account Password',
      html: `
        <div style="text-align: center; padding: 20px;">
          <div style="margin-bottom: 20px;">
            <i class="fa fa-key" style="font-size: 48px; color: #667eea; margin-bottom: 15px;"></i>
          </div>
          <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 2px solid #667eea; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            <p style="margin: 0; font-size: 14px; color: #ffffff; font-weight: 600; margin-bottom: 8px;">Universal Password:</p>
            <p style="margin: 0; font-family: monospace; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">company123</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #666; font-style: italic;">This password works for all company accounts</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#667eea',
      width: '450px'
    });
  }

  const handleDirectLogin = async (userId, userEmail) => {
    try {
      // Show loading
      Swal.fire({
        title: 'Preparing login...',
        text: 'Opening in new window',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Fetch user details first
      const body = { userId };
      const userResult = await postData(base.getUser, body);
      
      if (userResult?.data?.status === true && userResult?.data?.data) {
        const userData = userResult.data.data;
        const email = userData.email || userEmail;
        
        // Check if user is company role
        if (userData.role === 'company') {
          // Admin can access company accounts using special password "company123"
          // This password works for ALL company accounts without being set in database
          const companyDefaultPassword = 'company123';
          
          // Try company123 password first (works for all company accounts)
          try {
            const loginBody = { email, password: companyDefaultPassword };
            const loginResponse = await postData(base.login, loginBody);
            
            if (loginResponse?.data?.status === true && loginResponse?.data?.data) {
              // Success with company123 password
              const loginData = loginResponse.data.data;
              const sessionKey = `auto_login_${Date.now()}_${userId}`;
              
              // Store login data in localStorage with unique key
              const autoLoginData = {
                token: loginData.token,
                userData: loginData,
                timestamp: Date.now()
              };
              localStorage.setItem(sessionKey, JSON.stringify(autoLoginData));
              
              // Create the login URL
              const loginUrl = `${window.location.origin}/?autoLogin=${sessionKey}`;
              
              // Close loading
              Swal.close();
              
              // Show dialog with password
              Swal.fire({
                title: 'Login Ready!',
                html: `
                  <div style="text-align: left; padding: 10px;">
                    <p><strong>User:</strong> ${userData.name || email}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <div style="margin-top: 15px; padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 5px;">
                      <p style="margin: 0; font-weight: bold; color: #2e7d32;">
                        <i class="fa fa-key" style="margin-right: 8px;"></i>Admin Access Password: <span style="font-family: monospace; font-size: 16px; color: #1b5e20;">company123</span>
                      </p>
                      <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Universal password for all company accounts (Admin only)</p>
                    </div>
                    <p style="margin-top: 15px;"><strong>Option 1 - Incognito Window:</strong></p>
                    <ol style="text-align: left; margin-left: 20px;">
                      <li>Copy the URL below</li>
                      <li>Open a new Incognito/Private window (Ctrl+Shift+N or Cmd+Shift+N)</li>
                      <li>Paste the URL in the address bar</li>
                    </ol>
                    <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                      <input type="text" id="loginUrlInput" value="${loginUrl}" readonly 
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                        onclick="this.select(); document.execCommand('copy');"
                      />
                    </div>
                    <p style="margin-top: 10px; font-size: 12px; color: #666;">
                      Click the URL above to copy it automatically
                    </p>
                  </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Open in New Tab',
                cancelButtonText: 'Close',
                confirmButtonColor: '#3085d6',
                didOpen: () => {
                  const input = document.getElementById('loginUrlInput');
                  if (input) {
                    input.addEventListener('click', function() {
                      this.select();
                      document.execCommand('copy');
                      Swal.showValidationMessage('URL copied to clipboard!');
                      setTimeout(() => Swal.hideValidationMessage(), 2000);
                    });
                  }
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  const newWindow = window.open(loginUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
                  if (!newWindow) {
                    Swal.fire("Error", "Please allow popups to open login in new window", "error");
                  }
                }
              });
              return; // Exit early since we succeeded
            }
          } catch (err) {
            // If company123 fails, continue to try other passwords
            console.log("company123 password failed, trying other passwords...");
          }
        }
        
        // Fallback: Try other default passwords if company123 didn't work or user is not company role
        const defaultPasswords = ['123456', 'password', 'Password@123', 'admin123'];
        let loginSuccess = false;
        let loginResponse = null;
        let successfulPassword = null;
        
        for (const password of defaultPasswords) {
          try {
            const loginBody = { email, password };
            loginResponse = await postData(base.login, loginBody);
            
            if (loginResponse?.data?.status === true) {
              loginSuccess = true;
              successfulPassword = password;
              break;
            }
          } catch (err) {
            continue;
          }
        }

        if (loginSuccess && loginResponse?.data?.data) {
          // Generate unique session key for new window
          const sessionKey = `auto_login_${Date.now()}_${userId}`;
          const loginData = loginResponse.data.data;
          
          // Store login data in localStorage with unique key
          const autoLoginData = {
            token: loginData.token,
            userData: loginData,
            timestamp: Date.now()
          };
          localStorage.setItem(sessionKey, JSON.stringify(autoLoginData));
          
          // Create the login URL
          const loginUrl = `${window.location.origin}/?autoLogin=${sessionKey}`;
          
          // Close loading
          Swal.close();
          
          // Show dialog with options for incognito/private window
          Swal.fire({
            title: 'Login Ready!',
            html: `
              <div style="text-align: left; padding: 10px;">
                <p><strong>User:</strong> ${userData.name || email}</p>
                <p><strong>Email:</strong> ${email}</p>
                <div style="margin-top: 15px; padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 5px;">
                  <p style="margin: 0; font-weight: bold; color: #2e7d32;">
                    <i class="fa fa-key" style="margin-right: 8px;"></i>Password: <span style="font-family: monospace; font-size: 16px; color: #1b5e20;">${successfulPassword || 'company123'}</span>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Universal password for all company accounts</p>
                </div>
                <p style="margin-top: 15px;"><strong>Option 1 - Incognito Window:</strong></p>
                <ol style="text-align: left; margin-left: 20px;">
                  <li>Copy the URL below</li>
                  <li>Open a new Incognito/Private window (Ctrl+Shift+N or Cmd+Shift+N)</li>
                  <li>Paste the URL in the address bar</li>
                </ol>
                <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                  <input type="text" id="loginUrlInput" value="${loginUrl}" readonly 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                    onclick="this.select(); document.execCommand('copy');"
                  />
                </div>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                  Click the URL above to copy it automatically
                </p>
              </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Open in New Tab',
            cancelButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            didOpen: () => {
              const input = document.getElementById('loginUrlInput');
              if (input) {
                input.addEventListener('click', function() {
                  this.select();
                  document.execCommand('copy');
                  Swal.showValidationMessage('URL copied to clipboard!');
                  setTimeout(() => Swal.hideValidationMessage(), 2000);
                });
              }
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // Open in regular new window as fallback
              const newWindow = window.open(
                loginUrl,
                '_blank',
                'width=1200,height=800,scrollbars=yes,resizable=yes'
              );
              
              if (!newWindow) {
                Swal.fire("Error", "Please allow popups to open login in new window", "error");
              }
            }
          });
        } else {
          // If login fails, still try to open with user data
          const sessionKey = `auto_login_${Date.now()}_${userId}`;
          const sessionData = {
            userId: userData._id || userId,
            email: email,
            role: userData.role || 'company',
            firstName: userData.firstName || userData.name?.split(' ')[0] || '',
            lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
            name: userData.name || '',
            clientNumber: userData.clientNumber || '',
            wallet: userData.wallet || 0,
            token: null // Will need to login properly
          };

          const autoLoginData = {
            userData: sessionData,
            userId: userId,
            email: email,
            timestamp: Date.now(),
            needsLogin: true
          };
          localStorage.setItem(sessionKey, JSON.stringify(autoLoginData));
          
          const loginUrl = `${window.location.origin}/?autoLogin=${sessionKey}`;
          
          Swal.close();
          
          // Show dialog with URL for incognito
          Swal.fire({
            title: 'Login URL Ready',
            html: `
              <div style="text-align: left; padding: 10px;">
                <p><strong>User:</strong> ${userData.name || email}</p>
                <p><strong>Email:</strong> ${email}</p>
                <div style="margin-top: 15px; padding: 12px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 5px;">
                  <p style="margin: 0; font-weight: bold; color: #2e7d32;">
                    <i class="fa fa-key" style="margin-right: 8px;"></i>Password: <span style="font-family: monospace; font-size: 16px; color: #1b5e20;">company123</span>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Universal password for all company accounts</p>
                </div>
                <p style="margin-top: 15px;"><strong>For Incognito Window:</strong></p>
                <ol style="text-align: left; margin-left: 20px;">
                  <li>Copy the URL below</li>
                  <li>Open Incognito/Private window (Ctrl+Shift+N)</li>
                  <li>Paste and press Enter</li>
                </ol>
                <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                  <input type="text" id="loginUrlInput2" value="${loginUrl}" readonly 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                    onclick="this.select(); document.execCommand('copy');"
                  />
                </div>
              </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Open in New Tab',
            cancelButtonText: 'Close',
            didOpen: () => {
              const input = document.getElementById('loginUrlInput2');
              if (input) {
                input.addEventListener('click', function() {
                  this.select();
                  document.execCommand('copy');
                  Swal.showValidationMessage('URL copied!');
                  setTimeout(() => Swal.hideValidationMessage(), 2000);
                });
              }
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const newWindow = window.open(loginUrl, '_blank', 'width=1200,height=800');
              if (!newWindow) {
                Swal.fire("Error", "Please allow popups", "error");
              }
            }
          });
        }
      } else {
        Swal.fire("Error", "Failed to fetch user data", "error");
      }
    } catch (error) {
      console.error("Error in direct login:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  }


  return (
    <div>
      <SideBar />
      <div className={getMainContentClass()}>
        <Nav />
        <div className="content-main">
          <div className="page-heading">
            <div className='row'>
              <div className="track-heading d-flex flex-wrap align-items-center justify-content-between">
                <h2>User Management</h2>
                <div className="add-track-btn">
                  <a href="AddCompany"> <button className="btn btn-primary ">Add Master Account</button></a>
                </div>
              </div>
            </div>
          </div>
          <div className="content-wrapper">
            <section className="content">
              <div className="row status-steps">
                <div className="col-lg-1 col-md-6 col-12">
                  <div className="form-group">
                    <select
                      value={limit}
                      className="form-select form-control"
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 col-12">
                  <div className="form-group">
                    <input
                      value={search}
                      type="text"
                      className="form-control"
                      placeholder="Search any name"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="box-body table-responsive">
                <table id="example2" className="table table-bordered table-striped">
                  <thead>
                    <tr role="row">
                      <th>#</th>
                      <th>Client Number</th>
                      <th>Name</th>
                      <th>EMAIL</th>
                      <th>WALLET</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody role="alert" aria-live="polite" aria-relevant="all">
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                          Loading...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((item, index) => (
                        <tr key={item._id} className="odd">
                          <td className="sorting_1">{item.id}</td>
                          <td className="">{item.clientNumber}</td>
                          <td className="">{item.name}</td>
                          <td className="">{item.email}</td>
                          <td className="">{item.wallet || '0'}</td>
                          <td className="">
                            <span style={{ 
                              color: item.status === 'Active' ? '#28a745' : '#dc3545',
                              fontWeight: 'bold'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td className="">
                            <div className="company-management-actions" style={{ gap: '8px', display: 'flex', flexWrap: 'wrap' }}>
                              <button
                                key={`${item._id}-${item.status}`}
                                className={`btn btn-sm ${item.status === "DeActive" ? "btn-success" : "btn-warning"}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  user_delete(item._id, item.status, item.name);
                                }}
                                title={item.status === "DeActive" ? "Activate User" : "Deactivate User"}
                              >
                                <i className={`fa ${item.status === "DeActive" ? "fa-check-circle" : "fa-times-circle"}`}></i>
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  handleViewPassword();
                                }}
                                title="View Password"
                                style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8', color: '#fff' }}
                              >
                                <i className="fa fa-key"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  navigate("/ReportUpload", { state: { userId: item._id } });
                                }}
                                title="View Reports"
                              >
                                <i className="fa fa-file-text"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {!isLoading && users.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center", gap: "15px" }}>
                  <button
                    onClick={previusPage}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-primary"
                    style={{ padding: "8px 15px" }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: "8px 15px", fontWeight: "bold" }}>
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages}
                    className="btn btn-sm btn-primary"
                    style={{ padding: "8px 15px" }}
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CompanyManagement;
