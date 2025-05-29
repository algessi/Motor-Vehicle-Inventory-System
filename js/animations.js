/**
 * Animations and UI enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  // Add subtle hover effect to input fields
  const inputFields = document.querySelectorAll('input[type="text"], input[type="password"]');
  
  inputFields.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
      input.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });
  
  // Add ripple effect to login button
  const loginButton = document.getElementById('login-button');
  
  if (loginButton) {
    loginButton.addEventListener('mousedown', (e) => {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      loginButton.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  // Smooth appearance for the login container
  const loginContainer = document.querySelector('.login-container');
  if (loginContainer) {
    setTimeout(() => {
      loginContainer.classList.add('visible');
    }, 100);
  }
});

// Add CSS for animations that can't be defined in the CSS files
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});