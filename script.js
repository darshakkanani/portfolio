/* Utility helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* THEME */
const themeToggle = $('#theme-toggle');
const root = document.documentElement;
const applyTheme = (t) => {
  if (t === 'light') root.setAttribute('data-theme','light');
  else root.removeAttribute('data-theme');
  themeToggle.textContent = t === 'light' ? '🌤️' : '🌙';
  themeToggle.setAttribute('aria-pressed', t === 'light');
};
const stored = localStorage.getItem('theme') || 'dark';
applyTheme(stored);
themeToggle && themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

/* Responsive nav */
const navToggle = $('#nav-toggle');
const primaryNav = $('#primary-nav');
navToggle && navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  primaryNav.classList.toggle('open');
});

/* Smooth internal scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if(!href || href === '#') return;
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      if(primaryNav.classList.contains('open')){
        primaryNav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false');
      }
    }
  });
});

/* Intersection Observer: stagger reveal */
const toReveal = $$('.panel, .card, .section-header, .kpi');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('fade-in');
      obs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
toReveal.forEach(el => io.observe(el));

/* KPI counters */
const kpis = $$('.kpi strong[data-count]');
kpis.forEach(el => {
  const target = Number(el.dataset.count || el.textContent) || 0;
  let cur = 0;
  const duration = 900; // ms
  const steps = Math.max(20, Math.round(duration / 16));
  const inc = Math.max(1, Math.round(target / steps));
  const id = setInterval(() => {
    cur += inc;
    if(cur >= target){ elementSet(el, target); clearInterval(id); }
    else elementSet(el, cur);
  }, Math.round(duration/steps));
  function elementSet(node, v){ node.textContent = String(v); }
});

/* Search filtering (press / to focus quickly) */
const searchInput = $('#site-search');
if(searchInput){
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const cards = $$('.project-card, .post-card, .card[data-title]');
    cards.forEach(card => {
      const title = (card.dataset.title || card.querySelector('h4')?.textContent || '').toLowerCase();
      const text = (card.textContent || '').toLowerCase();
      const visible = q === '' || title.includes(q) || text.includes(q);
      card.style.display = visible ? '' : 'none';
    });
  });
  window.addEventListener('keydown', (e) => { if(e.key === '/' && document.activeElement !== searchInput){ e.preventDefault(); searchInput.focus(); }});
}

/* Contact form (client-side demo + mailto fallback) */
const form = $('#contact-form');
const status = $('#form-status');
const mailBtn = $('#mailto-fallback');
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if(!name || !email || !message){
      status.textContent = 'Please fill all fields.'; status.style.color = '#ffcc66';
      return;
    }
    status.textContent = 'Sending...';
    setTimeout(() => {
      status.textContent = 'Message sent! (client-side demo)';
      status.style.color = '#8fe6a4';
      form.reset();
    }, 900);
  });
  mailBtn && mailBtn.addEventListener('click', () => {
    const subject = encodeURIComponent('Portfolio contact from website');
    const body = encodeURIComponent('Hi Darshak,%0D%0A%0D%0A[Write your message here]%0D%0A%0D%0ARegards,');
    window.location.href = `mailto:yourmail@example.com?subject=${subject}&body=${body}`;
  });
}

/* Back to top button */
const backToTop = $('#back-to-top');
window.addEventListener('scroll', () => {
  if(window.scrollY > 600) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';
});
backToTop && backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* Keyboard shortcuts: g then c to go contact, g then h home (like GitHub) */
window.addEventListener('keydown', (e) => {
  if(e.key === 'g'){
    const handler = (ev) => {
      if(ev.key === 'c') location.hash = '#contact';
      if(ev.key === 'h') location.hash = '#home';
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('keydown', handler);
  }
});

/* Card tilt (mouse move) — subtle 3D tilt for project & card elements */
const tiltEls = $$('.project-card, .card');
tiltEls.forEach(el => {
  el.addEventListener('mousemove', (ev) => {
    const r = el.getBoundingClientRect();
    const x = ev.clientX - r.left;
    const y = ev.clientY - r.top;
    const cx = r.width/2, cy = r.height/2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const rotX = (-dy * 6).toFixed(2);
    const rotY = (dx * 6).toFixed(2);
    el.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
  el.addEventListener('touchstart', () => { /* disable tilt on touch */ }, {passive:true});
});

/* Accessibility helpers: show outline only for keyboard users */
document.body.addEventListener('keydown', (e) => { if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
document.body.addEventListener('mousedown', () => document.documentElement.classList.remove('show-focus'));

/* Analytics placeholder */
(function analyticsStub(){
  const hook = document.getElementById('analytics-hook');
  if(hook) hook.textContent = 'placeholder — add analytics script';
})();
