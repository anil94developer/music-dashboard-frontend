import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import "./styles.css";
import { Button } from '@mui/material';
import DataTable from "../Common/DataTable/DataTable";

const UserManagement = (props) => {
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
    try {
      let result = await getData(base.userList);
      console.log("my user list=========>", result.data)
      const resultList = Array.isArray(result.data?.data || result.data)
        ? (result.data?.data || result.data)
          .map((item, index) => ({
            _id: item._id,
            id: index + 1,
            name: item.name || item.first_name || item.companyName || "N/A",
            email: item.email || "N/A",
            wallet: item.wallet || 0,
            status: item.is_deleted == 1 ? "DeActive" : "Active",
            role: item.role || "N/A",
            phoneNumber: item.phoneNumber || item.phone || "N/A",
            companyName: item.companyName || "N/A",
            createdAt: item.createdAt || item.created_at || "N/A",
            action: "",
          }))
        : [];
      setUsers(resultList)
    } catch (error) {
      console.error("Error fetching user list:", error);
      Swal.fire("Error", "Failed to fetch user list", "error");
    }
  }

  const onDetails = (id) => {
    navigate("/UserDetails", { state: { userId: id } });
  }

  const user_delete = async (userId, status) => {
    try {
      let body = {
        "userId": userId,
        "status": status === 1 ? 0 : 1
      }
      let result = await postData(base.deleteUser, body)
      if (result.data.status === true) {
        Swal.fire("Success", result.data.message, "success");
        getUserList();
      } else {
        Swal.fire("Error", result.data.message, "error");
      }
    } catch (error) {
      console.error("Error Submitting form:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  }

  const columns = [
    { field: 'id', headerName: '#', headerClassName: 'black-header', width: 50 },
    { field: 'name', headerName: 'Name', headerClassName: 'black-header', width: 150 },
    { field: 'email', headerName: 'Email', headerClassName: 'black-header', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone', headerClassName: 'black-header', width: 120 },
    { field: 'companyName', headerName: 'Company', headerClassName: 'black-header', width: 150 },
    { field: 'role', headerName: 'Role', headerClassName: 'black-header', width: 100 },
    { field: 'wallet', headerName: 'Wallet', headerClassName: 'black-header', width: 100 },
    { field: 'status', headerName: 'Status', headerClassName: 'black-header', width: 100 },
    {
      field: 'action', headerName: 'Actions', width: 450,
      renderCell: (params) => (
        <div style={{ gap: '8px', display: 'flex', padding: 10, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigate("/UserCompleteDetails", { state: { userId: params.row._id } });
            }}
            style={{ 
              fontSize: '12px', 
              padding: '6px 12px',
              fontWeight: 'bold',
              minWidth: '140px'
            }}
          >
            <i className="fa fa-user-circle" style={{ marginRight: '6px' }}></i>
            User Details
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => {
              navigate("/UserMembershipDetails", { state: { userId: params.row._id } });
            }}
            style={{ 
              fontSize: '12px', 
              padding: '6px 12px',
              fontWeight: 'bold',
              minWidth: '160px'
            }}
          >
            <i className="fa fa-id-card" style={{ marginRight: '6px' }}></i>
            Membership Info
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => {
              user_delete(params.row._id, params.row.status);
            }}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            {params.row.status === "Active" ? "Disable" : "Enable"}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <Nav />
      <div className="content-wrapper">
        <section className="content">
          <div className="content">
            <h1>User Management</h1>

            {/* Filters */}
            <div className="filters">
              <a href="add-user"> <button className="add-user-button">Add Master Account</button></a>
            </div>

            <DataTable
              columns={columns}
              rows={users}
              height="500"
              width="100%"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserManagement;
