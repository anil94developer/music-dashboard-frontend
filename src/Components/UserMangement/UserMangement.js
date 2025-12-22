import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import "./styles.css";
import { Box, Button, Modal, Typography } from '@mui/material';
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
    let result = await getData(base.userList);
    console.log("my user list=========>", result.data)
    const resultList = Array.isArray(result.data)
      ? result.data
        // .filter((item) => item.status === 'Pending') // Filter items with status 'Pending'
        .map((item, index) => ({
          _id: item._id,
          id: index + 1,
          name: item.name,
          email: item.email,
          wallet: item.wallet,
          status: item.is_deleted == 1 ? "DeActive" : "Active",
          action: "",
        }))
      : [];
    setUsers(resultList)
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
    { field: '_id', headerName: 'Id', headerClassName: 'black-header', width: 250 },
    { field: 'name', headerName: 'Name', headerClassName: 'black-header', width: 100 },
    { field: 'email', headerName: 'EMAIL', headerClassName: 'black-header', width: 100 },
    { field: 'wallet', headerName: 'WALLET', headerClassName: 'black-header', width: 150 },
    { field: 'status', headerName: 'STATUS', headerClassName: 'black-header', width: 150 },
    {
      field: 'action', headerName: 'ACTION', width: 300,
      renderCell: (params) => (
        <div style={{ gap: '8px', display: 'flex', padding: 10 }}>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => {
              user_delete(params.row._id, params.row.status);
            }}
          >
            Disable
          </Button>
          {/* <Button
          variant="contained"
          color="secondary" // Corrected the color to "secondary"
          size="small"
          onClick={() => {
            handle_change_status("Reject", params.row._id);
          }}
        >
          Reject
        </Button> */}
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
            {/* User List */}
            {/* <table id="example2" className="table table-bordered table-hover dataTable" aria-describedby="example2_info">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Wallet</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users?.map((user) => {
                  let bg = user.is_deleted == 1 ? 'red' : 'white';
                  return (
                    <tr style={{ backgroundColor: `${bg}` }} key={user._id}>
                      <td>{user.role}</td>
                      <td><a onClick={() => { onDetails(user._id) }}>{user.email}</a></td>
                      <td>{user.wallet}</td>
                      <td>{user.is_active}</td>
                      <td>
                        {/* <button className="action-button edit" onClick={()=>{navigate("/edit-permission",{ state: { userData: user} });}}>Edit</button> */}
            {/* <button
                          className="action-button delete"
                          onClick={() => handleDelete(user.login)}
                        >
                          Delete
                        </button>
                        <button className="action-button disable">Disable</button>  
                        {user.is_deleted == '0' && <button onClick={() => user_delete(user._id)} className="action-button disable">Disable</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserManagement;
