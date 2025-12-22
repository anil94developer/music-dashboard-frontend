import React, { useEffect, useState, useRef } from 'react';
import Step2Controller from '../../Controllers/One-release-controller/Step2Controller';
import Loader from '../Common/Loader';
import UploadProgress from '../Common/UploadProgress';

export default function STEP2(props) {
  const { setStep, releaseData, setErrors } = props;
  const {
    handleFileChange,
    handleDrop,
    inputRef,
    files,
    setReleaseData,
    uploadProgress,
    fetchReleaseDetails,
    handleDeleteFile
  } = Step2Controller();

  const [isDragging, setIsDragging] = useState(false);
  const [audioPlayerModal, setAudioPlayerModal] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setReleaseData(releaseData);
    setErrors?.([]);
    fetchReleaseDetails(releaseData._id);
  }, [releaseData]);

  // Open audio player modal
  const openAudioPlayer = (file) => {
    setCurrentAudioFile(file);
    setAudioPlayerModal(true);
  };

  // Close audio player modal
  const closeAudioPlayer = () => {
    setAudioPlayerModal(false);
    setCurrentAudioFile(null);
    // Pause audio when closing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadProgress === 0 || uploadProgress >= 100) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropFiles = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (uploadProgress > 0 && uploadProgress < 100) {
      return; // Don't allow drop during upload
    }
    
    await handleDrop(e);
  };

  return (
    <div className="media-uploader step2-container">
      <UploadProgress 
        progress={uploadProgress} 
        message={uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Verifying upload..."}
        isVisible={uploadProgress > 0 && uploadProgress < 100}
      />
      
      {/* Header Section */}
      <div className="step2-header">
        <h2>Upload Media Files</h2>
        <p className="step2-subtitle">Upload your audio files in supported formats</p>
      </div>

      <div className="row">
        {/* Upload Section */}
        <div className="col-lg-6 col-12">
          <div className="upload-section-card">
            <div className="upload-card-header">
              <i className="fa fa-cloud-upload-alt"></i>
              <h3>Upload Files</h3>
            </div>
            
            <div className="upload-area-wrapper">
              <input
                type="file"
                multiple
                accept=".flac,.wav"
                className="file-input-hidden"
                onChange={handleFileChange}
                ref={inputRef}
                disabled={uploadProgress > 0 && uploadProgress < 100}
                id="fileUploadInput"
              />
              <div
                className={`upload-area ${uploadProgress > 0 && uploadProgress < 100 ? 'uploading' : ''} ${isDragging ? 'drag-over' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropFiles}
                onClick={() => {
                  if (uploadProgress === 0 || uploadProgress >= 100) {
                    inputRef.current?.click();
                  }
                }}
              >
                <div className="upload-area-content">
                  <i className={`fa ${isDragging ? 'fa-cloud-download-alt' : 'fa-file-audio'} upload-icon`}></i>
                  <p className="upload-text">
                    {uploadProgress > 0 && uploadProgress < 100 
                      ? `Uploading... ${uploadProgress}%` 
                      : isDragging
                      ? 'Drop files here'
                      : 'Click to browse or drag files here'}
                  </p>
                  <p className="upload-hint">Supports: WAV, FLAC</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress-wrapper">
                <div className="progress-container-custom">
                  <div 
                    className="progress-bar-custom"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* File Format Guidelines */}
            <div className="file-guidelines">
              <div className="guidelines-header">
                <i className="fa fa-info-circle"></i>
                <strong>File Requirements</strong>
              </div>
              <div className="guidelines-content">
                <div className="guideline-item">
                  <i className="fa fa-check-circle"></i>
                  <span><strong>Accepted Formats:</strong> WAV (PCM only), FLAC</span>
                </div>
                <div className="guideline-item">
                  <i className="fa fa-exclamation-circle"></i>
                  <span><strong>File Naming:</strong> Avoid special characters (&, /, %, #, etc.)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="col-lg-6 col-12">
          <div className="instructions-card">
            <div className="instructions-header">
              <i className="fa fa-lightbulb"></i>
              <h3>Upload Instructions</h3>
            </div>
            <div className="instructions-content">
              <div className="instruction-item">
                <div className="instruction-number">1</div>
                <div className="instruction-text">
                  <strong>Select Files</strong>
                  <p>Click the upload area or browse to select your audio files</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number">2</div>
                <div className="instruction-text">
                  <strong>Wait for Upload</strong>
                  <p>Files will upload automatically. Please wait for completion</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number">3</div>
                <div className="instruction-text">
                  <strong>Verify Files</strong>
                  <p>Once uploaded, files will appear in the list below</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files Section */}
      <div className="col-lg-12 col-12">
        <div className="uploaded-files-card">
          <div className="files-card-header">
            <div className="header-left">
              <i className="fa fa-folder-open"></i>
              <h3>Uploaded Files</h3>
              {files && files.length > 0 && (
                <span className="file-count-badge">{files.length} {files.length === 1 ? 'file' : 'files'}</span>
              )}
            </div>
          </div>
          
          {files && files.length > 0 ? (
            <div className="files-table-container">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="file-name-cell">
                          <i className="fa fa-file-audio"></i>
                          <span>{item.fileName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="file-type-badge">{item.fileType || 'Audio'}</span>
                      </td>
                      <td>
                        <button 
                          className="play-link-btn"
                          onClick={() => openAudioPlayer(item)}
                          title="Play audio"
                        >
                          <i className="fa fa-play-circle"></i> Play
                        </button>
                      </td>
                      <td>
                        <button 
                          className="btn-delete-file" 
                          onClick={() => handleDeleteFile(item._id)}
                          title="Delete file"
                        >
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-files-message">
              <i className="fa fa-inbox"></i>
              <p>No files uploaded yet</p>
              <span>Upload your audio files to get started</span>
            </div>
          )}
        </div>
      </div>

      {/* Audio Player Modal */}
      {audioPlayerModal && currentAudioFile && (
        <div className="audio-player-overlay" onClick={closeAudioPlayer}>
          <div className="audio-player-modal" onClick={(e) => e.stopPropagation()}>
            <div className="audio-player-header">
              <div className="audio-player-title">
                <i className="fa fa-music"></i>
                <div>
                  <h4>{currentAudioFile.fileName}</h4>
                  <span className="audio-file-type">{currentAudioFile.fileType || 'Audio'}</span>
                </div>
              </div>
              <button 
                className="audio-player-close"
                onClick={closeAudioPlayer}
                title="Close"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="audio-player-body">
              <div className="audio-player-container">
                <audio
                  ref={audioRef}
                  src={currentAudioFile.fileData}
                  controls
                  className="audio-player-element"
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className="audio-player-info">
                <div className="audio-info-item">
                  <i className="fa fa-file-audio"></i>
                  <span><strong>File:</strong> {currentAudioFile.fileName}</span>
                </div>
                <div className="audio-info-item">
                  <i className="fa fa-info-circle"></i>
                  <span><strong>Type:</strong> {currentAudioFile.fileType || 'Audio'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
