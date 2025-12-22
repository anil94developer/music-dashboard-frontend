import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base } from "../../Constants/Data.constant";
import { getData, postData } from "../../Services/Ops";
import { Nav } from "../Common/Nav";
import "./styles.css";

const AllTranscations = (props) => {
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
    let result = await getData(base.getWithdrawList);
    console.log("my user list=========>", result.data)
    setUsers(result.data)
  }
  const handle_change_status = async (status, id) => {
    try {
      let body = {
        "status": status,
        "id": id
      }
      let result = await postData(base.withdrawStatus, body)
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
  return (
    <div>
      <Nav />
      <div className="content-wrapper">
        <section className="content">

          <div className="content">
            <h1>All Transcations Management</h1>

            {/* Filters */}
            <div className="filters">
              <input
                type="text"
                placeholder="Search by login or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* <a href="add-user"> <button className="add-user-button">Add a new user</button></a> */}
            </div>

            {/* User List */}
            <table className="user-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {users && users?.map((user) => {
                  let bg = user.is_deleted == 1 ? 'red' : 'white';
                  return (
                    <tr style={{ backgroundColor: `${bg}` }} key={user._id}>
                      <td>{user._doc.amount}</td>
                      <td>{user.userdetails.email}</td>
                      <td>{user.userdetails.role}</td>
                      <td>{user._doc.status}</td>
                       
                        {/* <select defaultValue={user._doc.status} onChange={(e) => { handle_change_status(e.target.value, user._doc._id) }}>
                          <option value={'Pending'}>{'Pending'}</option>
                          <option value={'Active'}>{'Active'}</option>
                          <option value={'Complete'}>{'Complete'}</option>

                        </select> */}
                        {/* <button className="action-button edit" onClick={()=>{navigate("/edit-permission",{ state: { userData: user} });}}>Edit</button> */}
                      {/* <button
                          className="action-button delete"
                          onClick={() => handleDelete(user.login)}
                        >
                          Delete
                        </button> */}
                        {/* <button className="action-button disable">Disable</button>   */}
                        {/* {user.is_deleted == '0' && <button  onClick={() => user_delete(user._id)} className="action-button disable">Disable</button> } */}
                       
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllTranscations;
