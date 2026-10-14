import './contact.js';

const labels = { name: 'Name', email: 'Email', topic: 'Topic', skin: 'Skin type', message: 'Message', updates: 'Product news' };
const params = new URLSearchParams(location.search);
const sum = document.getElementById('sum');

const rows = Object.entries(labels)
  .filter(([key]) => params.has(key))
  .map(([key, label]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = params.get(key);
    row.append(dt, dd);
    return row;
  });

if (rows.length) sum.append(...rows);
else document.getElementById('lead').textContent = 'No message found. Please use the contact form.';
