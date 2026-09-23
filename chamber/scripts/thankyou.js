const params = new URLSearchParams(window.location.search);
const results = document.getElementById('results');

const fields = [
  { key: 'fname', label: 'First Name' },
  { key: 'lname', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Mobile Number' },
  { key: 'business', label: 'Business / Organization' },
  { key: 'timestamp', label: 'Application Date' }
];

const html = fields.map((field) => {
  let value = params.get(field.key) || 'Not provided';

  if (field.key === 'timestamp' && value !== 'Not provided') {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      value = date.toLocaleString();
    }
  }

  return `
    <div class="result-row">
      <span class="result-label">${field.label}:</span>
      <span class="result-value">${value}</span>
    </div>
  `;
}).join('');

if (results) {
  results.innerHTML = html;
}