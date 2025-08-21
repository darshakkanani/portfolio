/* startups.js: product flip animations & simple CTA */
document.addEventListener('DOMContentLoaded', () => {
  // flip cards already CSS-driven
  // provide a small animation on CTA hover
  document.querySelectorAll('.startup-card .btn.primary').forEach(b => {
    b.addEventListener('mouseenter', ()=> b.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'}],{duration:220,fill:'forwards'}));
    b.addEventListener('mouseleave', ()=> b.style.transform = '');
  });
});
