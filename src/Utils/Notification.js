import Swal from 'sweetalert2';

/**
 * Show success notification
 * @param {string} message - Success message
 * @param {string} title - Optional title (default: "Success")
 */
export const showSuccess = (message, title = "Success") => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal2-toast',
    }
  });
};

/**
 * Show error notification
 * @param {string} message - Error message
 * @param {string} title - Optional title (default: "Error")
 */
export const showError = (message, title = "Error") => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal2-toast',
    }
  });
};

/**
 * Show info notification
 * @param {string} message - Info message
 * @param {string} title - Optional title (default: "Info")
 */
export const showInfo = (message, title = "Info") => {
  Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal2-toast',
    }
  });
};

/**
 * Show warning notification
 * @param {string} message - Warning message
 * @param {string} title - Optional title (default: "Warning")
 */
export const showWarning = (message, title = "Warning") => {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal2-toast',
    }
  });
};

/**
 * Show upload progress notification
 * @param {number} progress - Upload progress (0-100)
 * @param {string} message - Optional message
 */
export const showUploadProgress = (progress, message = "Uploading...") => {
  if (progress === 0) {
    Swal.fire({
      title: message,
      html: `
        <div class="upload-progress-container">
          <div class="progress" style="height: 25px; margin-top: 10px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                 role="progressbar" 
                 style="width: ${progress}%"
                 aria-valuenow="${progress}" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
              ${progress}%
            </div>
          </div>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  } else if (progress < 100) {
    Swal.update({
      html: `
        <div class="upload-progress-container">
          <p>${message}</p>
          <div class="progress" style="height: 25px; margin-top: 10px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                 role="progressbar" 
                 style="width: ${progress}%"
                 aria-valuenow="${progress}" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
              ${progress}%
            </div>
          </div>
        </div>
      `
    });
  } else {
    Swal.close();
  }
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showUploadProgress
};

