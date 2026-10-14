// nav.js - responsive hamburger + dock + wayfinding + localStorage prefs
export function initNav() {
  const menuBtns = document.querySelectorAll('.menu');
  const dock = document.getElementById('dock');

  menuBtns.forEach(btn => {
    const box = btn.closest('.card, .mast') || document.querySelector('.mast') || document.body;
    const nav = box.querySelector('nav') || document.getElementById('site-nav');
    const setOpen = (open) => {
      box.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (nav) nav.setAttribute('aria-hidden', String(!open));
    };
    btn.addEventListener('click', () => setOpen(!box.classList.contains('open')));
    box.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.card.open, .mast.open').forEach(el => {
        el.classList.remove('open');
        el.querySelectorAll('.menu').forEach(b => b.setAttribute('aria-expanded','false'));
      });
    }
  });

  if (dock) {
    const onScroll = () => {
      const threshold = document.querySelector('.hero')?.offsetHeight ? document.querySelector('.hero').offsetHeight * 0.7 : 320;
      dock.classList.toggle('on', window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  try {
    localStorage.setItem('beauty-space-last-nav', location.pathname);
  } catch {}
}
