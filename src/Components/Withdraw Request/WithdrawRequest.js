import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import "./styles.css";
import { SideBar } from "../Common/SideBar";
import { useUserProfile } from "../../Context/UserProfileContext";

const WithdrawRequest = (props) => {
  const { userProfile } = useUserProfile();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [withdrawalRequest, setWithdrawalRequest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // const handleDelete = (login) => {
  //   setUsers(users.filter((user) => user.login !== login));
  // };


  useEffect(() => {
    getWithdrawListList(currentPage, limit);
  }, [props, currentPage, limit])

  useEffect(() => {
    if (search !== "") {
      setCurrentPage(1);
      getWithdrawListList(1, limit);
    }
  }, [search])

  const getWithdrawListList = async (page = 1, pageLimit = 10) => {
    setIsLoading(true);
    try {
      const url = base.getWithdrawList + `?page=${page}&limit=${pageLimit}&search=${search}`;
      let result = await getData(url);
      console.log("getWithdrawList list=========>", result.data)
      
      if (result.data && result.data.data) {
        const resultList = Array.isArray(result.data.data)
          ? result.data.data.map((item, index) => ({
              _id: item._doc?._id || item._id,
              id: (page - 1) * pageLimit + index + 1,
              amount: item._doc?.amount || item.amount,
              email: item.userdetails?.email || item.email,
              status: item._doc?.status || item.status,
              action: "",
            }))
          : [];
        setWithdrawalRequest(resultList);
        setTotalPages(result.data.totalPages || Math.ceil((result.data.total || resultList.length) / pageLimit));
      } else {
        const allData = Array.isArray(result.data) ? result.data : [];
        const filteredData = search 
          ? allData.filter(item => {
              const email = item.userdetails?.email || item.email || '';
              const amount = item._doc?.amount || item.amount || '';
              return email.toLowerCase().includes(search.toLowerCase()) ||
                     amount.toString().includes(search);
            })
          : allData;
        
        const startIndex = (page - 1) * pageLimit;
        const endIndex = startIndex + pageLimit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        const resultList = paginatedData.map((item, index) => ({
          _id: item._doc?._id || item._id,
          id: startIndex + index + 1,
          amount: item._doc?.amount || item.amount,
          email: item.userdetails?.email || item.email,
          status: item._doc?.status || item.status,
          action: "",
        }));
        
        setWithdrawalRequest(resultList);
        setTotalPages(Math.ceil(filteredData.length / pageLimit));
      }
    } catch (error) {
      console.error("Error fetching withdrawal list:", error);
      setWithdrawalRequest([]);
    } finally {
      setIsLoading(false);
    }
  }
  const handle_change_status = async (status, id, amount) => {
    const statusText = status === "Complete" ? "complete" : "reject";
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${statusText} withdrawal request of €${amount || 'N/A'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: status === "Complete" ? '#28a745' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${statusText} it!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Optimistically update UI
      setWithdrawalRequest(prevRequests => 
        prevRequests.map(request => 
          request._id === id 
            ? { ...request, status: status }
            : request
        )
      );

      try {
        let body = {
          "status": status,
          "id": id
        }
        let apiResult = await postData(base.withdrawStatus, body)
        if (apiResult.data.status === true) {
          Swal.fire({
            title: 'Success!',
            text: apiResult.data.message || `Withdrawal request ${statusText}ed successfully`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          // Refresh list
          await getWithdrawListList(currentPage, limit);
        } else {
          // Revert optimistic update
          setWithdrawalRequest(prevRequests => 
            prevRequests.map(request => 
              request._id === id 
                ? { ...request, status: request.status }
                : request
            )
          );
          Swal.fire("Error", apiResult.data.message || "Failed to update status", "error");
        }
      } catch (error) {
        // Revert optimistic update
        setWithdrawalRequest(prevRequests => 
          prevRequests.map(request => 
            request._id === id 
              ? { ...request, status: request.status }
              : request
          )
        );
        console.error("Error Submitting form:", error);
        Swal.fire("Error", "Something went wrong. Please try again later.", "error");
      }
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      const nextPageNum = currentPage + 1;
      setCurrentPage(nextPageNum);
      getWithdrawListList(nextPageNum, limit);
    }
  }

  const previusPage = () => {
    if (currentPage > 1) {
      const prevPageNum = currentPage - 1;
      setCurrentPage(prevPageNum);
      getWithdrawListList(prevPageNum, limit);
    }
  }

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'complete':
      case 'completed':
        return 'status-badge status-complete';
      case 'reject':
      case 'rejected':
        return 'status-badge status-rejected';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge status-default';
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
          <div className="page-heading">
            <div className='row'>
              <div className="track-heading d-flex flex-wrap align-items-center justify-content-between">
                <h2>Withdraw Request Management</h2>
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
                      placeholder="Search by email or amount"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-2 col-md-6 col-12">
                  <div className="form-group">
                    <select
                      value={statusFilter}
                      className="form-select form-control"
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Complete">Complete</option>
                      <option value="Reject">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="box-body table-responsive">
                <table id="example2" className="table table-bordered table-striped">
                  <thead>
                    <tr role="row">
                      <th>#</th>
                      <th>Amount</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody role="alert" aria-live="polite" aria-relevant="all">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          Loading...
                        </td>
                      </tr>
                    ) : withdrawalRequest.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          No withdrawal requests found
                        </td>
                      </tr>
                    ) : (
                      withdrawalRequest
                        .filter((item) => {
                          if (statusFilter === "All") return true;
                          return item.status?.toLowerCase() === statusFilter.toLowerCase();
                        })
                        .map((item, index) => (
                          <tr key={item._id} className="odd">
                            <td className="sorting_1">{item.id}</td>
                            <td className="">
                              <strong style={{ color: '#667eea', fontSize: '16px' }}>
                                €{item.amount || '0.00'}
                              </strong>
                            </td>
                            <td className="">{item.email || 'N/A'}</td>
                            <td className="">
                              <span className={getStatusBadgeClass(item.status)}>
                                {item.status || 'Pending'}
                              </span>
                            </td>
                            <td className="">
                              <div style={{ gap: '8px', display: 'flex', flexWrap: 'wrap' }}>
                                {item.status?.toLowerCase() !== 'complete' && item.status?.toLowerCase() !== 'completed' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handle_change_status("Complete", item._id, item.amount);
                                    }}
                                    title="Complete Request"
                                  >
                                    <i className="fa fa-check-circle"></i>
                                  </button>
                                )}
                                {item.status?.toLowerCase() !== 'reject' && item.status?.toLowerCase() !== 'rejected' && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handle_change_status("Reject", item._id, item.amount);
                                    }}
                                    title="Reject Request"
                                  >
                                    <i className="fa fa-times-circle"></i>
                                  </button>
                                )}
                                {item.status?.toLowerCase() === 'complete' || item.status?.toLowerCase() === 'completed' ? (
                                  <span className="badge bg-success">Completed</span>
                                ) : item.status?.toLowerCase() === 'reject' || item.status?.toLowerCase() === 'rejected' ? (
                                  <span className="badge bg-danger">Rejected</span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {!isLoading && withdrawalRequest.length > 0 && (
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

export default WithdrawRequest;
