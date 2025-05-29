<?php require 'auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard - Motor Vehicle Inventory System</title>
    <link rel="stylesheet" href="../css/dashboard.css" />
  </head>
  <body>
    <div class="container">
      <header class="header">
        <div class="header-content">
          <div class="logo-container">
            <div class="logo">
              <img src="../images/assets-logo.jpg" alt="AMD Logo" />
            </div>
            <div class="logo-text">
              <h1>Motor Vehicle Inventory System</h1>
            </div>
          </div>
          <div class="header-actions">
            <div class="session-timer">
              Session expires in: <span id="session-timer">15:00</span>
            </div>
            <button id="logout-btn" class="logout-button">
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <aside class="sidebar">
          <div class="user-profile">
            <div class="user-avatar">
              <div class="avatar-circle">A</div>
            </div>
            <div class="user-info">
              <h3>Administrator</h3>
              <p>Assets Management Division</p>
            </div>
          </div>

          <div class="profile-details">
            <h4>Profile Information</h4>
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">admin@muntinlupa.gov.ph</span>
            </div>
            <div class="detail-item">
              <span class="label">Role:</span>
              <span class="value">System Administrator</span>
            </div>
            <div class="detail-item">
              <span class="label">Department:</span>
              <span class="value">Assets Management Division</span>
            </div>
            <div class="detail-item">
              <span class="label">Last Login:</span>
              <span class="value">May 25, 2025 - 2:30 PM</span>
            </div>
            <div class="status-item">
              <div class="status-indicator"></div>
              <span class="status-text">Active Session</span>
            </div>
          </div>
        </aside>

        <div class="dashboard-content">
          <div class="dashboard-text">
            <h1>DASHBOARD</h1>
            <p>Assets Management Division</p>
          </div>

          <div class="file-uploader">
            <h3>XML File Upload</h3>
            <div class="upload-area" id="upload-area">
              <div class="upload-icon">📁</div>
              <p>Drag & drop your XML file here or click to browse</p>
              <input type="file" id="xml-file-input" accept=".xml" hidden />
              <button type="button" class="browse-button" onclick="document.getElementById('xml-file-input').click()">
                Browse Files
              </button>
            </div>
            <div class="file-info" id="file-info" style="display: none;">
              <p><strong>Selected File:</strong> <span id="file-name"></span></p>
              <p><strong>File Size:</strong> <span id="file-size"></span></p>
              <button type="button" class="upload-button" id="upload-button">Upload XML</button>
            </div>
            <div class="upload-status" id="upload-status"></div>
          </div>
        </div>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <p>© 2025 Assets Management Division. All Rights Reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Help</a>
          </div>
        </div>
      </footer>
    </div>

    <script>
      const logoutBtn = document.getElementById('logout-btn');
      let sessionTimeout;
      let sessionInterval;

      logoutBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to sign out?')) {
          clearTimeout(sessionTimeout);
          clearInterval(sessionInterval);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          sessionStorage.clear();
          window.location.href = 'logout.php';
        }
      });
    </script>
    <script src="../js/dashboard.js"></script>
  </body>
</html>
