import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Nav } from '../Common/Nav'
import { getData, postData, postDataContent } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import { SideBar } from '../Common/SideBar';
import FinancialReport from './FinancialReport';
import Wallet from './Wallet';
import { Button } from 'bootstrap';
import { showSuccess, showError, showUploadProgress } from '../../Utils/Notification';
import UploadProgress from '../Common/UploadProgress';
import axios from 'axios';

const Papa = window.Papa;

// Modern UI Styles
const modernStyles = {
    container: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px'
    },
    card: {
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 50px rgba(0,0,0,0.15)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2d3748',
        margin: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    btnSecondary: {
        background: '#f7fafc',
        border: '2px solid #e2e8f0',
        color: '#4a5568',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    btnDanger: {
        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        border: 'none',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(245, 101, 101, 0.3)'
    },
    btnInfo: {
        background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
        border: 'none',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginRight: '8px'
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    tableHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    tableRow: {
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        transition: 'all 0.2s ease'
    },
    tableCell: {
        padding: '16px',
        color: '#4a5568',
        fontSize: '14px'
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
    },
    modalContent: {
        background: '#ffffff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalHeader: {
        padding: '24px 30px',
        borderBottom: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '16px 16px 0 0'
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: '700',
        margin: 0
    },
    modalBody: {
        padding: '30px'
    },
    modalFooter: {
        padding: '20px 30px',
        borderTop: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        background: '#f7fafc',
        borderRadius: '0 0 16px 16px'
    },
    formGroup: {
        marginBottom: '24px'
    },
    formLabel: {
        display: 'block',
        marginBottom: '8px',
        color: '#2d3748',
        fontWeight: '600',
        fontSize: '14px'
    },
    formControl: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        background: '#ffffff'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#a0aec0'
    },
    emptyStateIcon: {
        fontSize: '64px',
        marginBottom: '20px',
        opacity: 0.5
    },
    emptyStateText: {
        fontSize: '18px',
        fontWeight: '500',
        marginBottom: '10px'
    },
    emptyStateSubtext: {
        fontSize: '14px',
        color: '#718096'
    }
};

export default function ReportUpload() {
    const location = useLocation();
    const userId = location.state?.userId;

    const [jsonData, setJsonData] = useState(null);
    const [error, setError] = useState('');
    const [trackList, setTrackList] = useState([])
    const [userDetails, setUserDetails] = useState({})
    const [allReport, setAllReport] = useState({})

    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [currentItemId, setCurrentItemId] = useState(null);
    const [type, setType] = useState('');
    const [todate, setTodate] = useState('')
    const [fromdate, setFromdate] = useState('')
    const [reportShowModal, setReportShowModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadExcel = async () => {
        if (!selectedFile || !currentItemId) {
            showError("Please select a file first", "Error");
            return;
        }

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
                    getAllReport();
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'text/csv') {
                setError('');
                parseCSV(file);
            } else {
                setError('Please upload a valid CSV file.');
            }
        }
    };

    const parseCSV = (file) => {
        Papa.parse(file, {
            complete: (result) => {
                console.log('CSV Parsed:', result);
                const json = result.data.map((row) => {
                    const cleanedRow = {};
                    Object.keys(row).forEach((key) => {
                        let cleanedKey = key.trim().replace(/\s+/g, '');
                        cleanedKey = cleanedKey.trim().replace('(', '_');
                        cleanedKey = cleanedKey.trim().replace(')', '');
                        cleanedRow[cleanedKey] = row[key];
                    });
                    return cleanedRow;
                });
                console.log('JSON with cleaned keys:', json);
                setJsonData(json);
            },
            header: true,
            skipEmptyLines: true,
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
            const link = document.createElement('a');
            if (url.startsWith('http:')) {
                url = url.replace('http:', 'https:');
            }
            if (url.startsWith('/') && !url.startsWith('//')) {
                url = window.location.origin + url;
            }
            link.href = url;
            const filename = url.split('/').pop() || name + '.xlsx';
            link.download = filename;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download file. Please try again.");
        }
    }

    const renderTable = (data, columns, type) => {
        if (!data || data.length === 0) {
            return (
                <div style={modernStyles.emptyState}>
                    <div style={modernStyles.emptyStateIcon}>📊</div>
                    <div style={modernStyles.emptyStateText}>No Data Available</div>
                    <div style={modernStyles.emptyStateSubtext}>Click "Add New" to upload your first report</div>
                </div>
            );
        }

        return (
            <div style={{ overflowX: 'auto', borderRadius: '12px' }}>
                <table style={modernStyles.table}>
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} style={modernStyles.tableHeader}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} style={modernStyles.tableRow} onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f7fafc';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                            }}>
                                <td style={modernStyles.tableCell}>{index + 1}</td>
                                {type === 'store' && <td style={modernStyles.tableCell}>{item.Store}</td>}
                                {type === 'market' && <td style={modernStyles.tableCell}>{item.Market}</td>}
                                {type === 'track' && <td style={modernStyles.tableCell}>{item.Track}</td>}
                                {type === 'overview' && <td style={modernStyles.tableCell}>{item.toDate}</td>}
                                {type !== 'overview' && <td style={modernStyles.tableCell}>{item.toDate}</td>}
                                {type !== 'overview' && <td style={modernStyles.tableCell}>{item.fromDate}</td>}
                                {type === 'overview' && <td style={modernStyles.tableCell}>{item.fromDate}</td>}
                                {type === 'overview' && <td style={modernStyles.tableCell}>{item.Date}</td>}
                                <td style={modernStyles.tableCell}>
                                    <strong style={{ color: '#22c55e' }}>£{item.Earnings_GBP || '0.00'}</strong>
                                </td>
                                <td style={modernStyles.tableCell}>
                                    {item.Excel != "" && (
                                        <a 
                                            onClick={() => { downloadFile(item.Excel, item.name) }}
                                            style={modernStyles.link}
                                            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                            onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                        >
                                            <i className="fa fa-download"></i> Download
                                        </a>
                                    )}
                                    <button
                                        style={modernStyles.btnInfo}
                                        onClick={() => {
                                            setCurrentItemId(item._id);
                                            setShowModal(true);
                                            setType(type);
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(66, 153, 225, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="fa fa-file-excel-o"></i> Upload Excel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => deleteData(type)}
                        style={modernStyles.btnDanger}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(245, 101, 101, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(245, 101, 101, 0.3)';
                        }}
                    >
                        <i className="fa fa-trash"></i> Delete All
                    </button>
                </div>
            </div>
        );
    };

    const renderSection = (title, data, columns, type) => {
        return (
            <div style={modernStyles.card}>
                <div style={modernStyles.header}>
                    <h3 style={modernStyles.title}>{title}</h3>
                    <button
                        onClick={() => {
                            setReportShowModal(true);
                            setType(type);
                        }}
                        style={modernStyles.btnPrimary}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                        }}
                    >
                        <i className="fa fa-plus-circle"></i> Add New
                    </button>
                </div>
                {renderTable(data, columns, type)}
            </div>
        );
    };

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
                <div className="content-wrapper" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
                    {renderSection(
                        "Store Upload Excel",
                        allReport?.storeData,
                        ['#', 'Name', 'To Date', 'From Date', 'Earning (GBP)', 'Actions'],
                        'store'
                    )}

                    {renderSection(
                        "Market Upload Excel",
                        allReport?.marketData,
                        ['#', 'Name', 'To Date', 'From Date', 'Earning (GBP)', 'Actions'],
                        'market'
                    )}

                    {renderSection(
                        "Tracks Upload Excel",
                        allReport?.trackData,
                        ['#', 'Name', 'To Date', 'From Date', 'Earning (GBP)', 'Actions'],
                        'track'
                    )}

                    {renderSection(
                        "Overview Upload Excel",
                        allReport?.overviewData,
                        ['#', 'To Date', 'From Date', 'Date', 'Earning (GBP)', 'Actions'],
                        'overview'
                    )}
                </div>
            </div>

            {/* Upload Excel Modal */}
            {showModal && (
                <div style={modernStyles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={modernStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={modernStyles.modalHeader}>
                            <h4 style={modernStyles.modalTitle}>Upload Excel File</h4>
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'white', 
                                    fontSize: '24px', 
                                    cursor: 'pointer',
                                    padding: '0',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div style={modernStyles.modalBody}>
                            <div style={modernStyles.formGroup}>
                                <label style={modernStyles.formLabel}>Select Excel File:</label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const file = e.target.files[0];
                                            setSelectedFile(file);
                                            console.log("Selected file:", file.name, file.type);
                                        }
                                    }}
                                    style={modernStyles.formControl}
                                />
                            </div>
                        </div>
                        <div style={modernStyles.modalFooter}>
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)}
                                style={modernStyles.btnSecondary}
                            >
                                Close
                            </button>
                            <button 
                                type="button" 
                                onClick={handleUploadExcel}
                                style={modernStyles.btnPrimary}
                            >
                                <i className="fa fa-upload"></i> Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Report Modal */}
            {reportShowModal && (
                <div style={modernStyles.modalOverlay} onClick={() => setReportShowModal(false)}>
                    <div style={modernStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={modernStyles.modalHeader}>
                            <h4 style={modernStyles.modalTitle}>Upload Excel File</h4>
                            <button 
                                type="button" 
                                onClick={() => setReportShowModal(false)}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'white', 
                                    fontSize: '24px', 
                                    cursor: 'pointer',
                                    padding: '0',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div style={modernStyles.modalBody}>
                            <div style={modernStyles.formGroup}>
                                <label style={modernStyles.formLabel}>To Date:</label>
                                <input
                                    type="date"
                                    onChange={(e) => { setTodate(e.target.value) }}
                                    style={modernStyles.formControl}
                                />
                            </div>
                            <div style={modernStyles.formGroup}>
                                <label style={modernStyles.formLabel}>From Date:</label>
                                <input
                                    type="date"
                                    onChange={(e) => { setFromdate(e.target.value) }}
                                    style={modernStyles.formControl}
                                />
                            </div>
                            <div style={modernStyles.formGroup}>
                                <label style={modernStyles.formLabel}>Select CSV File:</label>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    style={modernStyles.formControl}
                                />
                                {error && (
                                    <div style={{ color: '#e53e3e', fontSize: '13px', marginTop: '8px' }}>
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={modernStyles.modalFooter}>
                            <button
                                type="button"
                                onClick={() => setReportShowModal(false)}
                                style={modernStyles.btnSecondary}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={uploadStoreExcel}
                                style={modernStyles.btnPrimary}
                            >
                                <i className="fa fa-upload"></i> Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


// Replace the existing button with this updated version
