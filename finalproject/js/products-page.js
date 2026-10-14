// products-page.js - Main logic for products.html
import { fetchProducts } from './data.js';
import { money } from './utils.js';
import { getCart, getWishlist, addToCartStorage, toggleWishlistStorage } from './storage.js';
import { initModal, openProductModal } from './modal.js';
import { initNav } from './nav.js';

const grid = document.getElementById('pgrid');
const chips = [...document.querySelectorAll('.chip')];
const countEl = document.getElementById('count');
const sortEl = document.getElementById('sort');
const wishCountEl = document.getElementById('wishCount');

let allProducts = [];
let filtered = [];
let activeFilter = 'all';

function renderCart() {
  const cart = getCart();
  document.querySelectorAll('.cb').forEach(b => {
    b.textContent = String(cart.count);
    b.hidden = cart.count === 0;
  });
}

function renderWishlist() {
  const set = getWishlist();
  if (wishCountEl) wishCountEl.textContent = String(12 + set.size);
  document.querySelectorAll('.pc').forEach(card => {
    const id = Number(card.dataset.id);
    const btn = card.querySelector('.pheart');
    if (btn) btn.classList.toggle('on', set.has(id));
  });
}

function createCard(product) {
  return `
    <article class="pc" data-cat="${product.category}" data-price="${product.price}" data-id="${product.id}">
      <div class="pimg">
        <span class="ptag">${product.tag}</span>
        <button class="pheart" type="button" aria-label="Save ${product.name} to wishlist" aria-pressed="false">
          <svg aria-hidden="true"><use href="#i-heart"/></svg>
        </button>
        <img src="${product.image}" alt="${product.name}" width="244" height="304" loading="lazy" decoding="async">
      </div>
      <div class="pbody">
        <div class="prow">
          <h3><button class="open" type="button" data-id="${product.id}">${product.name}</button></h3>
          <b>${money(product.price)}</b>
        </div>
        <p>${product.size}</p>
        <div class="pfoot">
          <span class="rt" aria-label="Rating ${product.rating} out of 5">
            <svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg>
            <em>${product.rating} (${(product.reviews/1000).toFixed(1)}k)</em>
          </span>
          <button class="buy" type="button" data-buy="${product.id}"><span>Add to Cart</span><i><svg aria-hidden="true"><use href="#i-cart"/></svg></i></button>
        </div>
      </div>
    </article>
  `;
}

function applyFiltersAndSort() {
  filtered = allProducts.filter(p => activeFilter === 'all' || p.category === activeFilter);
  if (sortEl?.value === 'asc') filtered.sort((a,b) => a.price - b.price);
  else if (sortEl?.value === 'desc') filtered.sort((a,b) => b.price - a.price);
  else filtered.sort((a,b) => a.id - b.id);

  grid.innerHTML = filtered.map(createCard).join('');
  if (countEl) countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`;
  chips.forEach(c => c.classList.toggle('on', c.dataset.f === activeFilter));
  renderWishlist();

  grid.querySelectorAll('.open').forEach(btn => {
    btn.addEventListener('click', () => {
      const prod = allProducts.find(p => p.id === Number(btn.dataset.id));
      if (prod) openProductModal(prod, allProducts);
    });
  });
  grid.querySelectorAll('.pheart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pc');
      const id = Number(card.dataset.id);
      const set = toggleWishlistStorage(id);
      btn.classList.toggle('on', set.has(id));
      btn.setAttribute('aria-pressed', String(set.has(id)));
      if (wishCountEl) wishCountEl.textContent = String(12 + set.size);
    });
  });
  grid.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const prod = allProducts.find(p => p.id === Number(btn.dataset.buy));
      if (!prod) return;
      const cart = addToCartStorage(prod, 1);
      renderCart();
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 200 });
    });
  });
}

async function init() {
  initNav();
  renderCart();
  const products = await fetchProducts();
  allProducts = products;
  initModal(allProducts);
  applyFiltersAndSort();

  chips.forEach(chip => chip.addEventListener('click', () => {
    activeFilter = chip.dataset.f;
    applyFiltersAndSort();
  }));
  sortEl?.addEventListener('change', applyFiltersAndSort);

  document.querySelector('[data-go]')?.addEventListener('click', (e) => {
    activeFilter = e.currentTarget.dataset.go;
    applyFiltersAndSort();
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('cart:updated', () => renderCart());
  document.addEventListener('wishlist:updated', () => renderWishlist());
}

init();
