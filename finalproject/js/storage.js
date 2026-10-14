// storage.js - Local Storage for cart, wishlist, preferences
const CART_KEY = 'beauty-space-cart';
const WISH_KEY = 'beauty-space-wishlist';
const PREF_KEY = 'beauty-space-prefs';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || { count: 0, items: [] };
  } catch {
    return { count: 0, items: [] };
  }
}
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
export function addToCartStorage(product, qty = 1) {
  const cart = getCart();
  cart.count += qty;
  const existing = cart.items.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.items.push({ id: product.id, name: product.name, price: product.price, qty });
  saveCart(cart);
  return cart;
}
export function getWishlist() {
  try {
    return new Set(JSON.parse(localStorage.getItem(WISH_KEY)) || []);
  } catch {
    return new Set();
  }
}
export function saveWishlist(set) {
  localStorage.setItem(WISH_KEY, JSON.stringify([...set]));
}
export function toggleWishlistStorage(id) {
  const set = getWishlist();
  if (set.has(id)) set.delete(id);
  else set.add(id);
  saveWishlist(set);
  return set;
}
export function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || {};
  } catch {
    return {};
  }
}
export function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}
