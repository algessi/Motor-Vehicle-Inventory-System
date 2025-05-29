// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Application initialized');
  
  // Set focus on username field
  const usernameInput = document.getElementById('username');
  if (usernameInput) {
    usernameInput.focus();
  }
  
  // Initialize session timer simulation
  initSessionTimer();
});

function initSessionTimer() {
  const timerElement = document.getElementById('session-timer');
  if (!timerElement) return;
  
  let minutes = 20;
  let seconds = 0;
  
  const updateTimer = () => {
    // Update the timer display
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Decrement the timer
    if (seconds === 0) {
      if (minutes === 0) {
        // Timer reached zero
        clearInterval(timerInterval);
        timerElement.textContent = '00:00';
        timerElement.style.color = 'var(--error-500)';
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    
    // Change color when approaching timeout
    if (minutes < 5) {
      timerElement.style.color = 'var(--warning-500)';
    }
    if (minutes < 2) {
      timerElement.style.color = 'var(--error-500)';
    }
  };
  
  // Update the timer every second
  const timerInterval = setInterval(updateTimer, 1000);
  
  // Initial update
  updateTimer();
}