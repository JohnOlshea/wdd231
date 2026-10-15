export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

export function saveCart(cart, wish) {
  localStorage.setItem('bs_cart', String(cart));
  localStorage.setItem('bs_wish', String(wish));
}