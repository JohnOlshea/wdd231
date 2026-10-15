const dock = document.getElementById('dock');
const onScroll = () => {
  if(dock) dock.classList.toggle('on', window.scrollY > 320);
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();