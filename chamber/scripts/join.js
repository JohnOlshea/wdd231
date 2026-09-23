// Set the current date and time when the page loads
const timestamp = document.getElementById('timestamp');

if (timestamp) {
  timestamp.value = new Date().toISOString();
}

// Membership modal handling
const modals = document.querySelectorAll('.membership-modal');

document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modal);

    if (modal) {
      modal.showModal();
    }
  });
});

// Close buttons
document.querySelectorAll('.close-modal').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('dialog');

    if (modal) {
      modal.close();
    }
  });
});

// Close modal when clicking outside the modal content
modals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});