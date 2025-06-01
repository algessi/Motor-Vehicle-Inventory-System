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
        const icon = document.createElement('i');
        icon.className = 'fa fa-eye';
        button.appendChild(icon);
        
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            icon.className = type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash';
        });
    });
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function showError(form, message) {
    let errorElement = form.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        form.insertBefore(errorElement, form.firstChild);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('visible');
    
    setTimeout(() => {
        errorElement.classList.remove('visible');
    }, 3000);
}

// Handle registration form submission
function setupRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    if (!registrationForm) return;

    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = this.querySelector('#reg-firstname').value;
        const lastName = this.querySelector('#reg-lastname').value;
        const email = this.querySelector('#reg-email').value.toLowerCase();
        const confirmEmail = this.querySelector('#reg-confirm-email').value.toLowerCase();
        const password = this.querySelector('#reg-password').value;
        const confirmPassword = this.querySelector('#reg-confirm-password').value;
        
        // Validation
        if (!firstName || !lastName || !email || !confirmEmail || !password || !confirmPassword) {
            showError(this, 'All fields are required');
            return;
        }
        
        if (!validateEmail(email)) {
            showError(this, 'Please enter a valid email address');
            return;
        }
        
        if (email !== confirmEmail) {
            showError(this, 'Emails do not match');
            return;
        }
        
        if (!validatePassword(password)) {
            showError(this, 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters');
            return;
        }
        
        if (password !== confirmPassword) {
            showError(this, 'Passwords do not match');
            return;
        }
        
        const submitButton = this.querySelector('.primary-button');
        const spinner = submitButton.querySelector('.spinner');
        submitButton.disabled = true;
        spinner.style.display = 'block';
        
        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('confirmEmail', confirmEmail);
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);
            
            const response = await fetch('php/register.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert(data.message);
                showLogin();
            } else {
                showError(this, data.error);
            }
        } catch (error) {
            showError(this, 'An error occurred. Please try again.');
        } finally {
            submitButton.disabled = false;
            spinner.style.display = 'none';
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggles();
    setupRegistrationForm();
    showLogin();
});