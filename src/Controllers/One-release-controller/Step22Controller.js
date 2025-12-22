import React, { useState } from 'react';
import Swal from "sweetalert2";
import { postData } from '../../Services/Ops';
import { base } from '../../Constants/Data.constant';

const Step2Controller = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [releaseData, setReleaseData] = useState({});

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const updatedFiles = selectedFiles.map((file) => ({
            fileName: file.name,
            fileData: file,
            fileType: file.type.startsWith("audio") ? "audio" : file.type.startsWith("video") ? "video" : "image"
        }));
        setMediaFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    }
    
    
    ;

    const handleRemove = (fileName) => {
        setMediaFiles((prevFiles) => prevFiles.filter((file) => file.fileName !== fileName));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        // releaseData._id,
        formData.append("_id", "671cb18ba0ff2158d4208ed6");
    
        mediaFiles.forEach((file) => {
            formData.append('mediaFiles', file.fileData, file.fileName); // use 'mediaFiles' field
        });
    
        try {
            const result = await postData(base.releaseStep2, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            Swal.fire("Success", result.message, result.message);
        } catch (error) {
            Swal.fire("Error", "An error occurred while uploading files.", "error");
        }
    };

    return {
        handleFileChange,
        mediaFiles,
        handleSubmit,
        handleRemove,
        setReleaseData
    };
};

export default Step2Controller;
