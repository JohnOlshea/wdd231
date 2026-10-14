// home-page.js - index.html logic with fetch, localStorage, modal, array methods
import { fetchProducts } from './data.js';
import { money } from './utils.js';
import { getCart, getWishlist, addToCartStorage } from './storage.js';
import { initModal, openProductModal } from './modal.js';
import { initNav } from './nav.js';

function initHeroScale() {
  const root = document.documentElement;
  const dock = document.getElementById('dock');
  const hero = document.querySelector('.hero');
  function fit() {
    const s = Math.min(root.clientWidth / 2212, window.innerHeight / 1659);
    root.style.setProperty('--s', String(Math.min(s,1)));
    if (dock && hero) dock.classList.toggle('on', window.scrollY > hero.offsetHeight * 0.7);
  }
  window.addEventListener('resize', fit);
  window.addEventListener('scroll', () => {
    if (dock && hero) dock.classList.toggle('on', window.scrollY > hero.offsetHeight * 0.7);
  }, { passive: true });
  fit();
}

function renderCart() {
  const cart = getCart();
  document.querySelectorAll('.cb').forEach(b => {
    b.textContent = String(cart.count);
    b.hidden = cart.count === 0;
  });
}
function renderWishlist() {
  const set = getWishlist();
  const wishCount = document.getElementById('wishCount');
  if (wishCount) wishCount.textContent = String(12 + set.size);
}

async function init() {
  initNav();
  initHeroScale();
  renderCart();
  renderWishlist();

  const products = await fetchProducts();
  if (products.length === 0) return;
  initModal(products);

  const bestsellers = [...products].sort((a,b) => b.reviews - a.reviews).slice(0,3);
  const bestGrid = document.getElementById('bestseller-grid');
  if (bestGrid) {
    bestGrid.innerHTML = bestsellers.map(p => `
      <article class="item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" width="320" height="260" loading="lazy" decoding="async">
        <div class="row"><b>${money(p.price)}</b><span>${p.size}</span></div>
        <h3><button class="open" type="button" data-id="${p.id}">${p.name}</button></h3>
        <button class="buy" type="button" data-buy="${p.id}"><span>Add to Cart</span><i><svg aria-hidden="true"><use href="#i-cart"/></svg></i></button>
      </article>
    `).join('');

    bestGrid.querySelectorAll('.open').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = products.find(x => x.id === Number(btn.dataset.id));
        if (prod) openProductModal(prod, products);
      });
    });
    bestGrid.querySelectorAll('[data-buy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prod = products.find(x => x.id === Number(btn.dataset.buy));
        if (!prod) return;
        const cart = addToCartStorage(prod, 1);
        renderCart();
      });
    });
    bestGrid.querySelectorAll('.item img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        const id = Number(e.target.closest('.item')?.dataset.id);
        const prod = products.find(x => x.id === id);
        if (prod) openProductModal(prod, products);
      });
    });
  }

  document.querySelectorAll('.prods .product').forEach((card, idx) => {
    const prod = bestsellers[idx] || products[idx];
    if (!prod) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openProductModal(prod, products));
    card.querySelectorAll('button').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const cart = addToCartStorage(prod, 1);
      renderCart();
    }));
  });

  document.getElementById('addCart')?.addEventListener('click', () => {
    const prod = bestsellers[0];
    const cart = addToCartStorage(prod, 1);
    renderCart();
  });

  const subForm = document.getElementById('sub');
  subForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = subForm.querySelector('input[type="email"]')?.value || '';
    try { localStorage.setItem('beauty-space-newsletter', email); } catch {}
    subForm.hidden = true;
    const ok = document.getElementById('ok');
    if (ok) ok.hidden = false;
  });

  document.addEventListener('cart:updated', () => renderCart());
  document.addEventListener('wishlist:updated', () => renderWishlist());
}

init();
