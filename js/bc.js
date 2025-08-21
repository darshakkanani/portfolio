/* bc.js - blockchain small interactions */
document.addEventListener('DOMContentLoaded', () => {
  const map = document.getElementById('bc-mindmap');
  if(!map) return;
  // clicking a list item highlights it and shows a toast (simple)
  map.querySelectorAll('li').forEach(li => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      map.querySelectorAll('li').forEach(x=>x.style.opacity=0.6);
      li.style.opacity = 1;
      // small tooltip toast
      const t = document.createElement('div'); t.className='toast'; t.textContent = `Selected: ${li.textContent}`;
      document.body.appendChild(t);
      setTimeout(()=> t.classList.add('visible'), 10);
      setTimeout(()=> t.classList.remove('visible'), 1800);
      setTimeout(()=> t.remove(), 2200);
    });
  });
});
