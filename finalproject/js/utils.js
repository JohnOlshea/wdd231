// utils.js - helpers
export const money = (n) => `$${Number(n).toFixed(2)}`;
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
