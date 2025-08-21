/* ai.js - small interactions for AI page */
document.addEventListener('DOMContentLoaded', () => {
  const map = document.getElementById('ai-mindmap');
  if(!map) return;
  // simple pulsing highlight to achievements
  const cols = map.querySelectorAll('.map-col li');
  cols.forEach((li, i) => {
    li.style.transition = 'transform .4s ease';
    li.addEventListener('mouseenter', ()=> li.style.transform = 'translateX(6px)');
    li.addEventListener('mouseleave', ()=> li.style.transform = '');
  });
});
