import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { base } from '../../Constants/Data.constant';
import MainStepController from '../../Controllers/One-release-controller/MainStepController'
import { postData } from '../../Services/Ops';
import { Nav } from '../Common/Nav';
import { SideBar } from '../Common/SideBar'
const FinalSubmit = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const releaseId = location.state?.releaseId;
  const { step, setStep, myRelease, fetchReleaseDetails, isLoading, } = MainStepController();
  const [isRefresh, setIsRefresh] = useState(new Date().getTime())
  const [artistConfirmed, setArtistConfirmed] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  const [ignoreDate, setIgnoreDate] = useState(false);
  const [oacUrl, setOacUrl] = useState("");
  const [releaseFinalStep, setreleaseFinalStep] = useState("1");
  useEffect(() => {
    fetchReleaseDetails(releaseId)
    console.log("releaseId--------", releaseId)
    setReleaseDate(myRelease?.step1?.originalReleaseDate)
  }, [releaseId])
  const handleSubmit = () => {
    if (releaseFinalStep == "1") {
      if (artistConfirmed) {
        setreleaseFinalStep("2")
      } else {
        Swal.fire("Error", "Please check I confirm that an Artist Page", "error");
      }
    } else if (releaseFinalStep == "2") {
      // if (ignoreDate) {
        setreleaseFinalStep("3")

      // } else {
      //   Swal.fire("Error", "Please check Ignore recommended release date", "error");
      // }
    } else if (releaseFinalStep == "3") {
      Swal.fire({
        title: "Are you sure?",
        text: "Please check Ignore recommended",
        icon: "warning", // Options: 'warning', 'error', 'success', 'info', 'question'
        showCancelButton: true, // Enables the Cancel button
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "No, cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked the confirm button
          finalSubmit()
        } else if (result.isDismissed) {
          // User clicked the cancel button
          Swal.fire("Cancelled", "Action was cancelled.", "info");
        }
      });
     
    }
  };
  const handleCancel = () => {
    if (releaseFinalStep == "3") {
      setreleaseFinalStep("2")
    } else if (releaseFinalStep == "2") {
      setreleaseFinalStep("1")
    }
  };
  const finalSubmit = async () => {
    let body = {
      id: myRelease._id,
      releaseDate: releaseDate,
      youtubechannelLinkId: oacUrl
    }
    let result = await postData(base.finalReleaseSubmit, body)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
      navigate("/All releases");
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }
  return (
    <div>
      <SideBar />
      <div className="main-cotent">
        <Nav />
        <div className="content-main">
          <div className="page-heading">
            <h1>Finalize Your Release</h1>
          </div>
          <section className="content">
            <div className="final-release dash-detail dash-detail-two">
              {/* Section 1: Confirm Artist Pages */}
              {releaseFinalStep == "1" &&
                <section style={styles.section}>
                  {/* {JSON.stringify(myRelease.step1.primaryArtist)} */}
                  <h2>1. Confirm Your Artist Pages</h2>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Artist</th>
                        <th>Apple Artist Page</th>
                        <th>Spotify Artist Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRelease.step1?.primaryArtist?.length > 0 &&
                        myRelease.step1.primaryArtist.map((artist, index) => (
                          <tr key={index}>
                            {/* Artist Name */}
                            <td>{artist.name}</td>
                            {/* iTunes Link */}
                            <td>
                              {artist.itunesLinkId ? (
                                <a
                                  href={artist.itunesLinkId}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src="https://static.believedigital.com/images/logos/stores/408.svg"
                                    className="artist-image"
                                    alt="iTunes Logo"
                                  />
                                </a>
                              ) : (
                                `No Artist Page details`
                              )}
                            </td>
                            {/* Spotify Link */}
                            <td>
                              {artist.linkId ? (
                                <a
                                  href={artist.linkId}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src="https://static.believedigital.com/images/logos/stores/204.svg"
                                    className="artist-image"
                                    alt="Spotify Logo"
                                  />
                                </a>
                              ) : (
                                `No Artist Page details`
                              )}
                            </td>
                          </tr>
                        ))}
                      {/* 
                <tr>
                  <td>Various Artists</td>
                  <td>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                    36270
                    </a>
                  </td>
                  <td>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                    Spotify Link
                    </a>
                  </td>
                </tr>
                */}
                    </tbody>
                  </table>
                  <label>
                    Artist Page details were not entered for the store(s) identified above. If an Artist Page is available, please enter it on the Release page. If not, confirm that Tune plus can create a new store Artist Page.
                  </label>
                  <p>
                    <input
                      type="checkbox"
                      checked={artistConfirmed}
                      onChange={(e) => setArtistConfirmed(e.target.checked)}
                    />
                    I confirm that an Artist Page has not been created for the stores above, and I understand that Tune plus will create a new Artist Page to deliver your content to the right page (excluding YouTube).
                    For more info on how to edit your artist page, please refer to the Tune plus guideline for Artist ID.
                  </p>
                  {/* Action Buttons */}
                  <div style={styles.btnContainer}>
                    <button className="btn btn-primary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Save & Continue
                    </button>
                  </div>
                </section>
              }
              {releaseFinalStep == "2" &&
                <section style={styles.section}>
                  <h2>2. Set Your Release Date</h2>
                  <p>
                    You requested a release of your product in less than 48 hours. We
                    recommend setting your release date to at least two weeks ahead.
                  </p>
                  <input
                    className="form-control"
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    style={styles.inputField}
                    min={new Date().toISOString().split("T")[0]} // Disables past dates
                  />
                  {/* <label>
                    <input
                      type="checkbox"
                      checked={ignoreDate}
                      onChange={(e) => setIgnoreDate(e.target.checked)}
                    />
                    Ignore recommended release date and proceed with my selected date.
                  </label> */}
                  {/* Action Buttons */}
                  <div style={styles.btnContainer}>
                    <button className="btn btn-primary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Save & Continue
                    </button>
                  </div>
                </section>
              }
              {/* Section 3: YouTube OAC Certification */}
              {releaseFinalStep == "3" &&
                <section style={styles.section}>
                  <h2>3. Get Your OAC Certified by YouTube</h2>
                  <p>
                    Enter the URL of your Official Artist Channel (OAC) to certify your
                    YouTube account as your official channel.
                  </p>
                  <input
                    type="text"
                    value={oacUrl}
                    onChange={(e) => setOacUrl(e.target.value)}
                    style={styles.inputField}
                    placeholder="Enter Official Artist Channel URL"
                  />
                  <a
                    className="btn btn-primary"
                    href="https://support.google.com/youtube/answer/7336634?hl=en#:~:text=If%20you're%20an%20artist,YouTube%20channels%20into%20one%20place"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    What is OAC Certification?
                  </a>
                  {/* Action Buttons */}
                  <div style={styles.btnContainer}>
                    <button className="btn btn-primary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Save & Continue
                    </button>
                  </div>
                </section>
              }
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
// Inline Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#000",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
  },
  inputField: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: '#000'
  },
  tooltip: {
    fontSize: "0.9em",
    color: "#0073e6",
    textDecoration: "none",
  },
  btnContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  btn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  btnDanger: {
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
  btnPrimary: {
    backgroundColor: "#3498db",
    color: "#fff",
  },
};
export default FinalSubmit;