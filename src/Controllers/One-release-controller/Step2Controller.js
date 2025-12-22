import React, { useState, useRef } from 'react';
import { postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';
import axios from 'axios';
import Swal from 'sweetalert2';
import { showSuccess, showError, showUploadProgress } from '../../Utils/Notification';

const Step2Controller = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [releaseData, setReleaseData] = useState({});
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef(null);

    // Fetch release details
    const fetchReleaseDetails = async (releaseId) => {
        try {
            const body = { releaseId };
            const result = await postData(base.releaseDetails, body);
            if (result.data.status) {
                setFiles(result.data.data.step2);
            } else {
                showError("Failed to fetch release details", "Error");
            }
        } catch (error) {
            console.error("Error fetching release details:", error);
            showError("Failed to fetch release details", "Error");
        }
    };

    // delete file 
    const handleDeleteFile = async (fileId) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this file!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!"
            });
    
            if (result.isConfirmed) {
                let body={
                    fileId : fileId ,
                    releaseId : releaseData._id
                }
                
                await postData(base.deleteFile, body );
    
                showSuccess("Your file has been deleted.", "Deleted!");
                setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            showError("Failed to delete the file.", "Error");
        }
    };

    // Handle file upload (for both input change and drag-drop)
    const uploadFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return;
    
        // Filter files by accepted types
        const acceptedTypes = ['.flac', '.wav'];
        const validFiles = Array.from(fileList).filter(file => {
            const fileName = file.name.toLowerCase();
            return acceptedTypes.some(type => fileName.endsWith(type));
        });

        if (validFiles.length === 0) {
            showError("Please upload only WAV or FLAC files.", "Invalid File Type");
            return;
        }
    
        const formData = new FormData();
        formData.append("id", releaseData._id);
    
        validFiles.forEach(file => {
            formData.append("files", file);
        });
    
        let token = localStorage.getItem("token");
    
        try {
            // Show initial upload progress
            setUploadProgress(1);
            showUploadProgress(1, "Starting upload...");
    
            const config = {
                headers: { 
                    Authorization: token, 
                    "Content-Type": "multipart/form-data", 
                    "Cache-Control": "no-cache" 
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                    showUploadProgress(progress, `Uploading... ${progress}%`);
                },
            };
    
            await axios.post(base.releaseStep2, formData, config);
            
            // Ensure the progress reaches 100% before verifying
            setUploadProgress(100);
            showUploadProgress(100, "Upload complete. Verifying...");
    
            // Simulate verification delay
            setTimeout(() => {
                showSuccess("File uploaded and verified successfully.", "Upload Complete");
                fetchReleaseDetails(releaseData._id);
                setUploadProgress(0);
            }, 2000);
    
        } catch (error) {
            console.error("Upload error:", error);
            setUploadProgress(0);
            showError("An error occurred while uploading files.", "Upload Error");
        } finally {
            if (inputRef.current) {
                inputRef.current.value = "";  // Clear input field
            }
        }
    };

    // Handle file input change
    const handleFileChange = async (e) => {
        if (!e.target.files || !e.target.files.length) return;
        await uploadFiles(e.target.files);
    };

    // Handle drag and drop
    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            await uploadFiles(droppedFiles);
        }
    };
    

    // Remove selected file
    const handleRemove = (fileName) => {
        setMediaFiles((prevFiles) => prevFiles.filter((file) => file.fileName !== fileName));
    };

    return {
        handleDeleteFile,
        handleFileChange,
        handleDrop,
        mediaFiles,
        handleRemove,
        setReleaseData,
        uploadProgress,
        files,
        fetchReleaseDetails,
        inputRef
    };
};

export default Step2Controller;
