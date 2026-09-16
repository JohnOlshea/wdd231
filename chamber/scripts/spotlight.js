async function getSpotlights(){
  try{
    const res = await fetch('data/members.json');
    if(!res.ok) throw new Error('Fetch failed');
    const members = await res.json();
    const filtered = members.filter(m => m.level === 'Gold' || m.level === 'Silver');
    const shuffled = filtered.sort(()=>0.5 - Math.random());
    const count = Math.random() < 0.5 ? 2 : 3;
    const selected = shuffled.slice(0,count);
    displaySpotlights(selected);
  }catch(e){ console.error(e); }
}
function displaySpotlights(list){
  const c = document.getElementById('spotlights');
  if(!c) return;
  c.innerHTML='';
  list.forEach(m=>{
    const art = document.createElement('article');
    art.className='member-card';
    art.innerHTML = `
      <div class="card-head" style="position:relative"><span class="gold-badge">${m.level}</span><h2>${m.name}</h2><p>${m.tagline}</p></div>
      <div class="card-divider" aria-hidden="true"></div>
      <div class="card-body">
        <img src="${m.image}" alt="Logo of ${m.name}" width="80" height="80" loading="lazy">
        <div class="card-details">
          <div class="line"><strong>PHONE:</strong> ${m.phone}</div>
          <div class="line"><strong>ADDRESS:</strong> ${m.address}</div>
          <div class="line"><strong>URL:</strong> <a href="${m.website}" target="_blank" rel="noopener">${m.website.replace('https://','')}</a></div>
        </div>
      </div>`;
    c.appendChild(art);
  });
}
getSpotlights();
