// Set timestamp + modal handling
const timestamp = document.getElementById('timestamp');
if (timestamp) {
  timestamp.value = new Date().toISOString();
}

const modals = document.querySelectorAll('.membership-modal');

document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modal);
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  });
});

document.querySelectorAll('.close-modal').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('dialog');
    if (modal) modal.close();
  });
});

modals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});

// Close with Escape handled natively by dialog, but ensure focus returns
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modals.forEach((m) => {
      if (m.open) m.close();
    });
  }
});
