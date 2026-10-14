// contact-page.js - nav + localStorage prefs
import { initNav } from './nav.js';
import { getCart, getWishlist } from './storage.js';

function renderCart() {
  const cart = getCart();
  document.querySelectorAll('.cb').forEach(b => {
    b.textContent = String(cart.count);
    b.hidden = cart.count === 0;
  });
}
function renderWishlist() {
  const set = getWishlist();
  const el = document.getElementById('wishCount');
  if (el) el.textContent = String(12 + set.size);
}

function init() {
  initNav();
  renderCart();
  renderWishlist();
  const dock = document.getElementById('dock');
  const onScroll = () => { if (dock) dock.classList.toggle('on', window.scrollY > 320); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const form = document.querySelector('.cform');
  const topic = document.getElementById('topic');
  try {
    const last = localStorage.getItem('beauty-space-last-topic');
    if (last && topic) topic.value = last;
  } catch {}
  topic?.addEventListener('change', () => {
    try { localStorage.setItem('beauty-space-last-topic', topic.value); } catch {}
  });
}

init();
