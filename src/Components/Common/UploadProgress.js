import React from 'react';
import './UploadProgress.css';

/**
 * Upload Progress Component
 * Shows a loading indicator during file uploads
 */
const UploadProgress = ({ progress, message = "Uploading...", isVisible = false }) => {
  if (!isVisible && progress === 0) return null;

  return (
    <div className={`upload-progress-overlay ${isVisible || progress > 0 ? 'show' : ''}`}>
      <div className="upload-progress-container">
        <div className="upload-progress-content">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="upload-message">{message}</p>
          {progress > 0 && (
            <div className="progress" style={{ width: '100%', height: '8px', marginTop: '10px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;

