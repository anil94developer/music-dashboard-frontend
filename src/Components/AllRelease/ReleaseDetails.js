import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import OneReleaseController from '../../Controllers/One-release-controller/OneReleaseController';
import { Nav } from '../Common/Nav'
import initialCountryList from '../../Enums/store.list.json';
import { SideBar } from '../Common/SideBar'
import MainStepController from '../../Controllers/One-release-controller/MainStepController';
import { base, domainUrl } from '../../Constants/Data.constant';
import { postData } from '../../Services/Ops';
import Swal from 'sweetalert2';
import { useUserProfile } from '../../Context/UserProfileContext';
import * as XLSX from 'xlsx';
import Loader from '../Common/Loader';
import moment from 'moment';

export const ReleaseDetails = () => {
  const location = useLocation();
  const releaseId = location.state?.releaseId;
  const navigate = useNavigate();
  // const { exportTableToExcel } = OneReleaseController();
  const { myRelease, setMyRelease, fetchReleaseDetails, } = MainStepController();
  const { userProfile, getPermissoin, getProfile } = useUserProfile()
  const [showModal, setShowModal] = useState(false);  // Controls modal visibility
  const [rejectionReason, setRejectionReason] = useState("");
  const [showAudioPlayerModal, setShowAudioPlayerModal] = useState(false);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  
  useEffect(() => {
    fetchReleaseDetails(releaseId)
  }, [])

  // Open audio player modal
  const openAudioPlayerModal = (file) => {
    setSelectedAudioFile({
      fileName: file.fileName,
      fileData: file.fileData,
      fileType: file.fileType || 'audio'
    });
    setShowAudioPlayerModal(true);
  };

  // Close audio player modal
  const closeAudioPlayerModal = () => {
    setShowAudioPlayerModal(false);
    setSelectedAudioFile(null);
  };

  const getLogo = (name) => {
    let item = initialCountryList.find(item => item.name == name);
    return item?.logo
  }
  const changeStatus = async (status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You Want change Status",
      icon: "info", // Options: 'warning', 'error', 'success', 'info', 'question'
      showCancelButton: true, // Enables the Cancel button
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let body = {
          id: releaseId,
          status: status,
          title: myRelease.title,
          UPCEAN: myRelease.step1.UPCEAN,
          reason: rejectionReason ? rejectionReason : "",
        }
        try {
          let result = await postData(base.releaseChangeStatus, body)
          if (result.data.status === true) {
            Swal.fire("Success", `${status} successfully`, "success");
            fetchReleaseDetails(releaseId)
          } else {
            Swal.fire("Error", result.data.message, "error");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          Swal.fire("Error", "Something went wrong. Please try again later.", "error");
        }

      } else if (result.isDismissed) {
        // User clicked the cancel button
        Swal.fire("Cancelled", "Action was cancelled.", "info");
      }
    });

  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      changeStatus("Reject", rejectionReason); // Pass rejection reason to changeStatus function
      setShowModal(false); // Close the modal after submission
      setRejectionReason(''); // Clear the input field after submission
    } else {
      alert("Please provide a reason for rejection.");
    }
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

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (urlValue, name) => {
    setIsDownloading(true);
    try {
      const response = await fetch(urlValue); // Replace with your API endpoint
      const blob = await response.blob(); // Convert the response to a Blob
      const url = window.URL.createObjectURL(blob); // Create a Blob URL

      // Create a temporary <a> element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // Remove the element after download

      // Revoke the Blob URL to free memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getLastKey = (url) => {
    // Extract the query string from the URL
    // const queryString = url?.split('?')[1]; // "v=xQRo9Iy5YHM"

    // // Split the query string into key-value pairs
    // const params = queryString?.split('&'); // ["v=xQRo9Iy5YHM"]

    // // Get the last key-value pair
    // const lastPair = params[params?.length - 1]; // "v=xQRo9Iy5YHM"

    // // Split into key and value
    // const [lastKey, lastValue] = lastPair?.split('=');
    return url;
  }

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'approve':
      case 'approved':
        return 'status-badge status-approved';
      case 'reject':
      case 'rejected':
        return 'status-badge status-rejected';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge status-default';
    }
  };

  return (
    <div>
      <SideBar />
      <div className="main-cotent">
        <Nav />
        <div className="content-main">
          <section className="content release-details-page">
            {/* Page Header */}
            <div className="release-details-header">
              <h1>Release Details</h1>
              <p className="release-details-subtitle">Complete information about this release</p>
            </div>

            {/* Release Information Card */}
            <div className="release-info-card">
              <div className="release-info-header">
                <h2>
                  <i className="fa fa-info-circle"></i> Release Information
                </h2>
                <span className={getStatusBadgeClass(myRelease?.status)}>
                  {myRelease?.status || 'N/A'}
                </span>
              </div>
              
              <div className="release-info-content">
                <div className="release-cover-section">
                  <div className="cover-image-wrapper">
                    {myRelease?.step1?.coverImage ? (
                      <img 
                        src={myRelease.step1.coverImage} 
                        alt="Cover" 
                        className="release-cover-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentElement.querySelector('.cover-placeholder-large');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {(!myRelease?.step1?.coverImage || myRelease?.step1?.coverImage === '') && (
                      <div className="cover-placeholder-large">
                        <i className="fa fa-image"></i>
                        <p>No Cover Image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="release-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-music"></i> Title
                    </span>
                    <span className="detail-value">{myRelease?.title || 'N/A'}</span>
                  </div>

                  {myRelease?.step1?.subTitle && myRelease?.step1?.subTitle !== "null" && (
                    <div className="detail-item">
                      <span className="detail-label">
                        <i className="fa fa-tag"></i> SubTitle
                      </span>
                      <span className="detail-value">{myRelease.step1.subTitle}</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-user"></i> Artists
                    </span>
                    <span className="detail-value">
                      {myRelease?.step1?.primaryArtist?.map((item, index) => (
                        <span key={index} className="artist-tag">
                          {item.name}
                          {index < myRelease.step1.primaryArtist.length - 1 && ", "}
                        </span>
                      )) || 'N/A'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-headphones"></i> Genre
                    </span>
                    <span className="detail-value">{myRelease?.step1?.genre || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-music"></i> Sub Genre
                    </span>
                    <span className="detail-value">{myRelease?.step1?.subGenre || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-building"></i> Label Name
                    </span>
                    <span className="detail-value">{myRelease?.step1?.labelName || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-compact-disc"></i> Format
                    </span>
                    <span className="detail-value format-badge">{myRelease?.step1?.format || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-copyright"></i> P Line
                    </span>
                    <span className="detail-value">{myRelease?.step1?.pline || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-copyright"></i> C Line
                    </span>
                    <span className="detail-value">{myRelease?.step1?.cline || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-calendar"></i> P Year
                    </span>
                    <span className="detail-value">{myRelease?.step1?.pYear || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-calendar"></i> C Year
                    </span>
                    <span className="detail-value">{myRelease?.step1?.cYear || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-calendar-alt"></i> Production Year
                    </span>
                    <span className="detail-value">{myRelease?.step1?.productionYear || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-barcode"></i> UPCEAN
                    </span>
                    <span className="detail-value">{myRelease?.step1?.UPCEAN || 'N/A'}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <i className="fa fa-hashtag"></i> Producer Catalogue Number
                    </span>
                    <span className="detail-value">{myRelease?.step1?.producerCatalogueNumber || 'N/A'}</span>
                  </div>

                  {myRelease?.youtubechannelLinkId && (
                    <div className="detail-item full-width">
                      <span className="detail-label">
                        <i className="fa fa-youtube"></i> OAC Certified by YouTube Link
                      </span>
                      <span className="detail-value">
                        <a href={myRelease.youtubechannelLinkId} target="_blank" rel="noopener noreferrer" className="youtube-link">
                          {myRelease.youtubechannelLinkId}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Audio / Video Files Card */}
            <div className="audio-files-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-file-audio"></i> Audio / Video Files
                </h2>
                {myRelease?.step2 && myRelease.step2.length > 0 && (
                  <span className="file-count-badge">{myRelease.step2.length} {myRelease.step2.length === 1 ? 'file' : 'files'}</span>
                )}
              </div>
              <div className="card-content-section">
                {myRelease?.step2 && myRelease.step2.length > 0 ? (
                  <div className="files-table-container">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th><i className="fa fa-file"></i> Name</th>
                          <th><i className="fa fa-tag"></i> Type</th>
                          <th><i className="fa fa-play"></i> Play</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myRelease.step2.map((item, index) => (
                          <tr key={index}>
                            <td className="file-name-cell">
                              <i className="fa fa-file-audio"></i>
                              {item.fileName}
                            </td>
                            <td>
                              <span className="file-type-badge">{item.fileType || 'Audio'}</span>
                            </td>
                            <td>
                              <button
                                className="play-link"
                                onClick={() => openAudioPlayerModal(item)}
                                title="Play Audio"
                              >
                                <i className="fa fa-play-circle"></i> Play
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-files-message">
                    <i className="fa fa-file-audio"></i>
                    <p>No audio/video files uploaded</p>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="track-table release-inner dash-detail dash-detail-two">
              <div className="release-title">
                <h3 className="title">Tracks</h3>
              </div>
              <div className="release-table">
                <table className="table" aria-describedby="example2_info">
                  <thead>
                    <tr draggable="true">
                      <th rowspan="1" colspan="1">Volume</th>
                      <th rowspan="1" colspan="1">Content Type</th>
                      <th rowspan="1" colspan="1">PrimaryTrackType</th>
                      <th rowspan="1" colspan="1">SecondaryTrackType</th>
                      <th rowspan="1" colspan="1">Title</th>
                    </tr>
                  </thead>
                  <tbody role="alert" aria-live="polite" aria-relevant="all">
                    {myRelease?.step3 && myRelease?.step3.map((item) => (
                      <tr draggable="true" className="odd">
                        <td className="  sorting_1">{item.Volume}</td>
                        <td className="">{item.ContentType}</td>
                        <td className=" ">{item.PrimaryTrackType}</td>
                        <td className=" ">{item.SecondaryTrackType}</td>
                        <td className=" ">{item.Title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}
            {/* Stores and Release Dates Row */}
            <div className="row stores-dates-row">
              <div className="col-lg-6 col-12">
                <div className="stores-card">
                  <div className="card-header-section">
                    <h3>
                      <i className="fa fa-store"></i> Stores
                    </h3>
                    {myRelease?.step4 && myRelease.step4.length > 0 && (
                      <span className="store-count-badge">
                        {myRelease.step4.filter(s => s.status === 'active').length} active
                      </span>
                    )}
                  </div>
                  <div className="card-content-section">
                    {myRelease?.step4 && myRelease.step4.length > 0 ? (
                      <div className="stores-grid">
                        {myRelease.step4.map((item, index) => (
                          <div key={index} className={`store-item ${item.status === 'active' ? 'active' : 'inactive'}`}>
                            <div className="store-checkbox">
                              <input 
                                type="checkbox" 
                                checked={item.status === 'active'} 
                                readOnly
                              />
                            </div>
                            <div className="store-info">
                              <span className="store-name">{item.name}</span>
                              {getLogo(item.name) && getLogo(item.name) !== "" && getLogo(item.name) !== undefined && (
                                <img 
                                  className="store-logo" 
                                  src={require(`../../assets/images/store/${getLogo(item.name)}`)} 
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <span className={`store-status-badge ${item.status === 'active' ? 'active' : 'inactive'}`}>
                              {item.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-stores-message">
                        <i className="fa fa-store"></i>
                        <p>No stores selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 col-12">
                <div className="release-dates-card">
                  <div className="card-header-section">
                    <h3>
                      <i className="fa fa-calendar-alt"></i> Release Dates
                    </h3>
                  </div>
                  <div className="card-content-section">
                    <div className="release-dates-list">
                      {myRelease?.step5?.MainReleaseDate && (
                        <div className="date-item main-date">
                          <div className="date-icon">
                            <i className="fa fa-calendar-check"></i>
                          </div>
                          <div className="date-info">
                            <span className="date-label">Main Release Date</span>
                            <span className="date-value">{myRelease.step5.MainReleaseDate}</span>
                          </div>
                        </div>
                      )}

                      {myRelease?.step5?.PreOrder && myRelease.step5.PreOrder.length > 0 && (
                        <div className="date-section">
                          <h4 className="date-section-title">
                            <i className="fa fa-shopping-cart"></i> Pre-Order Dates
                          </h4>
                          {myRelease.step5.PreOrder.map((item, index) => (
                            <div key={index} className="date-item pre-order-date">
                              <div className="date-icon">
                                <i className="fa fa-store"></i>
                              </div>
                              <div className="date-info">
                                <span className="date-label">{item.name}</span>
                                <span className="date-value">{item.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {myRelease?.step5?.ExclusiveReleaseDates && myRelease.step5.ExclusiveReleaseDates.length > 0 && (
                        <div className="date-section">
                          <h4 className="date-section-title">
                            <i className="fa fa-star"></i> Exclusive Release Dates
                          </h4>
                          {myRelease.step5.ExclusiveReleaseDates.map((item, index) => (
                            <div key={index} className="date-item exclusive-date">
                              <div className="date-icon">
                                <i className="fa fa-star"></i>
                              </div>
                              <div className="date-info">
                                <span className="date-label">{item.name}</span>
                                <span className="date-value">{item.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {(!myRelease?.step5?.MainReleaseDate && 
                        (!myRelease?.step5?.PreOrder || myRelease.step5.PreOrder.length === 0) &&
                        (!myRelease?.step5?.ExclusiveReleaseDates || myRelease.step5.ExclusiveReleaseDates.length === 0)) && (
                        <div className="no-dates-message">
                          <i className="fa fa-calendar-times"></i>
                          <p>No release dates set</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracks Card */}
            <div className="tracks-card">
              <div className="card-header-section">
                <h2>
                  <i className="fa fa-music"></i> Tracks
                </h2>
                {myRelease?.step3 && myRelease.step3.length > 0 && (
                  <span className="track-count-badge">{myRelease.step3.length} {myRelease.step3.length === 1 ? 'track' : 'tracks'}</span>
                )}
              </div>
              <div className="release-table">
                <div className="box-body table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr role="row">
                        <th>CHECK NO.</th>
                        <th>GROUPING ID</th>
                        <th>PRODUCT TITLE</th>
                        <th>VERSION DESCRIPTION</th>
                        <th>PRIMARY ARTIST</th>
                        <th>PRIMARY ARTIST SPOTIFY ID</th>
                        <th>PRIMARY ARTIST APPLE ID</th>
                        <th>ARTIST 2</th>
                        <th>ARTIST 2 ROLE</th>
                        <th>ARTIST 2 SPOTIFY ID</th>
                        <th>ARTIST 2 APPLE ID</th>
                        <th>ARTIST 3</th>
                        <th>ARTIST 3 ROLE</th>
                        <th>ARTIST 3 SPOTIFY ID</th>
                        <th>ARTIST 3 APPLE ID</th>
                        <th>BARCODE</th>
                        <th>CATALOGUE NO.</th>
                        <th>RELEASE FORMAT TYPE</th>
                        <th>Text Language</th>
                        <th>PRICE BAND</th>
                        <th>LICENSED TERRITORIES to INCLUDE</th>
                        <th>LICENSED TERRITORIES to EXCLUDE</th>
                        <th>RELEASE START DATE</th>
                        <th>RELEASE END DATE</th>
                        <th>GRid</th>
                        <th>(P) YEAR</th>
                        <th>(P) HOLDER</th>
                        <th>(C) YEAR</th>
                        <th>(C) HOLDER</th>
                        <th>LABEL</th>
                        <th>MainGenre Primary (drop-down menu)</th>
                        <th>MainGenre Sub</th>
                        <th>AlternateGenre Primary (drop-down menu)</th>
                        <th>AlternateGenre Sub</th>
                        <th>Mood (drop-down menu)</th>
                        <th>COMPOSER(S)</th>
                        <th>CONDUCTOR(S)</th>
                        <th>PRODUCER(S)</th>
                        <th>ARRANGER(S)</th>
                        <th>ORCHESTRA</th>
                        <th>EXPLICIT CONTENT</th>
                        <th>VOLUME NO.</th>
                        <th>VOLUME TOTAL</th>
                        <th>SERVICES</th>
                        <th>TRACK NO.</th>
                        <th>TRACK TITLE</th>
                        <th>MIX / VERSION</th>
                        <th>PRIMARY ARTIST</th>
                        <th>PRIMARY ARTIST SPOTIFY ID</th>
                        <th>PRIMARY ARTIST APPLE ID</th>
                        <th>ARTIST 2</th>
                        <th>ARTIST 2 ROLE</th>
                        <th>ARTIST 2 SPOTIFY ID</th>
                        <th>ARTIST 2 APPLE ID</th>
                        <th>ARTIST 3</th>
                        <th>ARTIST 3 ROLE</th>
                        <th>ARTIST 3 SPOTIFY ID</th>
                        <th>ARTIST 3 APPLE ID</th>
                        <th>ISRC</th>
                        <th>GRid</th>
                        <th>AVAILABLE SEPARATELY</th>
                        <th>(P) YEAR</th>
                        <th>(P) HOLDER</th>
                        <th>(C) YEAR</th>
                        <th>(C) HOLDER</th>
                        <th>MainGenre Primary (drop-down menu)</th>
                        <th>MainGenre Sub</th>
                        <th>AlternateGenre Primary (drop-down menu)</th>
                        <th>AlternateGenre Sub</th>
                        <th>EXPLICIT CONTENT</th>
                        <th>COVER SONG</th>
                        <th>DO YOU HAVE A LICENSE FILE?</th>
                        <th>PRODUCER(S)</th>
                        <th>MIXER(S)</th>
                        <th>CONDUCTOR</th>
                        <th>ARRANGER(S)</th>
                        <th>ORCHESTRA</th>
                        <th>COMPOSER(S)</th>
                        <th>LYRICIST(S)</th>
                        <th>PUBLISHER(S)</th>
                        {/* Mapping over selectContributory and otherContributory */}
                        {[...(myRelease?.step3?.[0]?.selectContributory || []), ...(myRelease?.step3?.[0]?.otherContributory || [])].map((item) => (
                          <th key={item._id}>{item.name}</th>
                        ))}
                        <th>PRO AFFILIATION (PERFORMING RIGHTS ORGANISATION)</th>
                        <th>Custom PRO Affiliation</th>
                        <th>PRO MEMBERSHIP NUMBER</th>
                        <th>Audio Language</th>
                        <th>Cover Image</th>
                        <th>Media</th>


                      </tr>
                    </thead>
                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                      {
                        myRelease?.step3 && myRelease?.step3.map((item, index) => {
                          return (
                            <tr className="odd">
                              <td className="  sorting_1">{index + 1}</td>
                              <td></td>
                              <td>{myRelease.title}</td>
                              <td>{myRelease?.step1?.subTitle == "null" ? "" : myRelease?.step1?.subTitle}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 0 && myRelease?.step1?.primaryArtist[0]?.name}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 0 && getLastKey(myRelease?.step1?.primaryArtist[0]?.linkId)}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 0 && getLastKey(myRelease?.step1?.primaryArtist[0]?.itunesLinkId)}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 1 && myRelease?.step1?.primaryArtist[1]?.name}</td>
                              <td> {myRelease?.step1?.primaryArtist?.length > 1 ? "Performer" : "Featuring"}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 1 && getLastKey(myRelease?.step1?.primaryArtist[1]?.linkId)}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 1 && getLastKey(myRelease?.step1?.primaryArtist[1]?.itunesLinkId)}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 2 && myRelease?.step1?.primaryArtist[2]?.name}</td>
                              <td></td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 2 && getLastKey(myRelease?.step1?.primaryArtist[2]?.linkId)}</td>
                              <td>{myRelease?.step1?.primaryArtist?.length > 2 && getLastKey(myRelease?.step1?.primaryArtist[2]?.itunesLinkId)}</td>
                              <td>{myRelease?.step1?.UPCEAN}</td>
                              <td>{myRelease?.step1?.producerCatalogueNumber}</td>
                              <td>{myRelease?.step1?.format}</td>
                              <td>{item?.TrackTitleLanguage}</td>
                              <td>{item?.Price}</td>
                              <td>World</td>
                              <td></td>
                              <td>{myRelease.step1?.originalReleaseDate.split('T')[0]}</td>
                              <td>{myRelease.step1?.originalReleaseDate.split('T')[0]}</td>
                              <td></td>
                              <td>{myRelease?.step1?.pYear}</td>
                              <td>{myRelease?.step1?.pline}</td>
                              <td>{myRelease?.step1?.cYear}</td>
                              <td>{myRelease?.step1?.cline}</td>
                              <td>{myRelease?.step1?.labelName}</td>
                              <td>{myRelease?.step1?.genre}</td>
                              <td>{myRelease?.step1?.subGenre}</td>
                              <td>{item?.SecondaryGenre}</td>
                              <td>{item?.SubSecondaryGenre}</td>
                              <td>{myRelease?.step1?.mood}</td>
                              <td>{item?.Composer[0]?.name}</td>
                              <td>None</td>
                              <td>{item?.Producer[0]?.name}</td>
                              <td>{item?.Arranger[0]?.name}</td>
                              <td>None</td>
                              <td>{item?.ParentalAdvisory == 'yes' ? 'Y' : item?.ParentalAdvisory == 'no' ? 'N' : 'C'}</td>
                              <td>{item?.Volume?.match(/\d+/)}</td>
                              <td>1</td>
                              <td>None</td>
                              <td>{index + 1}</td>
                              <td>{item?.title}</td>
                              <td>{item?.VersionSubtitle}</td>
                              <td>{item?.PrimaryArtist?.length > 0 && item?.PrimaryArtist[0]?.name}</td>
                              <td>{item?.PrimaryArtist?.length > 0 && getLastKey(item?.PrimaryArtist[0]?.linkId)}</td>
                              <td>{item?.PrimaryArtist?.length > 0 && getLastKey(item?.PrimaryArtist[0]?.itunesLinkId)}</td>
                              <td>{item?.Featuring?.length > 1 && item?.Featuring[1]?.name}</td>
                              <td>Featuring</td>
                              <td>{item?.Featuring?.length > 1 && getLastKey(item?.Featuring[1]?.linkId)}</td>
                              <td>{item?.Featuring?.length > 1 && getLastKey(item?.Featuring[1]?.itunesLinkId)}</td>
                              <td>{item?.PrimaryArtist?.length > 2 && item?.PrimaryArtist[2]?.name}</td>
                              <td></td>
                              <td>{item?.PrimaryArtist?.length > 2 && getLastKey(item?.PrimaryArtist[2]?.linkId)}</td>
                              <td>{item?.PrimaryArtist?.length > 2 && getLastKey(item?.PrimaryArtist[2]?.itunesLinkId)}</td>
                              <td>{item?.ISRC}</td>
                              <td>{ }</td>
                              <td>{ }</td>
                              <td>{item?.pYear}</td>
                              <td>{item?.Pline}</td>
                              <td>{item?.cYear}</td>
                              <td>{item?.cLine}</td>
                              <td>{item?.Genre}</td>
                              <td>{item?.SubGenre}</td>
                              <td>{item?.SecondaryGenre}</td>
                              <td>{item?.SubSecondaryGenre}</td>
                              <td>{item?.ParentalAdvisory}</td>
                              <td>{item?.SecondaryTrackType}</td>
                              <td>{ }</td>
                              <td>{item?.Producer[0]?.name}</td>
                              <td>{item?.Remixer[0]?.name}</td>
                              <td>{ }</td>
                              <td>{ }</td>
                              <td>{ }</td>
                              <td>{item?.Composer[0]?.name}</td>
                              <td>{item?.Author[0].name}</td>
                              <td>{item?.Publisher[0].name}</td>
                              {/* Mapping over selectContributory and otherContributory */}
                              {[...(myRelease?.step3?.[0]?.selectContributory || []), ...(myRelease?.step3?.[0]?.otherContributory || [])].map((contributor) => (
                                <td key={contributor._id}>{contributor.value}</td>
                              ))}
                              <td>{item?.ISRC}</td>
                              <td>{ }</td>
                              <td>{ }</td>
                              <td>{item?.LyricsLanguage}</td>
                              <td>
                                {isDownloading ?
                                  <Loader />
                                  :
                                  <span onClick={() => { downloadFile(myRelease?.step1?.coverImage, myRelease.title + '.jpg') }}>
                                    <img className="img-fluid" src={require('../../assets/images/imgdownload.png')} style={{ height: 40, width: 40 }} />
                                  </span>
                                }
                              </td>
                              <td>
                                {isDownloading ?
                                  <Loader />
                                  :
                                  <span onClick={() => { downloadFile(myRelease?.step2[index]?.fileData, myRelease?.step2[index]?.fileName) }}>
                                    <img className="img-fluid" src={require('../../assets/images/download.png')} style={{ height: 40, width: 40 }} />
                                  </span>
                                }
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {userProfile?.role == 'Admin' &&
              <div className="track-table release-inner dash-detail dash-detail-two">
                <div className="track-heading d-flex flex-wrap align-items-center justify-content-between">
                  <h2>Tracks Details for Download</h2>
                  <div className="add-track-btn">
                    <button className="btn btn-primary "
                      onClick={() => {
                        exportTableToExcel('example2', 'release.xlsx')
                      }}>Download</button>
                  </div>
                </div>
                <div className="release-table">
                  <div className="box-body table-responsive">
                    <table id="example2" className="table table-bordered table-striped">
                      <thead>
                        <tr role="row">
                          <th>CHECK NO.</th>
                          <th>GROUPING ID</th>
                          <th>PRODUCT TITLE</th>
                          <th>VERSION DESCRIPTION</th>
                          <th>PRIMARY ARTIST</th>
                          <th>PRIMARY ARTIST SPOTIFY ID</th>
                          <th>PRIMARY ARTIST APPLE ID</th>
                          <th>ARTIST 2</th>
                          <th>ARTIST 2 ROLE</th>
                          <th>ARTIST 2 SPOTIFY ID</th>
                          <th>ARTIST 2 APPLE ID</th>
                          <th>ARTIST 3</th>
                          <th>ARTIST 3 ROLE</th>
                          <th>ARTIST 3 SPOTIFY ID</th>
                          <th>ARTIST 3 APPLE ID</th>
                          <th>BARCODE</th>
                          <th>CATALOGUE NO.</th>
                          <th>RELEASE FORMAT TYPE</th>
                          <th>Text Language</th>
                          <th>PRICE BAND</th>
                          <th>LICENSED TERRITORIES to INCLUDE</th>
                          <th>LICENSED TERRITORIES to EXCLUDE</th>
                          <th>RELEASE START DATE</th>
                          <th>RELEASE END DATE</th>
                          <th>GRid</th>
                          <th>(P) YEAR</th>
                          <th>(P) HOLDER</th>
                          <th>(C) YEAR</th>
                          <th>(C) HOLDER</th>
                          <th>LABEL</th>
                          <th>MainGenre Primary (drop-down menu)</th>
                          <th>MainGenre Sub</th>
                          <th>AlternateGenre Primary (drop-down menu)</th>
                          <th>AlternateGenre Sub</th>
                          <th>Mood (drop-down menu)</th>
                          <th>COMPOSER(S)</th>
                          <th>CONDUCTOR(S)</th>
                          <th>PRODUCER(S)</th>
                          <th>ARRANGER(S)</th>
                          <th>ORCHESTRA</th>
                          <th>EXPLICIT CONTENT</th>
                          <th>VOLUME NO.</th>
                          <th>VOLUME TOTAL</th>
                          <th>SERVICES</th>
                          <th>TRACK NO.</th>
                          <th>TRACK TITLE</th>
                          <th>MIX / VERSION</th>
                          <th>PRIMARY ARTIST</th>
                          <th>PRIMARY ARTIST SPOTIFY ID</th>
                          <th>PRIMARY ARTIST APPLE ID</th>
                          <th>ARTIST 2</th>
                          <th>ARTIST 2 ROLE</th>
                          <th>ARTIST 2 SPOTIFY ID</th>
                          <th>ARTIST 2 APPLE ID</th>
                          <th>ARTIST 3</th>
                          <th>ARTIST 3 ROLE</th>
                          <th>ARTIST 3 SPOTIFY ID</th>
                          <th>ARTIST 3 APPLE ID</th>
                          <th>ISRC</th>
                          <th>GRid</th>
                          <th>AVAILABLE SEPARATELY</th>
                          <th>(P) YEAR</th>
                          <th>(P) HOLDER</th>
                          <th>(C) YEAR</th>
                          <th>(C) HOLDER</th>
                          <th>MainGenre Primary (drop-down menu)</th>
                          <th>MainGenre Sub</th>
                          <th>AlternateGenre Primary (drop-down menu)</th>
                          <th>AlternateGenre Sub</th>
                          <th>EXPLICIT CONTENT</th>
                          <th>COVER SONG</th>
                          <th>DO YOU HAVE A LICENSE FILE?</th>
                          <th>PRODUCER(S)</th>
                          <th>MIXER(S)</th>
                          <th>CONDUCTOR</th>
                          <th>ARRANGER(S)</th>
                          <th>ORCHESTRA</th>
                          <th>COMPOSER(S)</th>
                          <th>LYRICIST(S)</th>
                          <th>PUBLISHER(S)</th>
                          <th>PRO AFFILIATION (PERFORMING RIGHTS ORGANISATION)</th>
                          <th>Custom PRO Affiliation</th>
                          <th>PRO MEMBERSHIP NUMBER</th>
                          <th>Audio Language</th>

                        </tr>
                      </thead>
                      <tbody role="alert" aria-live="polite" aria-relevant="all">
                        {
                          myRelease?.step3 && myRelease?.step3.map((item, index) => {
                            return (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td></td>
                                <td>{myRelease.title}</td>
                                <td>{myRelease?.step1?.subTitle == "null" ? "" : myRelease?.step1?.subTitle}</td>

                                <td>{myRelease?.step1?.primaryArtist?.length > 0 && myRelease?.step1?.primaryArtist[0]?.name}</td>
                                <td>{myRelease?.step1?.primaryArtist?.length > 0 && getLastKey(myRelease?.step1?.primaryArtist[0]?.linkId)}</td>
                                <td>{myRelease?.step1?.primaryArtist?.length > 0 && getLastKey(myRelease?.step1?.primaryArtist[0]?.itunesLinkId)}</td>

                                <td>{myRelease?.step1?.primaryArtist?.length > 1 ? myRelease?.step1?.primaryArtist[1]?.name : myRelease?.step1?.Featuring?.length > 0 ? myRelease?.step1?.Featuring[0]?.name : ""}</td>
                                <td> {myRelease?.step1?.primaryArtist?.length > 1 ? "Performer" : "Featuring"}</td>
                                <td>{myRelease?.step1?.primaryArtist?.length > 1 ? getLastKey(myRelease?.step1?.primaryArtist[1]?.linkId) : myRelease?.step1?.Featuring?.length > 0 ? getLastKey(myRelease?.step1?.Featuring[0]?.linkId) : ""}</td>
                                <td>{myRelease?.step1?.primaryArtist?.length > 1 ? getLastKey(myRelease?.step1?.primaryArtist[1]?.itunesLinkId) : myRelease?.step1?.Featuring?.length > 0 ? getLastKey(myRelease?.step1?.Featuring[0]?.itunesLinkId) : ""}</td>

                                <td>{myRelease?.step1?.primaryArtist?.length > 1 ? myRelease?.step1?.primaryArtist[2]?.name : myRelease?.step1?.Featuring?.length > 0 ? myRelease?.step1?.Featuring[0]?.name : ""}</td>
                                <td>{myRelease?.step1?.Featuring?.length > 0 && myRelease?.step1?.primaryArtist?.length > 1 && "Featuring"}</td>
                                <td>{myRelease?.step1?.Featuring?.length > 0 && myRelease?.step1?.primaryArtist?.length > 1 ? getLastKey(myRelease?.step1?.Featuring[0]?.linkId) : ""}</td>
                                <td>{myRelease?.step1?.Featuring?.length > 0 && myRelease?.step1?.primaryArtist?.length > 1 ? getLastKey(myRelease?.step1?.Featuring[0]?.itunesLinkId) : ""}</td>

                                <td>{myRelease?.step1?.UPCEAN}</td>
                                <td>{myRelease?.step1?.producerCatalogueNumber}</td>
                                <td>{myRelease?.step1?.format?.toLowerCase().replace(/^./, str => str.toUpperCase())}</td>
                                <td>{item?.TrackTitleLanguage}</td>
                                <td>{item?.Price}</td>
                                <td>World</td>
                                <td></td>
                                <td>{moment(myRelease.step1?.originalReleaseDate).format("DD/MM/YYYY")}</td>
                                <td>{moment(myRelease.step1?.originalReleaseDate).format("DD/MM/YYYY")}</td>
                                <td></td>
                                <td>{myRelease?.step1?.pYear}</td>
                                <td>{myRelease?.step1?.pline}</td>
                                <td>{myRelease?.step1?.cYear}</td>
                                <td>{myRelease?.step1?.cline}</td>
                                <td>{myRelease?.step1?.labelName}</td>
                                <td>{myRelease?.step1?.genre}</td>
                                <td>{myRelease?.step1?.subGenre}</td>
                                <td>{item?.SecondaryGenre}</td>
                                <td>{item?.SubSecondaryGenre}</td>
                                <td>{item?.mood}</td>
                                <td>{item?.Composer[0]?.name}</td>
                                <td>{ }</td>
                                <td>{item?.Producer[0]?.name}</td>
                                <td>{item?.Arranger[0]?.name}</td>
                                <td>{ }</td>
                                <td>{item?.ParentalAdvisory == 'yes' ? 'Y' : item?.ParentalAdvisory == 'no' ? 'N' : 'C'}</td>
                                <td>{item?.Volume?.match(/\d+/)}</td>
                                <td>1</td>
                                <td>Jeet Music Services</td>
                                <td>{index + 1}</td>
                                <td>{item?.Title}</td>
                                <td>{item?.VersionSubtitle}</td>
                                <td>{item?.PrimaryArtist?.length > 0 && item?.PrimaryArtist[0]?.name}</td>
                                <td>{item?.PrimaryArtist?.length > 0 && getLastKey(item?.PrimaryArtist[0]?.linkId)}</td>
                                <td>{item?.PrimaryArtist?.length > 0 && getLastKey(item?.PrimaryArtist[0]?.itunesLinkId)}</td>

                                <td>{item?.PrimaryArtist?.length > 1 ? item?.PrimaryArtist[1]?.name : item?.Featuring?.length > 0 ? item?.Featuring[0]?.name : ""}</td>
                                <td> {item?.PrimaryArtist?.length > 1 ? "Performer" : "Featuring"}</td>
                                <td>{item?.PrimaryArtist?.length > 1 ? getLastKey(item?.PrimaryArtist[1]?.linkId) : item?.Featuring?.length > 0 ? getLastKey(item?.Featuring[0]?.linkId) : ""}</td>
                                <td>{item?.PrimaryArtist?.length > 1 ? getLastKey(item?.PrimaryArtist[1]?.itunesLinkId) : item?.Featuring?.length > 0 ? getLastKey(item?.Featuring[0]?.itunesLinkId) : ""}</td>

                                <td>{item?.Featuring?.length > 0 && item?.PrimaryArtist?.length > 1 ? item?.Featuring[0]?.name : ""}</td>
                                <td>{item?.Featuring?.length > 0 && item?.PrimaryArtist?.length > 1 && "Featuring"}</td>
                                <td>{item?.Featuring?.length > 0 && item?.PrimaryArtist?.length > 1 ? getLastKey(item?.Featuring[0]?.linkId) : ""}</td>
                                <td>{item?.Featuring?.length > 0 && item?.PrimaryArtist?.length > 1 ? getLastKey(item?.Featuring[0]?.itunesLinkId) : ""}</td>


                                {/* <td>{item?.PrimaryArtist?.length > 0 && item?.PrimaryArtist[0]?.name}</td>
                                <td>{item?.PrimaryArtist?.length > 0 && getLastKey(item?.PrimaryArtist[0]?.linkId)}</td>
                                <td>{item?.PrimaryArtist?.length > 0 && getLastKey(item?.PrimaryArtist[0]?.itunesLinkId)}</td>
                                <td>{item?.Featuring?.length > 1 && item?.Featuring[1]?.name}</td>
                                <td>Featuring</td>
                                <td>{item?.Featuring?.length > 1 && getLastKey(item?.Featuring[1]?.linkId)}</td>
                                <td>{item?.Featuring?.length > 1 && getLastKey(item?.Featuring[1]?.itunesLinkId)}</td>
                                <td>{item?.PrimaryArtist?.length > 2 && item?.PrimaryArtist[2]?.name}</td>
                                <td></td>
                                <td>{item?.PrimaryArtist?.length > 2 && getLastKey(item?.PrimaryArtist[2]?.linkId)}</td>
                                <td>{item?.PrimaryArtist?.length > 2 && getLastKey(item?.PrimaryArtist[2]?.itunesLinkId)}</td> */}
                                <td>{item?.ISRC}</td>
                                <td>{ }</td>
                                <td>Y</td>
                                <td>{item?.pYear}</td>
                                <td>{item?.Pline}</td>
                                <td>{item?.cYear}</td>
                                <td>{item?.cLine}</td>
                                <td>{item?.Genre}</td>
                                <td>{item?.Subgenre}</td>
                                <td>{item?.SecondaryGenre}</td>
                                <td>{item?.SubSecondaryGenre}</td>
                                <td>{item?.ParentalAdvisory == 'yes' ? 'Y' : item?.ParentalAdvisory == 'no' ? 'N' : 'C'}</td>
                                <td>{item?.SecondaryTrackType == 'original' ? "N" : 'Y'}</td>
                                <td>{ }</td>
                                <td>{item?.Producer[0]?.name}</td>
                                <td>{item?.Remixer[0]?.name}</td>
                                <td>{ }</td>
                                <td>{ }</td>
                                <td>{ }</td>
                                <td>{item?.Composer[0]?.name}</td>
                                <td>{item?.Author[0].name}</td>
                                <td>{item?.Publisher[0].name != "None" ? item?.Publisher[0].name : ""}</td>
                                <td>None</td>
                                <td>{ }</td>
                                <td>{ }</td>
                                <td>{item?.LyricsLanguage}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

            {/* Admin Action Buttons */}
            {userProfile?.role == "Admin" && (
              <div className="admin-actions-card">
                <div className="card-header-section">
                  <h3>
                    <i className="fa fa-cog"></i> Admin Actions
                  </h3>
                </div>
                <div className="admin-actions-buttons">
                  <button 
                    type="submit" 
                    className="btn-action btn-approve"
                    onClick={() => changeStatus("Approve")}
                  >
                    <i className="fa fa-check-circle"></i> Approve
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-reject"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fa fa-times-circle"></i> Reject
                  </button>
                  <button 
                    type="submit" 
                    className="btn-action btn-takedown"
                    onClick={() => changeStatus("Pending")}
                  >
                    <i className="fa fa-arrow-down"></i> Takedown
                  </button>
                </div>
              </div>
            )}

            {/* Custom Modal for Rejection */}
            {showModal && (
              <div className="rejection-modal-overlay" onClick={() => setShowModal(false)}>
                <div className="rejection-modal-dialog" onClick={(e) => e.stopPropagation()}>
                  <div className="rejection-modal-content">
                    <div className="rejection-modal-header">
                      <h5>
                        <i className="fa fa-exclamation-triangle"></i> Reason for Rejection
                      </h5>
                      <button
                        type="button"
                        className="modal-close-btn"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                      >
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="rejection-modal-body">
                      <label className="modal-label">Please provide a reason for rejecting this release:</label>
                      <textarea
                        className="rejection-textarea"
                        rows="5"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter the reason for rejection..."
                      ></textarea>
                    </div>
                    <div className="rejection-modal-footer">
                      <button
                        type="button"
                        className="btn-modal-cancel"
                        onClick={() => setShowModal(false)}
                      >
                        <i className="fa fa-times"></i> Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-modal-submit"
                        onClick={handleReject}
                        disabled={!rejectionReason.trim()}
                      >
                        <i className="fa fa-check"></i> Submit Rejection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Player Modal */}
            {showAudioPlayerModal && selectedAudioFile && (
              <div className="audio-player-modal-overlay" onClick={closeAudioPlayerModal}>
                <div className="audio-player-modal-dialog" onClick={(e) => e.stopPropagation()}>
                  <div className="audio-player-modal-content">
                    <div className="audio-player-modal-header">
                      <h5>
                        <i className="fa fa-music"></i> Playing: {selectedAudioFile.fileName}
                      </h5>
                      <button
                        type="button"
                        className="close-button"
                        onClick={closeAudioPlayerModal}
                      >
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="audio-player-modal-body">
                      <div className="audio-player-container">
                        <audio 
                          controls 
                          autoPlay 
                          preload="metadata" 
                          onEnded={closeAudioPlayerModal}
                          className="audio-player-element"
                        >
                          <source 
                            src={selectedAudioFile.fileData} 
                            type={selectedAudioFile.fileType === 'audio' ? 'audio/wav' : selectedAudioFile.fileType === 'flac' ? 'audio/flac' : 'audio/mpeg'} 
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <div className="audio-player-info-cards">
                        <div className="audio-info-card">
                          <i className="fa fa-file-audio icon"></i>
                          <span className="label">File Name:</span>
                          <span className="value">{selectedAudioFile.fileName}</span>
                        </div>
                        <div className="audio-info-card">
                          <i className="fa fa-tag icon"></i>
                          <span className="label">File Type:</span>
                          <span className="value">{selectedAudioFile.fileType || 'Audio'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>
    </div>
  );
};