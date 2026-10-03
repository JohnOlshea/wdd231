
import { discoveries } from "../data/discover.mjs";

const grid = document.getElementById("discover-grid");
const visitEl = document.getElementById("visit-message");

function createCards(){
  discoveries.forEach((item, index)=>{
    const cardNum = index+1;
    const article = document.createElement("article");
    article.className = `discover-card card${cardNum}`;
    article.innerHTML = `
      <h2>${item.name}</h2>
      <figure>
        <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button" class="learn-more-btn">Learn More</button>
    `;
    grid.appendChild(article);
  });
}

function handleVisitMessage(){
  const now = Date.now();
  const lastVisit = localStorage.getItem("lastVisit");
  let message = "";
  if(!lastVisit){
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const diffMs = now - Number(lastVisit);
    const diffDays = Math.floor(diffMs / (1000*60*60*24));
    if(diffMs < 24*60*60*1000){
      message = "Back so soon! Awesome!";
    } else {
      if(diffDays === 1){
        message = `You last visited 1 day ago.`;
      } else {
        message = `You last visited ${diffDays} days ago.`;
      }
    }
  }
  visitEl.textContent = message;
  // store current visit
  localStorage.setItem("lastVisit", now.toString());
}

document.addEventListener("DOMContentLoaded", ()=>{
  createCards();
  handleVisitMessage();
});
