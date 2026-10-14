
var grid=document.getElementById('pgrid');
var countEl=document.getElementById('count');
var products=[
{id:1,name:'Centella Ampoule Foam Serum',price:68.99,cat:'cleansers',size:'125 ml',rate:'4.9 (2.1k)',img:'images/product-1.jpg'},
{id:2,name:'Quick Calming Pads Serum',price:27.69,cat:'toners',size:'25 ml',rate:'4.9 (1.8k)',img:'images/product-2.jpg'},
{id:3,name:'Centella Asiatica Facial Serum',price:68.99,cat:'serums',size:'55 ml',rate:'4.9 (2.4k)',img:'images/product-3.jpg'}
];
function render(list){
 if(!grid) return;
 var html='';
 for(var i=0;i<list.length;i++){
  var p=list[i];
  html+='<article class="pc"><div class="pimg"><span class="ptag">Centella Madagascar</span><img src="'+p.img+'" alt="'+p.name+' bottle" width="320" height="320" loading="lazy"></div><div class="pbody"><div class="prow"><h3>'+p.name+'</h3><b>$'+p.price+'</b></div><p>'+p.size+'</p><div class="pfoot"><span class="rt"><em>'+p.rate+'</em></span><button class="buy" type="button"><span>Add to Cart</span></button></div></div></article>';
 }
 grid.innerHTML=html;
 if(countEl) countEl.textContent=list.length+' products';
}
render(products);
document.querySelectorAll('.chip').forEach(function(b){
 b.addEventListener('click', function(){
  document.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('on'); });
  b.classList.add('on');
  var f=b.getAttribute('data-f');
  if(f==='all') render(products); else render(products.filter(function(p){ return p.cat===f; }));
 });
});
