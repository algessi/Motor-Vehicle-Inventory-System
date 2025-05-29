// Form visibility functions
function showLogin() {
  document.getElementById('login-container').classList.remove('hidden');
  document.getElementById('registration-container').classList.add('hidden');
  document.getElementById('forgot-password-container').classList.add('hidden');
}

function showRegistration() {
  document.getElementById('login-container').classList.add('hidden');
  document.getElementById('registration-container').classList.remove('hidden');
  document.getElementById('forgot-password-container').classList.add('hidden');
}

function showForgotPassword() {
  document.getElementById('login-container').classList.add('hidden');
  document.getElementById('registration-container').classList.add('hidden');
  document.getElementById('forgot-password-container').classList.remove('hidden');
}

// Password toggle functionality
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  
  toggleButtons.forEach(button => {
    button.textContent = '👁';
    
    button.addEventListener('click', function() {
      const passwordInput = this.previousElementSibling;
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.textContent = type === 'password' ? '👁' : '•';
    });
  });
}

// Form submission handling
function setupFormSubmissions() {
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = this.querySelector('#username').value;
      const password = this.querySelector('#password').value;
      
      if (!username || !password) {
        showError(this, 'Please enter both username and password');
        return;
      }
      
      // Show loading state
      const submitButton = this.querySelector('.primary-button');
      const spinner = submitButton.querySelector('.spinner');
      submitButton.disabled = true;
      spinner.style.display = 'block';
      
      // Send AJAX request to PHP backend
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      fetch('php/login.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'success') {
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = 'php/dashboard.php';
        } else {
          showError(loginForm, data);
          submitButton.disabled = false;
          spinner.style.display = 'none';
        }
      })
      .catch(error => {
        showError(loginForm, 'An error occurred. Please try again.');
        submitButton.disabled = false;
        spinner.style.display = 'none';
      });
    });
  }
  
  // Handle registration form submission
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullname = this.querySelector('#reg-fullname').value;
      const email = this.querySelector('#reg-email').value;
      const username = this.querySelector('#reg-username').value;
      const password = this.querySelector('#reg-password').value;
      
      if (!fullname || !email || !username || !password) {
        showError(this, 'All fields are required');
        return;
      }
      
      if (!validateEmail(email)) {
        showError(this, 'Please enter a valid email address');
        return;
      }
      
      if (!validatePassword(password)) {
        showError(this, 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters');
        return;
      }
      
      const submitButton = this.querySelector('.primary-button');
      const spinner = submitButton.querySelector('.spinner');
      submitButton.disabled = true;
      spinner.style.display = 'block';
      
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      
      fetch('php/register.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'success') {
          alert('Registration successful! Please sign in.');
          showLogin();
        } else {
          showError(registrationForm, data);
        }
        submitButton.disabled = false;
        spinner.style.display = 'none';
      })
      .catch(error => {
        showError(registrationForm, 'An error occurred. Please try again.');
        submitButton.disabled = false;
        spinner.style.display = 'none';
      });
    });
  }
  
  // Handle forgot password form submission
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('#reset-email').value;
      
      if (!email) {
        showError(this, 'Please enter your email address');
        return;
      }
      
      if (!validateEmail(email)) {
        showError(this, 'Please enter a valid email address');
        return;
      }
      
      const submitButton = this.querySelector('.primary-button');
      const spinner = submitButton.querySelector('.spinner');
      submitButton.disabled = true;
      spinner.style.display = 'block';
      
      setTimeout(() => {
        alert(`Password reset instructions have been sent to ${email}`);
        submitButton.disabled = false;
        spinner.style.display = 'none';
        showLogin();
      }, 1000);
    });
  }
}

// Validation helpers
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

function showError(form, message) {
  let errorElement = form.querySelector('.error-message');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    form.insertBefore(errorElement, form.firstChild);
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 3000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  showLogin();
  setupPasswordToggles();
  setupFormSubmissions();
  
  // Set focus on username field
  const usernameInput = document.getElementById('username');
  if (usernameInput) {
    usernameInput.focus();
  }
});