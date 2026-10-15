import { formatPrice, saveCart } from './modules/helpers.js';

const grid = document.getElementById('pgrid');
const countEl = document.getElementById('count');
const sortEl = document.getElementById('sort');
const wishCount = document.getElementById('wishCount');
const chips = [...document.querySelectorAll('.chip')];
const dock = document.getElementById('dock');

let allProducts = [];
let filter = 'all';
let saved = Number(localStorage.getItem('bs_wish') || 0);
let cart = Number(localStorage.getItem('bs_cart') || 0);

if (dock) {
  const onScroll = () => dock.classList.toggle('on', window.scrollY > 320);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (wishCount) wishCount.textContent = String(12 + saved);
if (cart > 0) {
  document.querySelectorAll('.cb').forEach(c => {
    c.textContent = String(cart);
    c.hidden = false;
  });
}

function saveState() {
  saveCart(cart, saved);
}

function addToCart(qty = 1) {
  cart += qty;
  document.querySelectorAll('.cb').forEach(c => {
    c.textContent = String(cart);
    c.hidden = false;
  });
  saveState();
}

async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('Fetch failed');
    allProducts = await res.json();
    render();
  } catch (err) {
    console.error(err);
    if (grid) grid.innerHTML = '<p>Failed to load products. Please refresh.</p>';
  }
}

function render() {
  if (!grid) return;
  let list = allProducts.filter(p => filter === 'all' || p.cat === filter);
  if (sortEl && sortEl.value === 'asc') list.sort((a, b) => a.price - b.price);
  else if (sortEl && sortEl.value === 'desc') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => a.id - b.id);

  const html = list.map(p => {
    return `
      <article class="pc" data-cat="${p.cat}" data-price="${p.price}" data-i="${p.id}">
        <div class="pimg">
          <span class="ptag">${p.tag}</span>
          <button class="pheart" data-id="${p.id}" aria-label="Save ${p.name}">
            <svg><use href="#i-heart"/></svg>
          </button>
          <img src="${p.img}" alt="${p.name}" width="320" height="320" loading="lazy">
        </div>
        <div class="pbody">
          <div class="prow">
            <h2><button class="open" type="button" data-id="${p.id}">${p.name}</button></h2>
            b>${formatPrice(p.price)}</b>
          </div>
          <p>${p.size}</p>
          <div class="pfoot">
            <span class="rt"><svg><use href="#i-star"/></svg>${p.rate}</span>
            <button class="buy" data-id="${p.id}"><span>Add to Cart</span><i><svg><use href="#i-cart"/></svg></i></button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.innerHTML = html;
  if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' product' : ' products');
  chips.forEach(ch => ch.classList.toggle('on', ch.dataset.f === filter));
  attachEvents();
}

function attachEvents() {
  grid.querySelectorAll('.pheart').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('on');
      saved += btn.classList.contains('on') ? 1 : -1;
      if (wishCount) wishCount.textContent = String(12 + saved);
      saveState();
    });
  });
  grid.querySelectorAll('.buy').forEach(b => b.addEventListener('click', () => addToCart(1)));
  grid.querySelectorAll('.open').forEach(b => {
    b.addEventListener('click', e => {
      openModal(Number(e.currentTarget.dataset.id));
    });
  });
}

const dlg = document.getElementById('pm');
const getEl = id => document.getElementById(id);

function openModal(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p || !dlg) return;
  const img = getEl('pm-img');
  if (img) { img.src = p.img; img.alt = p.name; }
  if (getEl('pm-title')) getEl('pm-title').textContent = p.name;
  if (getEl('pm-price')) getEl('pm-price').textContent = '$' + p.price.toFixed(2);
  if (getEl('pm-desc')) getEl('pm-desc').textContent = p.size;
  if (getEl('pm-cat')) getEl('pm-cat').textContent = p.cat;
  if (getEl('pm-rate')) getEl('pm-rate').textContent = p.rate;
  if (getEl('pm-step')) getEl('pm-step').textContent = p.tag;

  const sugEl = getEl('pm-sug');
  if (sugEl) {
    const others = allProducts.filter(x => x.id !== p.id);
    others.sort((a, b) => {
      const diffCat = (a.cat !== p.cat ? 1 : 0) - (b.cat !== p.cat ? 1 : 0);
      if (diffCat !== 0) return -diffCat;
      return Math.random() - 0.5;
    });
    const sug = others.slice(0, 3);
    sugEl.innerHTML = sug.map(s => {
      return `
        <button class="sg-i" type="button" data-n="${s.id}">
          <span class="sg-img">
            <em>$${s.price.toFixed(2)}</em>
            <img src="${s.img}" alt="${s.name}" width="84" height="84" loading="lazy">
          </span>
          <span class="sg-t">
            <b>${s.name}</b>
            <small>${s.size}</small>
            <i>View</i>
          </span>
        </button>
      `;
    }).join('');
    sugEl.querySelectorAll('.sg-i').forEach(btn => {
      btn.addEventListener('click', () => {
        openModal(Number(btn.dataset.n));
      });
    });
  }
  dlg.showModal();
}

chips.forEach(ch => {
  ch.addEventListener('click', () => {
    filter = ch.dataset.f;
    render();
  });
});
if (sortEl) sortEl.addEventListener('change', render);
const closeBtn = getEl('pm-close');
if (closeBtn && dlg) closeBtn.addEventListener('click', () => dlg.close());
if (dlg) dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
const addBtn = getEl('pm-add');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    addToCart(1);
    const note = getEl('pm-note');
    if (note) note.textContent = 'Added to cart - saved in localStorage';
  });
}
loadProducts();