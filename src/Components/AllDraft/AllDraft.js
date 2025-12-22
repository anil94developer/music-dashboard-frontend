import React from 'react'
import { useNavigate } from 'react-router-dom';
import OneReleaseController from '../../Controllers/One-release-controller/OneReleaseController';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import * as XLSX from 'xlsx';
import { Box, Button, Modal, Typography } from '@mui/material';
import DataTable from '../Common/DataTable/DataTable';
import Swal from 'sweetalert2';
import { useUserProfile } from '../../Context/UserProfileContext';

export const AllDraft = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();
  const { previusPage, startIndex, search, setSearch, limit, setLimit,
    currentPage, nextPage, totalPages, myReleaseDraft, moreAction, deleteAction, isLoading } = OneReleaseController();

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
              <h1 >Draft Releases</h1>
            </div>
            <div className="box-body">
              <div className="row status-steps">
                <div className="col-lg-1 col-md-6 col-12">
                  <div className="form-group">
                    <select
                      value={limit}
                      id="limit"
                      className="form-select form-control"
                      onChange={(e) => setLimit(e.target.value)}
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
                      <th>Title / Artist</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Label</th>
                      <th>Image</th>
                      <th>Release date / Hour / Time zone</th>
                      <th># of track</th>
                      <th>UPC / Catalog Number</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myReleaseDraft?.map((item) => (
                      <tr key={item._id} className="odd">
                        <td>
                          <a onClick={() => navigate("/release-details", { state: { releaseId: item._id } })}>
                            <span style={{ color: '#0080ff' }}>{item?.title}</span>
                          </a>
                          <br/>
                          {item?.step1?.primaryArtist[0]?.name}
                        </td>
                        <td>{item?.type}</td>
                        <td>
                          <img className="img-fluid" src={require(`../../assets/images/${item.status.toLowerCase()}.png`)} style={{ height: 40, width: 40 }} />
                        </td>
                        <td>{item?.step1?.labelName}</td>
                        <td>
                          <a href={item?.step1?.coverImage} target={'_top'}>
                            <img src={item?.step1?.coverImage} height={50} width={50} />
                          </a>
                        </td>
                        <td>{item.step1?.originalReleaseDate}</td>
                        <td>{Array.isArray(item?.step3) ? item.step3.length : 0}</td>
                        <td>{item.step1?.UPCEAN}</td>
                        <td>
                          <div className="action-buttons d-flex">
                            <button title="Edit" className="action-button">
                              <a onClick={() => moreAction(item)}>
                                <i className="fa fa-pencil"></i>
                              </a>
                            </button>
                            <button title='Delete' className='action-button'>
                              <a onClick={() => {
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: `You want to delete ${item.title}`,
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, proceed",
                                  cancelButtonText: "No, cancel",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteAction(item);
                                  }
                                });
                              }}>
                                <i className='fa fa-trash'></i>
                              </a>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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
            </div>
            {isLoading && "Loading..."}


          </section>
        </div>
      </div>
    </div>
  );
};
