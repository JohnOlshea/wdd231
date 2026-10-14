// modal.js - Accessible product modal using <dialog>
import { money } from './utils.js';
import { getWishlist, toggleWishlistStorage, addToCartStorage } from './storage.js';

let currentProduct = null;
let currentQty = 1;
let allProductsCache = [];

export function initModal(allProducts) {
  allProductsCache = allProducts;
  const dlg = document.getElementById('pm');
  if (!dlg) return;
  const closeBtn = document.getElementById('pm-close');
  const qtyMinus = document.getElementById('q-');
  const qtyPlus = document.getElementById('q-plus');
  const addBtn = document.getElementById('pm-add');
  const heartBtn = document.getElementById('pm-heart');

  closeBtn?.addEventListener('click', () => closeModal());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeModal(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });

  qtyMinus?.addEventListener('click', () => {
    currentQty = Math.max(1, currentQty - 1);
    updateTotal();
  });
  qtyPlus?.addEventListener('click', () => {
    currentQty = Math.min(9, currentQty + 1);
    updateTotal();
  });

  addBtn?.addEventListener('click', () => {
    if (!currentProduct) return;
    const cart = addToCartStorage(currentProduct, currentQty);
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    const note = document.getElementById('pm-note');
    if (note) note.textContent = `Added ${currentQty} × ${currentProduct.name} to cart.`;
  });

  heartBtn?.addEventListener('click', () => {
    if (!currentProduct) return;
    const set = toggleWishlistStorage(currentProduct.id);
    document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: set }));
    const isOn = set.has(currentProduct.id);
    heartBtn.classList.toggle('on', isOn);
    heartBtn.setAttribute('aria-pressed', String(isOn));
  });

  document.getElementById('pm-sug')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.sg-i');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const prod = allProductsCache.find(p => p.id === id);
    if (prod) openProductModal(prod, allProductsCache);
  });
}

function updateTotal() {
  const qtyOut = document.getElementById('pm-qty');
  const txt = document.getElementById('pm-addtxt');
  if (qtyOut) qtyOut.textContent = String(currentQty);
  if (txt && currentProduct) txt.textContent = `Add to Cart · ${money(currentProduct.price * currentQty)}`;
}

export function openProductModal(product, allProducts = allProductsCache) {
  allProductsCache = allProducts;
  currentProduct = product;
  currentQty = 1;
  const dlg = document.getElementById('pm');
  if (!dlg) return;

  const img = document.getElementById('pm-img');
  const step = document.getElementById('pm-step');
  const title = document.getElementById('pm-title');
  const rate = document.getElementById('pm-rate');
  const cat = document.getElementById('pm-cat');
  const price = document.getElementById('pm-price');
  const desc = document.getElementById('pm-desc');
  const size = document.getElementById('pm-size');
  const heart = document.getElementById('pm-heart');

  if (img) { img.src = product.image; img.alt = product.name; img.width = 340; img.height = 453; }
  if (step) step.textContent = product.step;
  if (title) title.textContent = product.name;
  if (rate) rate.textContent = `${product.rating} (${product.reviews >= 1000 ? (product.reviews/1000).toFixed(1)+'k' : product.reviews})`;
  if (cat) cat.textContent = product.category;
  if (price) price.textContent = money(product.price);
  if (desc) desc.textContent = product.description;
  if (size) size.textContent = product.size;

  const wishlist = getWishlist();
  const isSaved = wishlist.has(product.id);
  if (heart) {
    heart.classList.toggle('on', isSaved);
    heart.setAttribute('aria-pressed', String(isSaved));
  }

  const sug = document.getElementById('pm-sug');
  if (sug) {
    const picks = allProducts.filter(p => p.id !== product.id).sort((a,b) => (a.category === product.category ? 1 : -1)).slice(0,3);
    sug.innerHTML = picks.map(p => `
      <button class="sg-i" type="button" data-id="${p.id}" aria-label="View ${p.name}">
        <span class="sg-img"><em>${money(p.price)}</em><img src="${p.image}" alt="" width="84" height="84" loading="lazy" decoding="async"></span>
        <span class="sg-t"><b>${p.name}</b><small>${p.size}</small><i>View</i></span>
      </button>
    `).join('');
  }

  const note = document.getElementById('pm-note');
  if (note) note.textContent = '';
  updateTotal();

  document.body.style.overflow = 'hidden';
  if (typeof dlg.showModal === 'function') {
    dlg.showModal();
    title?.focus();
  }
}

export function closeModal() {
  const dlg = document.getElementById('pm');
  if (dlg?.open) dlg.close();
}
