import React from 'react'
import { useNavigate } from 'react-router-dom';
import OneReleaseController from '../../Controllers/One-release-controller/OneReleaseController';
import { Nav } from '../Common/Nav'
import { SideBar } from '../Common/SideBar'
import * as XLSX from 'xlsx';
import { useUserProfile } from '../../Context/UserProfileContext';

export const OneRelease = () => {
const navigate = useNavigate();
const { userProfile } = useUserProfile();
const { setType, setTitle, handleSubmit, myRelease, moreAction, isLoading, myTracks, setMyTracks } = OneReleaseController();

const getMainContentClass = () => {
  if (userProfile?.role === "Admin") return "main-cotent admin-main-content";
  if (userProfile?.role === "company") return "main-cotent company-main-content";
  if (userProfile?.role === "employee") return "main-cotent employee-main-content";
  return "main-cotent";
};

function exportTableToExcel(tableId, fileName = 'TableData.xlsx') {
// Get the table element by ID
const table = document.getElementById(tableId);
if (!table) {
console.error(`Table with ID ${tableId} not found.`);
return;
}
// Convert table to a worksheet
const worksheet = XLSX.utils.table_to_sheet(table);
// Create a new workbook and add the worksheet to it
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
// Export the workbook to an Excel file
XLSX.writeFile(workbook, fileName);
}
return (
<div>
  <SideBar/>
  <div className={getMainContentClass()}>
    <Nav />
    <div className="content-main">
      <div className="page-heading">
        <h1>One Release</h1>
      </div>
      <section className="content">
        <div className="dash-detail dash-detail-two new-release">
          <div className="new-release-header">
          <h2>New Release</h2>
            <p className="subtitle">What is the type of your new release?</p>
          </div>
          <div className="form-main">
            <div className="radio-group-container">
              <div className="form-check form-check-inline radio-option">
                <input className="form-check-input" type="radio" name="type" id="typeAudio" value="Audio" defaultChecked onChange={(e) => setType(e.target.value)}/>
                <label className="form-check-label" htmlFor="typeAudio">
                  <span className="radio-custom"></span>
                  <span className="radio-text">Audio</span>
                </label>
              </div>
              <div className="form-check form-check-inline radio-option">
                <input className="form-check-input" type="radio" name="type" id="typeRingtone" value="Ringtone" onChange={(e) => setType(e.target.value)}/>
                <label className="form-check-label" htmlFor="typeRingtone">
                  <span className="radio-custom"></span>
                  <span className="radio-text">Ringtone</span>
                </label>
            </div>
            </div>
            <div className="form-group release-title-group">
              <label htmlFor="releaseTitle" className="form-label">
                Release Title <span className="required-star">*</span>
              </label>
              <input 
                type="text" 
                className="form-control release-title-input" 
                id="releaseTitle" 
                placeholder="Enter Release Title" 
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="Submit-btn">
              <button type="submit" id="btnSubmit" className="btn btn-primary submit-button" onClick={() => { handleSubmit() }}>
                <span>Create Release</span>
                <i className="fa fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>
);
};