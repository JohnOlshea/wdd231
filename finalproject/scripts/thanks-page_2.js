
var summary=document.getElementById('summary');
var params=new URLSearchParams(window.location.search);
if([...params.keys()].length===0){
 summary.innerHTML='<p>No form data found. Please go back to the contact form.</p>';
} else {
 var html='';
 params.forEach(function(v,k){
  var safe=v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  html+='<div class="sum-row"><dt>'+k+'</dt><dd>'+safe+'</dd></div>';
 });
 summary.innerHTML=html;
}
