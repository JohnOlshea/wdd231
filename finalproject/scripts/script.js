// Fit the hero design (2212x1659) to the window; --s drives all page sizing
const root = document.documentElement, dock = document.getElementById('dock');
function fit() {
  root.style.setProperty('--s', Math.min(root.clientWidth / 2212, innerHeight / 1659));
  onScroll();
}
function onScroll() {
  dock.classList.toggle('on', scrollY > document.querySelector('.hero').offsetHeight * 0.7);
}
addEventListener('resize', fit);
addEventListener('scroll', onScroll, { passive: true });
fit();

// Wishlist toggle
const wishCount = document.getElementById('wishCount');
let liked = false;
document.getElementById('wish').addEventListener('click', () => {
  liked = !liked;
  wishCount.textContent = liked ? 13 : 12;
});

// Cart count (hero, product cards and dock)
let cart = 0;
function addToCart(btn) {
  cart++;
  document.querySelectorAll('.cb').forEach(b => { b.textContent = cart; b.hidden = false; });
  btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 250 });
}
document.querySelectorAll('.add, .book, .buy').forEach(b => b.addEventListener('click', () => addToCart(b)));

// Newsletter
document.getElementById('sub').addEventListener('submit', e => {
  e.preventDefault();
  e.target.hidden = true;
  document.getElementById('ok').hidden = false;
});
