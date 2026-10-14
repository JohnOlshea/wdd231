const dock = document.getElementById('dock');
const onScroll = () => dock.classList.toggle('on', scrollY > 320);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Filter + sort
const grid = document.getElementById('pgrid'), cards = [...grid.children];
const chips = [...document.querySelectorAll('.chip')], count = document.getElementById('count'), sort = document.getElementById('sort');
let filter = 'all';
function render() {
  const list = cards.filter(c => filter === 'all' || c.dataset.cat === filter);
  if (sort.value === 'asc') list.sort((a, b) => a.dataset.price - b.dataset.price);
  else if (sort.value === 'desc') list.sort((a, b) => b.dataset.price - a.dataset.price);
  else list.sort((a, b) => a.dataset.i - b.dataset.i);
  cards.forEach(c => c.hidden = !list.includes(c));
  list.forEach(c => grid.appendChild(c));
  chips.forEach(c => c.classList.toggle('on', c.dataset.f === filter));
  count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
}
chips.forEach(c => c.addEventListener('click', () => { filter = c.dataset.f; render(); }));
sort.addEventListener('change', render);
document.querySelector('[data-go]').addEventListener('click', e => {
  filter = e.currentTarget.dataset.go; render();
  document.getElementById('shop').scrollIntoView();
});

// Wishlist (header count + card hearts)
const wishCount = document.getElementById('wishCount'); let saved = 0;
document.querySelectorAll('.pc .pheart').forEach(h => h.addEventListener('click', () => {
  h.classList.toggle('on'); saved += h.classList.contains('on') ? 1 : -1;
  wishCount.textContent = 12 + saved;
}));

// Cart count (header + dock)
let cart = 0;
function addToCart(n = 1) {
  cart += n;
  document.querySelectorAll('.cb').forEach(x => { x.textContent = cart; x.hidden = false; });
}
document.querySelectorAll('.pc .buy').forEach(b => b.addEventListener('click', () => addToCart()));

// Product modal
const dlg = document.getElementById('pm');
const $ = id => document.getElementById(id);
const money = n => '$' + Number(n).toFixed(2);
const label = { cleansers: 'Cleanser', toners: 'Toner', serums: 'Serum', moisturizers: 'Moisturizer' };
const step = {
  cleansers: ['Step 1 · Cleanse', 'Melt the day with Madagascar Centella foam. No stripping, just soft cloud.'],
  toners: ['Step 2 · Tone', 'Balance with calming pads. Preps skin to absorb, not react.'],
  serums: ['Step 3 · Seal', 'Lock in calm with the Centella serum. A veil, not a mask.'],
  moisturizers: ['Step 3 · Seal', 'Lock in calm with a light cream. A veil, not a mask.']
};
const products = cards.map(el => ({
  el,
  name: el.querySelector('.open').textContent,
  price: el.dataset.price,
  cat: el.dataset.cat,
  meta: el.querySelector('.pbody p').textContent,
  img: el.querySelector('.pimg img').getAttribute('src'),
  rate: el.querySelector('.rt em').textContent
}));
let cur = null, qty = 1;

function total() { $('pm-addtxt').textContent = `Add to Cart · ${money(cur.price * qty)}`; $('pm-qty').textContent = qty; }

function fill(p) {
  cur = p; qty = 1;
  $('pm-img').src = p.img; $('pm-img').alt = p.name;
  $('pm-step').textContent = step[p.cat][0];
  $('pm-title').textContent = p.name;
  $('pm-rate').textContent = p.rate;
  $('pm-cat').textContent = label[p.cat];
  $('pm-price').textContent = money(p.price);
  $('pm-desc').textContent = step[p.cat][1];
  $('pm-size').textContent = p.meta;
  $('pm-note').textContent = '';
  const saved = p.el.querySelector('.pheart').classList.contains('on');
  $('pm-heart').classList.toggle('on', saved); $('pm-heart').setAttribute('aria-pressed', saved);
  const picks = products.filter(x => x !== p).sort((a, b) => (b.cat !== p.cat) - (a.cat !== p.cat)).slice(0, 3);
  $('pm-sug').innerHTML = picks.map(x => `<button class="sg-i" type="button" data-n="${products.indexOf(x)}"><span class="sg-img"><em>${money(x.price)}</em><img src="${x.img}" alt="" width="84" height="84" loading="lazy"></span><span class="sg-t"><b>${x.name}</b><small>${x.meta}</small><i>View</i></span></button>`).join('');
  total(); dlg.scrollTop = 0;
}

cards.forEach((el, n) => el.querySelector('.open').addEventListener('click', () => { fill(products[n]); dlg.showModal(); }));
$('pm-sug').addEventListener('click', e => {
  const b = e.target.closest('.sg-i'); if (!b) return;
  fill(products[b.dataset.n]); $('pm-title').focus();
});
$('q-').addEventListener('click', () => { qty = Math.max(1, qty - 1); total(); });
$('q-plus').addEventListener('click', () => { qty = Math.min(9, qty + 1); total(); });
$('pm-add').addEventListener('click', () => { addToCart(qty); $('pm-note').textContent = `Added ${qty} × ${cur.name} to your cart.`; });
$('pm-heart').addEventListener('click', () => {
  cur.el.querySelector('.pheart').click();
  const on = cur.el.querySelector('.pheart').classList.contains('on');
  $('pm-heart').classList.toggle('on', on); $('pm-heart').setAttribute('aria-pressed', on);
});
$('pm-close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
