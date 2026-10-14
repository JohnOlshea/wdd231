const dock = document.getElementById('dock');
const onScroll = () => dock.classList.toggle('on', scrollY > 320);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
