const menuButton = document.getElementById('menu');
const nav = document.getElementById('animateme');

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuButton.textContent = nav.classList.contains('open') ? '✕' : '☰';
});
