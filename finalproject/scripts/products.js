const dock = document.getElementById('dock');

const onScroll = () => {
  dock.classList.toggle('on', window.scrollY > 320);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Filter and sort
const grid = document.getElementById('pgrid');
const cards = [...grid.children];
const chips = [...document.querySelectorAll('.chip')];
const count = document.getElementById('count');
const sort = document.getElementById('sort');

let filter = 'all';

function render() {
  const list = cards.filter(
    card => filter === 'all' || card.dataset.cat === filter
  );

  if (sort.value === 'asc') {
    list.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else if (sort.value === 'desc') {
    list.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  } else {
    list.sort((a, b) => Number(a.dataset.i) - Number(b.dataset.i));
  }

  cards.forEach(card => {
    card.hidden = !list.includes(card);
  });

  list.forEach(card => grid.appendChild(card));

  chips.forEach(chip => {
    chip.classList.toggle('on', chip.dataset.f === filter);
  });

  count.textContent =
    list.length + (list.length === 1 ? ' product' : ' products');
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    filter = chip.dataset.f;
    render();
  });
});

sort.addEventListener('change', render);

document.querySelector('[data-go]').addEventListener('click', event => {
  filter = event.currentTarget.dataset.go;
  render();
  document.getElementById('shop').scrollIntoView();
});

// Wishlist: header count and card hearts
const wishCount = document.getElementById('wishCount');
let saved = 0;

document.querySelectorAll('.pc .pheart').forEach(heart => {
  heart.addEventListener('click', () => {
    heart.classList.toggle('on');

    saved += heart.classList.contains('on') ? 1 : -1;
    wishCount.textContent = 12 + saved;
  });
});

// Cart count: header and dock
let cart = 0;

function addToCart(quantity = 1) {
  cart += quantity;

  document.querySelectorAll('.cb').forEach(counter => {
    counter.textContent = cart;
    counter.hidden = false;
  });
}

// Add products to cart
document.querySelectorAll('.pc .buy').forEach(button => {
  button.addEventListener('click', () => addToCart());
});

// Product modal
const dlg = document.getElementById('pm');

const getElement = id => document.getElementById(id);

const money = amount => '$' + Number(amount).toFixed(2);

const label = {
  cleansers: 'Cleanser',
  toners: 'Toner',
  serums: 'Serum',
  moisturizers: 'Moisturizer'
};

const step = {
  cleansers: [
    'Step 1 · Cleanse',
    'Melt the day with Madagascar Centella foam. No stripping, just soft cloud.'
  ],
  toners: [
    'Step 2 · Tone',
    'Balance with calming pads. Preps skin to absorb, not react.'
  ],
  serums: [
    'Step 3 · Seal',
    'Lock in calm with the Centella serum. A veil, not a mask.'
  ],
  moisturizers: [
    'Step 3 · Seal',
    'Lock in calm with a light cream. A veil, not a mask.'
  ]
};

const products = cards.map(element => ({
  el: element,
  name: element.querySelector('.open').textContent,
  price: element.dataset.price,
  cat: element.dataset.cat,
  meta: element.querySelector('.pbody p').textContent,
  img: element.querySelector('.pimg img').getAttribute('src'),
  rate: element.querySelector('.rt em').textContent
}));

let cur = null;
let qty = 1;

function total() {
  getElement('pm-addtxt').textContent =
    `Add to Cart · ${money(Number(cur.price) * qty)}`;

  getElement('pm-qty').textContent = qty;
}

function fill(product) {
  cur = product;
  qty = 1;

  getElement('pm-img').src = product.img;
  getElement('pm-img').alt = product.name;

  getElement('pm-step').textContent = step[product.cat][0];
  getElement('pm-title').textContent = product.name;
  getElement('pm-rate').textContent = product.rate;
  getElement('pm-cat').textContent = label[product.cat];
  getElement('pm-price').textContent = money(product.price);
  getElement('pm-desc').textContent = step[product.cat][1];
  getElement('pm-size').textContent = product.meta;
  getElement('pm-note').textContent = '';

  const isSaved = product.el
    .querySelector('.pheart')
    .classList.contains('on');

  getElement('pm-heart').classList.toggle('on', isSaved);
  getElement('pm-heart').setAttribute('aria-pressed', String(isSaved));

  const suggestions = products
    .filter(item => item !== product)
    .sort((a, b) => Number(b.cat !== product.cat) - Number(a.cat !== product.cat))
    .slice(0, 3);

  getElement('pm-sug').innerHTML = suggestions.map(item => `
    <button class="sg-i" type="button" data-n="${products.indexOf(item)}">
      <span class="sg-img">
        <em>${money(item.price)}</em>
        <img
          src="${item.img}"
          alt=""
          width="84"
          height="84"
          loading="lazy"
        >
      </span>
      <span class="sg-t">
        <b>${item.name}</b>
        <small>${item.meta}</small>
        <i>View</i>
      </span>
    </button>
  `).join('');

  total();
  dlg.scrollTop = 0;
}

// Open a product's modal
cards.forEach((element, index) => {
  element.querySelector('.open').addEventListener('click', () => {
    fill(products[index]);
    dlg.showModal();
  });
});

// Open a suggested product
getElement('pm-sug').addEventListener('click', event => {
  const button = event.target.closest('.sg-i');

  if (!button) return;

  fill(products[Number(button.dataset.n)]);
  getElement('pm-title').focus();
});

// Decrease quantity
getElement('q-').addEventListener('click', () => {
  qty = Math.max(1, qty - 1);
  total();
});

// Increase quantity
getElement('q-plus').addEventListener('click', () => {
  qty = Math.min(9, qty + 1);
  total();
});

// Add the selected product and quantity to cart
getElement('pm-add').addEventListener('click', () => {
  addToCart(qty);

  getElement('pm-note').textContent =
    `Added ${qty} × ${cur.name} to your cart.`;
});

// Toggle wishlist from the modal
getElement('pm-heart').addEventListener('click', () => {
  cur.el.querySelector('.pheart').click();

  const isSaved = cur.el
    .querySelector('.pheart')
    .classList.contains('on');

  getElement('pm-heart').classList.toggle('on', isSaved);
  getElement('pm-heart').setAttribute('aria-pressed', String(isSaved));
});

// Close the product modal
getElement('pm-close').addEventListener('click', () => {
  dlg.close();
});

// Close the modal when its backdrop is clicked
dlg.addEventListener('click', event => {
  if (event.target === dlg) {
    dlg.close();
  }
});
