import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Nav } from '../Common/Nav'
import Papa from 'papaparse'
import { getData, postData, postDataContent } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import Swal from 'sweetalert2';
import { SideBar } from '../Common/SideBar';
export default function FinancialReport() {

    const location = useLocation();
    const userId = location.state?.userId;

    const [jsonData, setJsonData] = useState(null); // State to store parsed JSON data
    const [error, setError] = useState(''); // State for error messages
    const [trackList, setTrackList] = useState([])
    const [userDetails, setUserDetails] = useState({})
    const [allReport, setAllReport] = useState({})

    // Add these to your existing state declarations at the top of the component
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [type, setType] = useState(''); // Default type is 'market'
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        getAllReport()
    }, [])


    const getAllReport = async () => {
        setAllReport([])
        let body = {
            userId: userId
        }
        let result = await postData(base.getFincialReport, body)
        console.log("resultresultresultresultresult", result)
        if (result.data.status === true) {
            setAllReport(result.data.data)
        } else {
            setAllReport([])
        }
    }

    const deleteData = async (id) => {
        let body = {
            reportId: id
        }

        let result = await postData(base.deleteReport, body)
        console.log("resultresultresultresultresult", result)
        if (result.data.status === true) {
            Swal.fire("Success", result.message, result.message);
            getAllReport()
        } else {
            getAllReport()
           // Swal.fire("Error", result.message, result.message);
        }
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!fromDate || !toDate || !selectedFile) {
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
        formData.append('file', selectedFile);

        try {
            const result = await postDataContent(base.uploadFinancialReport, formData);
            if (result.status === true) {
                Swal.fire("Success", "Financial report uploaded successfully", "success");
                setShowModal(false);
                setFromDate('');
                setToDate('');
                setSelectedFile(null);
                getAllReport();
            } else {
                Swal.fire("Error", result.data.message || "Upload failed", "error");
            }
        } catch (error) {
            console.error("Error uploading report:", error);
            Swal.fire("Error", "Failed to upload report", "error");
        }
    };

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
        <div className="dash-detail ">
            <div className="col-md-12">
                <div className="">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3>Financial Report</h3>
                        <button
                            onClick={() => setShowModal(true)}
                            type="Submit"
                            className="btn btn-success"
                        >
                            Add New
                        </button>
                    </div>
                    <section className="content-header">
                        <div>
                            <div className="col-md-6">

                                <table id="topstore" className="table table-bordered table-hover dataTable" aria-describedby="example2_info" style={{ overflowY: "auto", display: "block", border: 0 }} >
                                    <thead>
                                        <tr role="row">
                                            <th >#</th>
                                            <th >Start Date</th>
                                            <th >End Date</th>
                                            <th>Excel Data</th>
                                            <th>Action</th>

                                        </tr>
                                    </thead>
                                    <tbody role="alert" aria-live="polite" aria-relevant="all">
                                        {allReport?.length > 0 && allReport?.map((item, index) => (
                                            <tr className="odd">
                                                <td className="  sorting_1">{index + 1}</td>
                                                <td className="  sorting_1">{item.toDate}</td>
                                                <td className="  ">{item.fromDate}</td>
                                                <td>
                                                    {item.excelUrl != "" &&
                                                        <a onClick={() => { downloadFile(item.excelUrl) }}>
                                                            <i className="fa fa-download"></i> Download Excel
                                                        </a>
                                                    }



                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: 'Are you sure?',
                                                                text: "You won't be able to revert this!",
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                                confirmButtonText: 'Yes, delete it!'
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    deleteData(item._id);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <i className="fa fa-trash"></i> Delete
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>

                            </div>

                        </div>
                    </section>
                </div>
            </div>

            {/* Modal for adding/updating financial report */}
            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: '#000', color: '#fff' }}>
                                <h5 className="modal-title">{currentItemId ? 'Update Financial Report' : 'Add Financial Report'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)} style={{ color: '#fff' }}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ backgroundColor: '#000', color: '#fff' }}>
                                <div className="form-group">
                                    <label>From Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>To Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Upload Excel File</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ backgroundColor: '#000' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

