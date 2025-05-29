// Session timeout management
let sessionTimeout;
let sessionInterval;
const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Check authentication before allowing access
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn || isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function resetSessionTimeout() {
  clearTimeout(sessionTimeout);
  clearInterval(sessionInterval);
  sessionTimeout = setTimeout(handleSessionTimeout, TIMEOUT_DURATION);
  startSessionCountdown(TIMEOUT_DURATION);
}

function handleSessionTimeout() {
  alert('Your session has expired due to inactivity. You will be redirected to the login page.');
  logout();
}

function startSessionCountdown(duration) {
  const timerElement = document.getElementById('session-timer');
  let timeLeft = duration;

  sessionInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(sessionInterval);
      handleSessionTimeout();
      return;
    }

    timeLeft -= 1000;
  }, 1000);
}

// File upload functionality
function initializeFileUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('xml-file-input');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');
  const uploadButton = document.getElementById('upload-button');
  const uploadStatus = document.getElementById('upload-status');

  if (!uploadArea || !fileInput) return;

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  uploadButton?.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
      uploadXMLFile(file);
    }
  });

  function handleFileSelection(file) {
    if (!file.name.toLowerCase().endsWith('.xml')) {
      uploadStatus.innerHTML = '<p style="color: var(--error-500);">Please select a valid XML file.</p>';
      return;
    }

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';
    uploadStatus.innerHTML = '';
    
    resetSessionTimeout();
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function uploadXMLFile(file) {
    uploadStatus.innerHTML = '<p style="color: var(--primary-600);">Uploading file...</p>';
    uploadButton.disabled = true;

    setTimeout(() => {
      uploadStatus.innerHTML = '<p style="color: var(--success-500);">✓ File uploaded successfully!</p>';
      uploadButton.disabled = false;
      resetSessionTimeout();
    }, 2000);
  }
}

function logout() {
  fetch('php/logout.php')
    .then(() => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      sessionStorage.clear();
      window.location.href = 'index.html';
    })
    .catch(() => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      sessionStorage.clear();
      window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', function() {
  if (!checkAuth()) {
    return;
  }

  resetSessionTimeout();

  ['click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetSessionTimeout);
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to sign out?')) {
        clearTimeout(sessionTimeout);
        clearInterval(sessionInterval);
        logout();
      }
    });
  }

  initializeFileUpload();

  const username = localStorage.getItem('username');
  if (username) {
    const userInitial = document.querySelector('.avatar-circle');
    if (userInitial) {
      userInitial.textContent = username.charAt(0).toUpperCase();
    }
    
    const userName = document.querySelector('.user-info h3');
    if (userName) {
      userName.textContent = username;
    }
  }
});