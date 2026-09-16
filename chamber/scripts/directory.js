const membersContainer=document.getElementById('members');
const gridBtn=document.getElementById('grid');
const listBtn=document.getElementById('list');
const yearSpan=document.getElementById('currentyear');
const lastModSpan=document.getElementById('lastModified');
const menuBtn=document.getElementById('menuButton');
const menuPanel=document.getElementById('menuPanel');
if(yearSpan) yearSpan.textContent=new Date().getFullYear();
if(lastModSpan) lastModSpan.textContent=document.lastModified;
if(menuBtn&&menuPanel){
  menuBtn.addEventListener('click',()=>{
    const isOpen=menuPanel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(isOpen));
  });
}
function setView(view){
  if(!membersContainer) return;
  if(view==='list'){
    membersContainer.classList.add('list-view');
    membersContainer.classList.remove('grid-view');
    listBtn?.classList.add('active');gridBtn?.classList.remove('active');
    listBtn?.setAttribute('aria-pressed','true');gridBtn?.setAttribute('aria-pressed','false');
  }else{
    membersContainer.classList.add('grid-view');
    membersContainer.classList.remove('list-view');
    gridBtn?.classList.add('active');listBtn?.classList.remove('active');
    gridBtn?.setAttribute('aria-pressed','true');listBtn?.setAttribute('aria-pressed','false');
  }
  localStorage.setItem('directoryView',view);
}
gridBtn?.addEventListener('click',()=>setView('grid'));
listBtn?.addEventListener('click',()=>setView('list'));
setView(localStorage.getItem('directoryView')==='list'?'list':'grid');
async function getMembers(){
  if(!membersContainer) return;
  try{
    const response=await fetch('data/members.json');
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data=await response.json();
    displayMembers(data);
  }catch(error){
    console.error('Fetch error:',error);
    membersContainer.innerHTML='<p role="alert">Unable to load members. Please try again later.</p>';
  }
}
function displayMembers(members){
  if(!membersContainer) return;
  membersContainer.innerHTML='';
  members.forEach((member)=>{
    const card=document.createElement('article');
    card.className='member-card';
    card.innerHTML=`
      <div class="card-head"><h2>${member.name}</h2><p>${member.tagline}</p></div>
      <div class="card-divider" aria-hidden="true"></div>
      <div class="card-body">
        <img src="${member.image}" alt="Logo of ${member.name}" width="80" height="80" loading="lazy">
        <div class="card-details">
          <div class="line"><strong>EMAIL:</strong> <a href="mailto:${member.email}">${member.email}</a></div>
          <div class="line"><strong>PHONE:</strong> ${member.phone}</div>
          <div class="line"><strong>URL:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website.replace('https://','')}</a></div>
          <div class="line"><strong>ADDRESS:</strong> ${member.address}</div>
        </div>
      </div>`;
    membersContainer.appendChild(card);
  });
}
getMembers();
