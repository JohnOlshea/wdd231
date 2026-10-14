// data.js - Fetch products with robust error handling
export async function fetchProducts() {
  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Product data is empty or invalid');
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    const grid = document.getElementById('pgrid') || document.getElementById('bestseller-grid');
    if (grid) {
      grid.innerHTML = `<p class="error" role="alert">Unable to load products. Please refresh. ${error.message}</p>`;
    }
    return [];
  }
}
