import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Nav } from '../Common/Nav'
import Papa from 'papaparse'
import { getData, postData, postDataContent } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import Swal from 'sweetalert2';
import { SideBar } from '../Common/SideBar';
import FinancialReport from './FinancialReport';
import Wallet from './Wallet';
export default function CompanyDetails() {

  const location = useLocation();
  const userId = location.state?.userId;

  const [jsonData, setJsonData] = useState(null); // State to store parsed JSON data
  const [error, setError] = useState(''); // State for error messages
  const [trackList, setTrackList] = useState([])
  const [userDetails, setUserDetails] = useState({})
  const [allReport, setAllReport] = useState({})

  // Add these to your existing state declarations at the top of the component
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const [currentItemId, setCurrentItemId] = useState(null);
  const [type, setType] = useState(''); // Default type is 'market'

  // Add this function to handle file upload
  const handleUploadExcel = async () => {

    if (!selectedFile || !currentItemId) {
      Swal.fire("Error", "Please select a file first", "error");
      return;
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', type);
    formData.append('id', currentItemId);

    try {
      // Replace with your actual API endpoint for file upload
      const result = await postDataContent(base.uploadExcelFile, formData, true); // true flag for multipart/form-data

      if (result.status === true) {
        Swal.fire("Success", "File uploaded successfully", "success");
        setShowModal(false);
        setSelectedFile(null);
        getAllReport(); // Refresh the data
      } else {
        Swal.fire("Error", result.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire("Error", "Something went wrong during upload", "error");
    }
  };




  useEffect(() => {
    getTrack()
    getClientNo(userId);
    getAllReport()
  }, [])



  const getClientNo = async (userId) => {
    try {
      const body = { userId };
      const result = await postData(base.getUser, body);
      console.log("get user", result);
      setUserDetails(result?.data?.data);
    } catch (error) {
      console.error("Error fetching client number:", error);
      return null;
    }
  };



  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'text/csv') {
        setError(''); // Reset error if file is valid
        parseCSV(file); // Call function to parse CSV
      } else {
        setError('Please upload a valid CSV file.');
      }
    }
  };


  // const parseCSV = (file) => {
  //   Papa.parse(file, {
  //     complete: (result) => {
  //       console.log('CSV Parsed:', result);        // console.log('JSON with cleaned keys:', json);
  //       setJsonData(result.data); // Store JSON data in state
  //     },
  //     header: true, // Treat first row as header
  //     skipEmptyLines: true, // Skip empty lines in CSV
  //   });
  // };


  // Parse the CSV file and convert it to JSON
  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        console.log('CSV Parsed:', result);

        // Remove spaces in keys with two or three words
        const json = result.data.map((row) => {
          const cleanedRow = {};
          Object.keys(row).forEach((key) => {
            const cleanedKey = key.trim().replace(/\s+/g, ''); // Trim and remove spaces within the key
            cleanedRow[cleanedKey] = row[key]; // Assign the value to the cleaned key
          });
          return cleanedRow;
        });

        console.log('JSON with cleaned keys:', json);
        setJsonData(json); // Store JSON data in state
      },
      header: true, // Treat first row as header
      skipEmptyLines: true, // Skip empty lines in CSV
    });
  };








  const uploadExcel = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.uploadTracks, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
      getAllReport()
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const uploadStoreExcel = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.uploadStore, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }


  const uploadMarketExcel = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.uploadMarket, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const getTrack = async () => {
    let result = await getData(base.getTracks)
    console.log(result)
    setTrackList(result.data)
  }


  const uploadMarketStream = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    let result = await postData(base.sendStream, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const uploadReportStream = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    // uploadDataInChunks(jsonData, 100)
    // console.log(jsonData)
    let result = await postData(base.sendReport, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const uploadInside = async () => {
    let body = {
      userId: userId,
      data: jsonData
    }
    // uploadDataInChunks(jsonData, 100)
    // console.log(jsonData)
    let result = await postData(base.sendInside, body)
    console.log(result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }

  const uploadDataInChunks = async (data, chunkSize) => {
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const body = {
        userId: userId,
        data: chunk
      };

      try {
        const result = await postData(base.sendReport, body);
        if (!result.ok) {
          const error = await result.json();
          throw new Error(`Server Error: ${error.message}`);
        }
        console.log(`Chunk ${i / chunkSize + 1} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading chunk ${i / chunkSize + 1}:`, error.message);
        console.error("Failed chunk data:", JSON.stringify(chunk));
      }
    }
  };


  const getAllReport = async () => {
    setAllReport([])
    let body = {
      userId: userId
    }
    let result = await postData(base.getAllReport, body)
    console.log("resultresultresultresultresult", result)
    setAllReport(result?.data?.data)
  }

  const deleteData = async (name) => {
    let body = {
      userId: userId,
      type: name
    }

    let result = await postData(base.deleteStore, body)
    console.log("resultresultresultresultresult", result)
    if (result.data.status === true) {
      Swal.fire("Success", result.message, result.message);
      getAllReport()
    } else {
      Swal.fire("Error", result.message, result.message);
    }
  }


  const downloadFile = (url, name) => {
    if (!url || url === "") {
      alert("No file available to download");
      return;
    }
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Ensure URL uses HTTPS instead of HTTP
      if (url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
      }
      
      // Check if URL is relative and convert to absolute if needed
      if (url.startsWith('/') && !url.startsWith('//')) {
        url = window.location.origin + url;
      }
      
      link.href = url;
      
      // Extract filename from URL or use a default name
      const filename = url.split('/').pop() || name + '.xlsx';
      link.download = filename;
      
      // Set additional attributes that might help in production
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      
      // Small timeout before removing to ensure the download starts
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  }



  return (
    <div>
      <SideBar />
      <div className="main-cotent">
        <Nav />
        <div className="content-wrapper">
          <br></br>
          <br></br>
          <div className="audio-table release-inner dash-detail dash-detail-two mb-4">
            <div className="release-title">
              <h2>User Information</h2>
              <div className="release-detail d-flex flex-wrap mt-3">
                {Object.entries(userDetails).map(([key, value]) => (
                  key != 'bankDetails' && key != '_id' && key != 'password' && key != 'is_active' && key != 'Is_deleted' && key != '_v' && <p className="release-data" key={key}>

                    <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
                      <p>{value}</p>
                    </strong>
                  </p>

                ))}
              </div>
            </div>
          </div>


          <div className="audio-table release-inner dash-detail dash-detail-two mb-4">
            <div className="release-title">
              <h2>Bank Information</h2>
              <div className="release-detail d-flex flex-wrap mt-3">

                <p className="release-data" >
                  <strong>
                    Bank Name
                  </strong>{" "}
                  <span>{userDetails?.bankDetails?.bankName}</span>
                </p>
                <p className="release-data" >

                  <strong>
                    Account Number
                  </strong>{" "}
                  <span>{userDetails?.bankDetails?.accountNumber}</span>
                </p>
                <p className="release-data" >

                  <strong>
                    Account Holder Name
                  </strong>{" "}
                  <span>{userDetails?.bankDetails?.accountHolder}</span>
                </p>
                <p className="release-data" >
                  <strong>
                    Account Type
                  </strong>{" "}
                  <span>{userDetails?.bankDetails?.accountType}</span>
                </p>
                <p className="release-data" >
                  <strong>
                    Ifsc Code
                  </strong>{" "}
                  <span>{userDetails?.bankDetails?.ifscCode}</span>
                </p>

              </div>
              <Wallet/>
            </div>
          </div>



          <div className="dash-detail " key={allReport?.storeData?.length}>
            <div className="col-md-12">
              <div className="">
                <h3 className="mb-4">Store Upload Excel</h3>
                <section className="content-header">

                  {/* Upload Input */}


                  {allReport?.storeData?.length > 0 ?
                    <div>
                      <div className="col-md-6">

                        <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ overflowY: "auto", display: "block", border: 0 }} >
                          <thead>
                            <tr role="row">
                              <th >#</th>
                              <th >name</th>
                              <th > Quantity</th>
                              <th>Excel Data</th>
                            </tr>
                          </thead>
                          <tbody role="alert" aria-live="polite" aria-relevant="all">
                            {allReport?.storeData.length > 0 && allReport?.storeData.map((item, index) => (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td className="  sorting_1">{item.Store}</td>
                                <td className="  ">{item.Quantity}</td>
                                <td>
                                  {item.Excel != "" &&
                                    <a onClick={() => { downloadFile(item.Excel, item.name) }}>
                                      <i className="fa fa-download"></i> Download Excel
                                    </a>
                                  }

                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setCurrentItemId(item._id); // Store the current item ID
                                      setShowModal(true);
                                      setType('store'); // Set the type to 'market'
                                    }}
                                  >
                                    <i className="fa fa-file-excel-o"></i> Upload Excel
                                  </button>

                                </td>

                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <button
                          onClick={() => deleteData("store")}
                          type="Submit"
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                    :

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          {/* <label className="form-label">Select Media Files:</label> */}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form-group">
                          <button
                            onClick={() => uploadStoreExcel()}
                            type="Submit"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>


                    </div>
                  }



                </section>
              </div>
            </div>
          </div>
          <br></br>
          <div className="dash-detail ">

            <div className="col-md-12">
              <div className="">
                <h3 className="mb-4">Market Upload Excel</h3>
                <section className="content-header">

                  {allReport?.marketData?.length > 0 ?
                    <div>
                      <div className="col-md-6">

                        <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                          <thead>
                            <tr role="row">
                              <th >#</th>
                              <th >name</th>
                              <th > Quantity</th>
                              <th>Excel Upload</th>
                            </tr>
                          </thead>
                          <tbody role="alert" aria-live="polite" aria-relevant="all">
                            {allReport?.marketData.length > 0 && allReport?.marketData.map((item, index) => (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td className="  sorting_1">{item.Market}</td>
                                <td className="  ">{item.Quantity}</td>

                                <td>
                                  {item.Excel != "" &&
                                    <a onClick={() => { downloadFile(item.Excel, item.name) }}>
                                      <i className="fa fa-download"></i> Download Excel
                                    </a>
                                  }

                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setCurrentItemId(item._id); // Store the current item ID
                                      setShowModal(true);
                                      setType('market'); // Set the type to 'market'
                                    }}
                                  >
                                    <i className="fa fa-file-excel-o"></i> Upload Excel
                                  </button>

                                </td>


                              </tr>
                            ))}
                          </tbody>

                        </table>

                        {showModal && (
                          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(73, 72, 72, 0.76)' }}>
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header" style={{ backgroundColor: 'rgb(0, 0, 0)' }}>
                                  <h4 className="modal-title">Upload Excel File</h4>
                                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body" style={{ display: 'block', backgroundColor: 'rgb(0, 0, 0)' }}>
                                  <div className="form-group" style={{ display: 'block', backgroundColor: 'rgb(0, 0, 0)' }}>
                                    <label>Select Excel File:</label>
                                    <input
                                      type="file"
                                      accept=".xlsx,.xls,.csv"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                          const file = e.target.files[0];
                                          let obj = {
                                            name: file.name,
                                            type: file.type
                                          }
                                          setSelectedFile(file);
                                          console.log("Selected file:", file.name, file.type);
                                        } else {
                                          console.log("No file selected");
                                        }
                                      }}
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                                <div className="modal-footer" style={{ backgroundColor: 'rgb(0, 0, 0)' }}>
                                  <button type="button" className="btn btn-dangar" onClick={() => setShowModal(false)}>
                                    Close
                                  </button>
                                  <button type="button" className="btn btn-primary" onClick={handleUploadExcel}>
                                    Upload
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}


                        <button
                          onClick={() => deleteData("market")}
                          type="Submit"
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                    :
                    <div className="row">
                      {/* Left Column */}
                      <div className="col-md-6">
                        <div className="form-group">
                          {/* <label className="form-label">Select Media Files:</label> */}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <button
                            onClick={() => uploadMarketExcel()}
                            type="Submit"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  }


                </section>
              </div>
            </div>
          </div>
          <br></br>

          <div className="dash-detail ">
            <div className="col-md-12">
              <div className="">
                <h3 className="mb-4">Tracks Upload Excel</h3>
                <section className="content-header">
                  {allReport?.trackData?.length > 0 ?
                    <div>
                      <div className="col-md-6">

                        <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                          <thead>
                            <tr role="row">
                              <th >#</th>
                              <th >name</th>
                              <th > Quantity</th>
                              <th>Excel Data</th>
                            </tr>
                          </thead>
                          <tbody role="alert" aria-live="polite" aria-relevant="all">
                            {allReport?.trackData.length > 0 && allReport?.trackData.map((item, index) => (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td className="  sorting_1">{item.Track}</td>
                                <td className="  ">{item.Quantity}</td>
                                <td>
                                  {item.Excel != "" &&
                                    <a onClick={() => { downloadFile(item.Excel, item.name) }}>
                                      <i className="fa fa-download"></i> Download Excel
                                    </a>
                                  }

                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setCurrentItemId(item._id); // Store the current item ID
                                      setShowModal(true);
                                      setType('track'); // Set the type to 'market'
                                    }}
                                  >
                                    <i className="fa fa-file-excel-o"></i> Upload Excel
                                  </button>

                                </td>

                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <button
                          onClick={() => deleteData("track")}
                          type="Submit"
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                    :
                    <div className="row">
                      {/* Left Column */}
                      <div className="col-md-6">
                        <div className="form-group">
                          {/* <label className="form-label">Select Media Files:</label> */}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="form-control"
                          // onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <button
                            onClick={() => uploadExcel()}
                            type="Submit"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  }



                </section>
              </div>
            </div>
          </div>
          <br></br>

          <div className="dash-detail ">

            <div className="col-md-12">
              <div className="">
                <h3 className="mb-4">Stream Upload Excel</h3>
                <section className="content-header">

                  {allReport?.streamData?.length > 0 ?
                    <div>
                      <div className="col-md-6">

                        <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                          <thead>
                            <tr role="row">
                              <th >#</th>
                              <th >name</th>
                              <th > Quantity</th>
                              <th>Excel Data</th>
                            </tr>
                          </thead>
                          <tbody role="alert" aria-live="polite" aria-relevant="all">
                            {allReport?.streamData.length > 0 && allReport?.streamData.map((item, index) => (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td className="  sorting_1">{item.dsp}</td>
                                <td className="  ">{item.streams}</td>
                                <td>
                                  {item.Excel != "" &&
                                    <a onClick={() => { downloadFile(item.Excel, item.name) }}>
                                      <i className="fa fa-download"></i> Download Excel
                                    </a>
                                  }

                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setCurrentItemId(item._id); // Store the current item ID
                                      setShowModal(true);
                                      setType('salesStream'); // Set the type to 'market'
                                    }}
                                  >
                                    <i className="fa fa-file-excel-o"></i> Upload Excel
                                  </button>

                                </td>

                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <button
                          onClick={() => deleteData("stream")}
                          type="Submit"
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                    :
                    <div className="row">
                      {/* Left Column */}
                      <div className="col-md-6">
                        <div className="form-group">
                          {/* <label className="form-label">Select Media Files:</label> */}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="form-control"
                          // onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <button
                            onClick={() => uploadMarketStream()}
                            type="Submit"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  }



                </section>
              </div>
            </div>
          </div>
          <br></br>

          <div className="dash-detail ">
            <div className="col-md-12">
              <div className="">
                <h3 className="mb-4">Report Upload Excel</h3>
                <section className="content-header">

                  {allReport?.salesAssetsData?.length > 0 ?
                    <div>
                      <div className="col-md-6">

                        <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                          <thead>
                            <tr role="row">
                              <th >#</th>
                              <th >name</th>
                              <th > Quantity</th>
                              <th > Excel Data</th>
                            </tr>
                          </thead>
                          <tbody role="alert" aria-live="polite" aria-relevant="all">
                            {allReport?.salesAssetsData.length > 0 && allReport?.salesAssetsData.map((item, index) => (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td className="  sorting_1">{item.DSP}</td>
                                <td >{item.SaleID}</td>
                                <td>
                                  {item.Excel != "" &&
                                    <a onClick={() => { downloadFile(item.Excel, item.name) }}>
                                      <i className="fa fa-download"></i> Download Excel
                                    </a>
                                  }

                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setCurrentItemId(item._id); // Store the current item ID
                                      setShowModal(true);
                                      setType('salesAsset'); // Set the type to 'market'
                                    }}
                                  >
                                    <i className="fa fa-file-excel-o"></i> Upload Excel
                                  </button>

                                </td>

                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <button
                          onClick={() => deleteData("stream")}
                          type="Submit"
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                    :
                    <div className="row">
                      {/* Left Column */}
                      <div className="col-md-6">
                        <div className="form-group">
                          {/* <label className="form-label">Select Media Files:</label> */}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="form-control"
                          // onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <button
                            onClick={() => uploadReportStream()}
                            type="Submit"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  }


                </section>
              </div>
            </div>
          </div>
          <br></br>



          <div className="dash-detail ">
            <div className="col-md-12">
              <div className="">
                <h3 className="mb-4">Inside Upload Excel</h3>
                <section className="content-header">

                  {allReport?.insidesData?.length > 0 ?
                    <div>
                      <div className="col-md-6">

                        <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                          <thead>
                            <tr role="row">
                              <th >#</th>
                              <th >name</th>
                              <th > Quantity</th>
                              {/* <th > Excel Data</th> */}
                            </tr>
                          </thead>
                          <tbody role="alert" aria-live="polite" aria-relevant="all">
                            {allReport?.insidesData.length > 0 && allReport?.insidesData.map((item, index) => (
                              <tr className="odd">
                                <td className="  sorting_1">{index + 1}</td>
                                <td className="  sorting_1">{item.Title}</td>
                                <td className="  ">{item.Label}</td>
                                {/* <td>
                                  {item.Excel != "" &&
                                      <a onClick={()=>{downloadFile(item.Excel,item.name)}}>
                                      <i className="fa fa-download"></i> Download Excel
                                    </a>
                                  }

                                  <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                      setCurrentItemId(item._id); // Store the current item ID
                                      setShowModal(true);
                                      setType('inside'); // Set the type to 'market'
                                    }}
                                  >
                                    <i className="fa fa-file-excel-o"></i> Upload Excel
                                  </button>

                                </td> */}

                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <button
                          onClick={() => deleteData("inside")}
                          type="Submit"
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                    :
                    <div className="row">
                      {/* Left Column */}
                      <div className="col-md-6">
                        <div className="form-group">
                          {/* <label className="form-label">Select Media Files:</label> */}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="form-control"
                          // onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <button
                            onClick={() => uploadInside()}
                            type="Submit"
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  }



                </section>
              </div>
            </div>
          </div>
          <br></br>

          {/* <div className="dash-detail ">

            <section className="content">
              <br></br>
              <table id="example2" className="table table-bordered table-hover dataTable" aria-describedby="example2_info">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Track</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {trackList && trackList?.map((item, index) => {

                    return (
                      <tr style={{}} key={item._id}>
                        <td>{index + 1}</td>

                        <td>{item.Track}</td>
                        <td>{item.Quantity}</td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          </div> */}
        </div>
      </div>
    </div>
  )
}


// Replace the existing button with this updated version

