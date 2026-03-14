import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Nav } from '../Common/Nav';
import { SideBar } from '../Common/SideBar';
import { getData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';

export default function UserMembershipDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  
  const [activeMembership, setActiveMembership] = useState(null);
  const [membershipHistory, setMembershipHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getMembershipDetails();
    } else {
      Swal.fire("Error", "User ID not provided", "error");
      navigate("/UserManagement");
    }
  }, [userId]);

  const getMembershipDetails = async () => {
    try {
      setLoading(true);
      const result = await getData(`${base.userMemberships || 'admin/user-memberships'}?userId=${userId}`);
      console.log("Membership result:", result);
      
      if (result?.data?.status === true && result?.data?.data) {
        const active = result.data.data.activeMembership || null;
        setActiveMembership(active);
        const allMemberships = result.data.data.allMemberships || result.data.data || [];
        setMembershipHistory(Array.isArray(allMemberships) ? allMemberships : []);
      } else if (result?.status === true && result?.data) {
        const active = result.data.activeMembership || null;
        setActiveMembership(active);
        const allMemberships = result.data.allMemberships || result.data || [];
        setMembershipHistory(Array.isArray(allMemberships) ? allMemberships : []);
      } else {
        setActiveMembership(null);
        setMembershipHistory([]);
      }
    } catch (error) {
      console.error("Error fetching membership:", error);
      setActiveMembership(null);
      setMembershipHistory([]);
      Swal.fire("Error", "Failed to fetch membership information", "error");
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
                <i className="fa fa-id-card" style={{ marginRight: '10px' }}></i>
                Membership Details
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
                  Loading membership details...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Current/Active Membership */}
                {activeMembership ? (
                  <div style={{ marginBottom: '30px' }}>
                    <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#1976d2' }}>
                      <i className="fa fa-check-circle" style={{ marginRight: '10px' }}></i>
                      Current Active Membership
                    </Typography>
                    <TableContainer component={Paper} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: '#e3f2fd', border: '2px solid #1976d2' }}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ width: '30%', fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Membership Plan:</TableCell>
                            <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>
                              {activeMembership.membershipId?.name || activeMembership.membershipName || "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Purchase Date:</TableCell>
                            <TableCell style={{ fontSize: '15px' }}>{formatDate(activeMembership.purchaseDate)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Expiry Date:</TableCell>
                            <TableCell>
                              <span style={{ 
                                fontSize: '15px',
                                color: new Date(activeMembership.expiryDate) > new Date() ? '#4caf50' : '#f44336',
                                fontWeight: 'bold'
                              }}>
                                {formatDate(activeMembership.expiryDate)}
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Status:</TableCell>
                            <TableCell>
                              <span
                                style={{
                                  padding: '6px 16px',
                                  borderRadius: '20px',
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  backgroundColor: '#4caf50',
                                  color: 'white'
                                }}
                              >
                                ACTIVE
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Price:</TableCell>
                            <TableCell>
                              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
                                ₹{activeMembership.membershipId?.price || activeMembership.price || "0"}
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Duration:</TableCell>
                            <TableCell style={{ fontSize: '15px' }}>
                              {activeMembership.membershipId?.duration || activeMembership.duration || "N/A"} {activeMembership.membershipId?.durationType || "months"}
                            </TableCell>
                          </TableRow>
                          {activeMembership.membershipId?.description && (
                            <TableRow>
                              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#bbdefb', fontSize: '15px' }}>Description:</TableCell>
                              <TableCell style={{ fontSize: '15px' }}>{activeMembership.membershipId.description}</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ) : (
                  <Box style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '2px solid #ff9800' }}>
                    <Typography variant="h6" style={{ textAlign: 'center', color: '#ff9800', fontWeight: 'bold' }}>
                      <i className="fa fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                      No active membership found for this user.
                    </Typography>
                  </Box>
                )}

                {/* Membership History */}
                {membershipHistory.length > 0 && (
                  <div>
                    <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#1976d2' }}>
                      <i className="fa fa-history" style={{ marginRight: '10px' }}></i>
                      All Membership History
                    </Typography>
                    <TableContainer component={Paper} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      <Table>
                        <TableHead>
                          <TableRow style={{ backgroundColor: '#1976d2' }}>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>#</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Membership Plan</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Purchase Date</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Expiry Date</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Status</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Price</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Duration</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {membershipHistory.map((membership, index) => (
                            <TableRow key={membership._id || index} hover>
                              <TableCell style={{ fontSize: '14px' }}>{index + 1}</TableCell>
                              <TableCell style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                {membership.membershipId?.name || membership.membershipName || "N/A"}
                              </TableCell>
                              <TableCell style={{ fontSize: '14px' }}>{formatDate(membership.purchaseDate)}</TableCell>
                              <TableCell style={{ fontSize: '14px' }}>{formatDate(membership.expiryDate)}</TableCell>
                              <TableCell>
                                <span
                                  style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    backgroundColor:
                                      membership.status === 'active' ? '#4caf50' :
                                      membership.status === 'expired' ? '#f44336' :
                                      '#ff9800',
                                    color: 'white'
                                  }}
                                >
                                  {membership.status?.toUpperCase() || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell style={{ fontSize: '14px', fontWeight: 'bold', color: '#4caf50' }}>
                                ₹{membership.membershipId?.price || membership.price || "0"}
                              </TableCell>
                              <TableCell style={{ fontSize: '14px' }}>
                                {membership.membershipId?.duration || membership.duration || "N/A"} {membership.membershipId?.durationType || "months"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}

                {membershipHistory.length === 0 && !activeMembership && (
                  <Box style={{ textAlign: 'center', padding: '40px' }}>
                    <Typography variant="h6" color="textSecondary">
                      No membership history found for this user.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

