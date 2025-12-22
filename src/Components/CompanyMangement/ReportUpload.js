import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Nav } from '../Common/Nav'
import Papa from 'papaparse'
import { getData, postData, postDataContent } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import { SideBar } from '../Common/SideBar';
import FinancialReport from './FinancialReport';
import Wallet from './Wallet';
import { Button } from 'bootstrap';
import { showSuccess, showError, showUploadProgress } from '../../Utils/Notification';
import UploadProgress from '../Common/UploadProgress';
import axios from 'axios';
export default function ReportUpload() {

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
    const [todate, setTodate] = useState('')
    const [fromdate, setFromdate] = useState('')
    const [reportShowModal, setReportShowModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Add this function to handle file upload
    const handleUploadExcel = async () => {

        if (!selectedFile || !currentItemId) {
            showError("Please select a file first", "Error");
            return;
        }

        // Create FormData to send the file
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', type);
        formData.append('id', currentItemId);

        try {
            setIsUploading(true);
            setUploadProgress(1);
            showUploadProgress(1, "Starting upload...");

            let token = localStorage.getItem("token");
            const result = await axios.post(base.uploadReportExcelFile, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                    showUploadProgress(progress, `Uploading... ${progress}%`);
                }
            });

            if (result.data.status === true) {
                setUploadProgress(100);
                showUploadProgress(100, "Upload complete. Processing...");
                setTimeout(() => {
                    showSuccess("File uploaded successfully", "Success");
                setShowModal(false);
                setSelectedFile(null);
                    setUploadProgress(0);
                    setIsUploading(false);
                getAllReport(); // Refresh the data
                }, 1000);
            } else {
                setUploadProgress(0);
                setIsUploading(false);
                showError(result.data.message || "Upload failed", "Error");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setUploadProgress(0);
            setIsUploading(false);
            showError("Something went wrong during upload", "Upload Error");
        }
    };




    useEffect(() => {
        // getTrack()
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
                        let cleanedKey = key.trim().replace(/\s+/g, ''); // Trim and remove spaces within the key
                        cleanedKey = cleanedKey.trim().replace('(', '_');
                        cleanedKey = cleanedKey.trim().replace(')', '');

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








    const uploadStoreExcel = async () => {
        let body = {
            userId: userId,
            data: jsonData,
            toDate: todate,
            fromDate: fromdate
        }
        console.log(body)
        let result = await postData(
            type === 'track' ?
                base.uploadTracksReport :
                type === 'store' ?
                    base.uploadStoreReport :
                    type === 'market' ?
                        base.uploadMarketReport :
                        base.uploadOverviewReport,

            body)
        console.log(result)
        if (result.data.status === true) {
            showSuccess(result.message, "Success");
            getAllReport()
            setReportShowModal(false)
        } else {
            showError(result.message, "Error");
        }
    }

    // const uploadStoreExcel = async () => {
    //     let body = {
    //         userId: userId,
    //         data: jsonData
    //     }
    //     let result = await postData(base.uploadStoreReport, body)
    //     console.log(result)
    //     if (result.data.status === true) {
    //         Swal.fire("Success", result.message, result.message);

    //     } else {
    //         Swal.fire("Error", result.message, result.message);
    //     }
    // }


    // const uploadMarketExcel = async () => {
    //     let body = {
    //         userId: userId,
    //         data: jsonData
    //     }
    //     let result = await postData(base.uploadMarketReport, body)
    //     console.log(result)
    //     if (result.data.status === true) {
    //         Swal.fire("Success", result.message, result.message);
    //     } else {
    //         Swal.fire("Error", result.message, result.message);
    //     }
    // }

    // const uploadOverviewExcel = async () => {
    //     let body = {
    //         userId: userId,
    //         data: jsonData
    //     }
    //     let result = await postData(base.uploadOverviewReport, body)
    //     console.log(result)
    //     if (result.data.status === true) {
    //         Swal.fire("Success", result.message, result.message);
    //     } else {
    //         Swal.fire("Error", result.message, result.message);
    //     }
    // }


    const getAllReport = async () => {
        setAllReport([])
        let body = {
            userId: userId
        }
        let result = await postData(base.getAllFinancialReport, body)
        console.log("resultresultresultresultresult", result)
        setAllReport(result?.data?.data)
    }

    const deleteData = async (name) => {
        let body = {
            userId: userId,
            type: name
        }

        let result = await postData(base.deleteFinancialReport, body)
        console.log("resultresultresultresultresult", result)
        if (result.data.status === true) {
            showSuccess(result.message, "Success");
            getAllReport()
        } else {
            showError(result.message, "Error");
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
            <UploadProgress 
                progress={uploadProgress} 
                message={uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Processing..."}
                isVisible={isUploading || (uploadProgress > 0 && uploadProgress < 100)}
            />
            <SideBar />
            <div className="main-cotent">
                <Nav />
                <div className="content-wrapper">


                    <br></br>

                    <div className="dash-detail " key={allReport?.storeData?.length}>
                        <div className="col-md-12">
                            <div className="">
                                <div className="row align-items-center mb-3">
                                    <div className="col-md-10">
                                        <h3 className="mb-0">Store Upload Excel</h3>
                                    </div>
                                    <div className="col-md-2 text-right">
                                        <button
                                            className='btn btn-success'
                                            onClick={() => {
                                                setReportShowModal(true);
                                                setType('store'); // Set the type to'market'
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <i className="fa fa-plus-circle mr-2"></i>Add New
                                        </button>
                                    </div>
                                </div>

                                <section className="content-header">

                                    {/* Upload Input */}


                                    {allReport?.storeData?.length > 0 &&
                                        <div>
                                            <div className="col-md-12">

                                                <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ overflowY: "auto", display: "block", border: 0, height: 450 }} >
                                                    <thead>
                                                        <tr role="row">
                                                            <th >#</th>
                                                            <th >Name</th>
                                                            <th>To Date</th>
                                                            <th>From Date</th>
                                                          
                                                            <th>Earning (GBP)</th>
                                                            <th>Excel Data</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                                                        {allReport?.storeData.length > 0 && allReport?.storeData.map((item, index) => (
                                                            <tr className="odd">
                                                                <td className="  sorting_1">{index + 1}</td>
                                                                <td className="  sorting_1">{item.Store}</td>
                                                                <td className="  ">{item.toDate}</td>
                                                                <td className="  ">{item.fromDate}</td>
                                                               
                                                                <td className="  ">{item.Earnings_GBP}</td>
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
                                    }

                                </section>
                            </div>
                        </div>
                    </div>
                    <br></br>

                    <div className="dash-detail ">

                        <div className="col-md-12">
                            <div className="">
                                <div className="row align-items-center mb-3">
                                    <div className="col-md-10">
                                        <h3 className="mb-0">Market Upload Excel</h3>
                                    </div>
                                    <div className="col-md-2 text-right">
                                        <button
                                            className='btn btn-success'
                                            onClick={() => {
                                                setReportShowModal(true);
                                                setType('market'); // Set the type to'market'
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <i className="fa fa-plus-circle mr-2"></i>Add New
                                        </button>
                                    </div>
                                </div>
                                <section className="content-header">

                                    {allReport?.marketData?.length > 0 &&
                                        <div>
                                            <div className="col-md-12">

                                                <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                                                    <thead>
                                                        <tr role="row">
                                                            <th >#</th>
                                                            <th >name</th>
                                                            <th>To Date</th>
                                                            <th>From Date</th>
                                                            <th>Earning (GBP)</th>
                                                            <th>Excel Upload</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                                                        {allReport?.marketData.length > 0 && allReport?.marketData.map((item, index) => (
                                                            <tr className="odd">
                                                                <td className="  sorting_1">{index + 1}</td>
                                                                <td className="  sorting_1">{item.Market}</td>
                                                                <td className="  ">{item.toDate}</td>
                                                                <td className="  ">{item.fromDate}</td>
                                                                <td className="  ">{item.Earnings_GBP}</td>

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




                                                <button
                                                    onClick={() => deleteData("market")}
                                                    type="Submit"
                                                    className="btn btn-danger"
                                                >
                                                    Delete
                                                </button>
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
                                <div className="row align-items-center mb-3">
                                    <div className="col-md-10">
                                        <h3 className="mb-0">Tracks Upload Excel</h3>
                                    </div>
                                    <div className="col-md-2 text-right">
                                        <button
                                            className='btn btn-success'
                                            onClick={() => {
                                                setReportShowModal(true);
                                                setType('track'); // Set the type to'market'
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <i className="fa fa-plus-circle mr-2"></i>Add New
                                        </button>
                                    </div>
                                </div>
                                <section className="content-header">
                                    {allReport?.trackData?.length > 0 &&
                                        <div>
                                            <div className="col-md-12">

                                                <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                                                    <thead>
                                                        <tr role="row">
                                                            <th >#</th>
                                                            <th >name</th>
                                                            <th>To Date</th>
                                                            <th>From Date</th>
                                                            <th>Earning (GBP)</th>
                                                            <th>Excel Data</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                                                        {allReport?.trackData.length > 0 && allReport?.trackData.map((item, index) => (
                                                            <tr className="odd">
                                                                <td className="  sorting_1">{index + 1}</td>
                                                                <td className="  sorting_1">{item.Track}</td>
                                                                <td className='' sorting_1>{item.toDate}</td>
                                                                <td className='' sorting_1 >{item.fromDate}</td>
                                                                <td className="  ">{item.Earnings_GBP}</td>
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

                                    }



                                </section>
                            </div>
                        </div>
                    </div>
                    <br></br>

                    <div className="dash-detail ">
                        <div className="col-md-12">
                            <div className="">
                
                                <div className="row align-items-center mb-3">
                                    <div className="col-md-10">
                                        <h3 className="mb-0">OverView Upload Excel</h3>
                                    </div>
                                    <div className="col-md-2 text-right">
                                        <button
                                            className='btn btn-success'
                                            onClick={() => {
                                                setReportShowModal(true);
                                                setType('overview'); // Set the type to'market'
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <i className="fa fa-plus-circle mr-2"></i>Add New
                                        </button>
                                    </div>
                                </div>
                                <section className="content-header">
                                    {allReport?.overviewData?.length > 0 &&
                                        <div>
                                            <div className="col-md-12">

                                                <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ height: 300, overflowY: "auto", display: "block", border: 0 }} >
                                                    <thead>
                                                        <tr role="row">
                                                            <th >#</th>
                                                            <th>To Date</th>
                                                            <th>From Date</th>
                                                            <th >Date</th>
                                                            <th>Earning (GBP)</th>
                                                            <th>Excel Data</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                                                        {allReport?.overviewData.length > 0 && allReport?.overviewData.map((item, index) => (
                                                            <tr className="odd">
                                                                <td className="  sorting_1">{index + 1}</td>
                                                                <td className="  sorting_1">{item.toDate}</td>
                                                                <td className="  sorting_1">{item.fromDate}</td>
                                                                <td className="  sorting_1">{item.Date}</td>
                                                                <td className="  ">{item.Earnings_GBP}</td>
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
                                                                            setType('overview'); // Set the type to 'market'
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
                                                    onClick={() => deleteData("overview")}
                                                    type="Submit"
                                                    className="btn btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>
                                    } 

                                </section>
                            </div>
                        </div>
                    </div>
                    <br></br>

                    <br></br>

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


                {/* <FinancialReport /> */}
            </div>

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

            {reportShowModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '8px', border: '1px solid #333' }}>
                            <div className="modal-header" style={{
                                backgroundColor: 'rgb(0, 0, 0)',
                                color: 'white',
                                borderBottom: '1px solid #333',
                                padding: '15px 20px'
                            }}>
                                <h4 className="modal-title">Upload Excel File</h4>
                                <button type="button" className="close" onClick={() => setReportShowModal(false)} style={{ color: 'white' }}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{
                                backgroundColor: 'rgb(0, 0, 0)',
                                color: 'white',
                                padding: '20px'
                            }}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group mb-4">
                                            <label className="form-label mb-2">To Date:</label>
                                            <input
                                                type="date"
                                                onChange={(e) => { setTodate(e.target.value) }}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: '#222',
                                                    color: 'white',
                                                    border: '1px solid #444',
                                                    padding: '10px',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="form-label mb-2">From Date:</label>
                                            <input
                                                type="date"

                                                onChange={(e) => { setFromdate(e.target.value) }}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: '#222',
                                                    color: 'white',
                                                    border: '1px solid #444',
                                                    padding: '10px',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label mb-2">Select Excel:</label>
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileChange}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: '#222',
                                                    color: 'white',
                                                    border: '1px solid #444',
                                                    padding: '10px',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{
                                backgroundColor: 'rgb(0, 0, 0)',
                                borderTop: '1px solid #333',
                                padding: '15px 20px'
                            }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setReportShowModal(false)}
                                    style={{
                                        marginRight: '10px',
                                        padding: '8px 16px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={uploadStoreExcel}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        backgroundColor: '#007bff',
                                        border: 'none'
                                    }}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


// Replace the existing button with this updated version

