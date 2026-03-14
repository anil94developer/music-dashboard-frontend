import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Nav } from '../Common/Nav';
import { SideBar } from '../Common/SideBar';
import { postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';

export default function UserCompleteDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserDetails();
    } else {
      Swal.fire("Error", "User ID not provided", "error");
      navigate("/UserManagement");
    }
  }, [userId]);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const result = await postData(base.getUser, { userId: userId });
      console.log("User details result:", result);
      
      if (result?.data?.status === true && result?.data?.data) {
        setUserDetails(result.data.data);
      } else if (result?.status === true && result?.data) {
        setUserDetails(result.data);
      } else {
        Swal.fire("Error", "Failed to fetch user details", "error");
        navigate("/UserManagement");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Swal.fire("Error", "Failed to fetch user details", "error");
      navigate("/UserManagement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <SideBar />
      <div className="main-cotent">
        <Nav />
        <div className="content-wrapper">
          <div className="content">
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, color: '#1976d2' }}>
                <i className="fa fa-user-circle" style={{ marginRight: '10px' }}></i>
                Complete User Details
              </h1>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/UserManagement")}
                style={{ minWidth: '120px' }}
              >
                <i className="fa fa-arrow-left" style={{ marginRight: '8px' }}></i>
                Back
              </Button>
            </div>

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <Typography variant="h6" color="textSecondary">
                  <i className="fa fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                  Loading user details...
                </Typography>
              </Box>
            ) : userDetails ? (
              <div style={{ marginTop: '20px' }}>
                <TableContainer component={Paper} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ width: '30%', fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>User ID:</TableCell>
                        <TableCell style={{ fontSize: '15px' }}>{userDetails._id || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Name:</TableCell>
                        <TableCell style={{ fontSize: '15px' }}>{userDetails.name || userDetails.first_name || userDetails.companyName || "N/A"}</TableCell>
                      </TableRow>
                      {userDetails.firstName && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>First Name:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.firstName}</TableCell>
                        </TableRow>
                      )}
                      {userDetails.lastName && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Last Name:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.lastName}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Email:</TableCell>
                        <TableCell style={{ fontSize: '15px' }}>{userDetails.email || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Phone Number:</TableCell>
                        <TableCell style={{ fontSize: '15px' }}>{userDetails.phoneNumber || userDetails.phone || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Company Name:</TableCell>
                        <TableCell style={{ fontSize: '15px' }}>{userDetails.companyName || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Role:</TableCell>
                        <TableCell>
                          <span
                            style={{
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              backgroundColor: '#2196f3',
                              color: 'white',
                              textTransform: 'uppercase'
                            }}
                          >
                            {userDetails.role || "N/A"}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Wallet Balance:</TableCell>
                        <TableCell>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
                            ₹{userDetails.wallet || 0}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Registration Date:</TableCell>
                        <TableCell>
                          <span style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '15px' }}>
                            {formatDate(userDetails.createdAt || userDetails.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                      {userDetails.address && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Address:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.address}</TableCell>
                        </TableRow>
                      )}
                      {userDetails.city && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>City:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.city}</TableCell>
                        </TableRow>
                      )}
                      {userDetails.country && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Country:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.country}</TableCell>
                        </TableRow>
                      )}
                      {userDetails.postalCode && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Postal Code:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.postalCode}</TableCell>
                        </TableRow>
                      )}
                      {userDetails.panNo && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>PAN Number:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.panNo}</TableCell>
                        </TableRow>
                      )}
                      {userDetails.aadharNo && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Aadhar Number:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{userDetails.aadharNo}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Status:</TableCell>
                        <TableCell>
                          <span
                            style={{
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              backgroundColor: userDetails.is_deleted == 1 ? '#f44336' : '#4caf50',
                              color: 'white'
                            }}
                          >
                            {userDetails.is_deleted == 1 ? "DeActive" : "Active"}
                          </span>
                        </TableCell>
                      </TableRow>
                      {userDetails.updatedAt && (
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '15px' }}>Last Updated:</TableCell>
                          <TableCell style={{ fontSize: '15px' }}>{formatDate(userDetails.updatedAt)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <Typography variant="h6" color="error">
                  No user details found
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

