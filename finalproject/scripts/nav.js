// Hamburger menu (small screens): toggles the nav inside the banner
document.querySelectorAll('.menu').forEach(btn => {
  const box = btn.closest('.card, .mast');
  const set = open => { box.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(!box.classList.contains('open')));
  box.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
});
