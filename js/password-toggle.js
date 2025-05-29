document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.getElementById('toggle-password');
  
  if (!passwordInput || !toggleButton) return;
  
  toggleButton.addEventListener('click', () => {
    // Toggle password visibility
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleButton.classList.add('visible');
      toggleButton.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.type = 'password';
      toggleButton.classList.remove('visible');
      toggleButton.setAttribute('aria-label', 'Show password');
    }
    
    // Re-focus on the password input
    passwordInput.focus();
  });
});