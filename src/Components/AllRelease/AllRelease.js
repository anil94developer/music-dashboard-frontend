import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import OneReleaseController from '../../Controllers/One-release-controller/OneReleaseController';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import * as XLSX from 'xlsx';
import DataTable from '../Common/DataTable/DataTable';
import { Box, Button, Modal, Typography } from '@mui/material';
import Loader from '../Common/Loader';
import { useUserProfile } from '../../Context/UserProfileContext';

export const AllRelease = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserProfile()

  const { previusPage, startIndex, search, setSearch, limit, setLimit,
    currentPage, nextPage, totalPages, setType, setTitle, handleSubmit, myRelease, moreAction, deleteAction, isLoading, myTracks, setMyTracks, exportTableToExcel, } = OneReleaseController();

  const columns = [
    { field: 'id', headerName: '#', headerClassName: 'black-header' },
    { field: '_id', headerName: 'Id', headerClassName: 'black-header' },
    { field: 'type', headerName: 'Type', headerClassName: 'black-header' },
    { field: 'status', headerName: 'Status', headerClassName: 'black-header' },
    { field: 'title', headerName: 'Title / Artist', headerClassName: 'black-header' },
    { field: 'label', headerName: 'Label', headerClassName: 'black-header' },
    { field: 'releaseDate', headerName: 'Release date / Hour / Time zone', headerClassName: 'black-header', width: 150 },
    { field: 'noOfTrack', headerName: '# of track', headerClassName: 'black-header' },
    { field: 'upcCatalogNumber', headerName: 'UPC / Catalog Number', headerClassName: 'black-header', width: 150 },
    { field: 'deliveredTerritories', headerName: 'Delivered Territories & Stores  ', headerClassName: 'black-header' },
    {
      field: 'action', headerName: 'Action',
      renderCell: (params) => (
        <div style={{ gap: '8px' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigate("/release-details", { state: { releaseId: params.row._id } });
            }}
          >
            More
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              exportTableToExcel('example2', 'AutomaticReport.xlsx')

            }}
          >
            Download
          </Button>
        </div>
      )
    }
  ];
  { console.log("item----------------", myRelease) }





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
          <section className="content">
            <div className="page-heading">
              <h1>All Release</h1>
            </div>
            {/* <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-body"> */}
            {/* <DataTable
                      columns={columns}
                      rows={myRelease}
                      height="500"
                      width="100%"
                    /> */}
            <div className="row status-steps">
              <div className="col-lg-1 col-md-6 col-12">
                <div className="form-group">
                  <div
                    style={{
                      display: 'flex', // Ensure the container is a flex container
                      flexDirection: 'row', // Align items in a row
                      gap: '10px', // Add space between items
                      alignItems: 'center', // Align items vertically centered
                    }}
                  >
                    {/* Dropdown */}
                    <select
                      value={limit}
                      id="limit"
                      className="form-select form-control"
                      style={{ flex: '1' }} // Ensure the dropdown takes most of the space
                      onChange={(e) => setLimit(e.target.value)}
                    >
                      <option value={10}>10</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>


                    </select>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 col-12">
                <div className="form-group" >
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
                    <th >Title / Artist</th>
                    <th >Type</th>
                    <th >Status</th>
                    <th >Image</th>
                    <th >Label</th>
                    <th ># of track</th>
                    <th >UPC / Catalog Number</th>
                    <th >Client Number</th>
                    {userProfile?.role === "Admin" && <th >ACTION</th> }
                  </tr>
                </thead>
                {
                  isLoading ?
                    <div style={{ position: 'absolute', top: '50%', left: '50%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Loader />
                    </div>
                    :
                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                      {myRelease.map((item, index) => (
                        <tr className="odd">
                          <td className="  sorting_1">
                            <a onClick={() => {
                              navigate("/release-details", { state: { releaseId: item._id } });
                            }}>
                              <div>
                                <span style={{ color: '#0080ff' }}>{item.title}</span>
                              </div>
                            </a>
                            {item.step1.primaryArtist[0].name}
                          </td>
                          <td className="  ">{item.type}</td>
                          <td  >
                            {item.status === 'Pending' && (
                              <img className="img-fluid" src={require('../../assets/images/pending.png')} style={{ height: 40, width: 40 }} />
                            )}

                            {item.status === 'Submit' && (
                              <img className="img-fluid" src={require('../../assets/images/submit.png')} style={{ height: 40, width: 40 }} />
                            )}

                            {item.status === 'Approve' && (
                              <img className="img-fluid" src={require('../../assets/images/approve.png')} style={{ height: 40, width: 40 }} />
                            )}

                            {item.status === 'Reject' && (
                              <img className="img-fluid" src={require('../../assets/images/reject.png')} style={{ height: 40, width: 40 }} />
                            )}
                          </td>
                          <td  ><a href={item?.step1?.coverImage} target={'_blank'}><img src={item?.step1?.coverImage} height={50} width={50} /></a>

                          </td>
                          <td className="  ">{item?.step1?.labelName}</td>
                          {/* <td className="  ">{item.step1?.originalReleaseDate}</td> */}
                          <td className="  ">{Array.isArray(item?.step3) ? item.step3.length : 0}</td>
                          <td className="  ">{item.step1?.UPCEAN}</td>
                          <td className="  ">{item.clientNumber}</td>
                          {userProfile?.role === "Admin" && 
                          <td className="  ">
                            
                              <button className="action-button">
                                <a onClick={() => moreAction(item)}>
                                  <i className="fa fa-pencil"></i>
                                </a>
                              </button>
                            
                          </td>}
                        </tr>
                      ))}
                    </tbody>
                }
              </table>
            </div>
            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <button
                onClick={() => previusPage()}
                disabled={currentPage === 1}
                style={{ marginRight: "10px", padding: "5px 10px" }}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => nextPage()}
                disabled={currentPage === totalPages}
                style={{ marginLeft: "10px", padding: "5px 10px" }}
              >
                Next
              </button>
            </div>

            {/* </div> */}

            {/* </div>
              </div>
            </div> */}
          </section>
        </div>
      </div >
    </div >
  );
};