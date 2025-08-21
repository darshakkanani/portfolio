/* main.js - shared behavior for all pages */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Theme */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const applyTheme = t => {
  if(t === 'light') root.setAttribute('data-theme','light');
  else root.removeAttribute('data-theme');
  if(themeToggle) themeToggle.textContent = t === 'light' ? '🌤️' : '🌙';
  if(themeToggle) themeToggle.setAttribute('aria-pressed', String(t === 'light'));
};
const saved = localStorage.getItem('theme') || 'dark';
applyTheme(saved);
if(themeToggle){
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

/* Responsive nav */
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
if(navToggle && primaryNav){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('open');
  });
}

/* Smooth scroll for same-page anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(!href || href === '#') return;
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      if(primaryNav && primaryNav.classList.contains('open')){
        primaryNav.classList.remove('open');
        navToggle && navToggle.setAttribute('aria-expanded','false');
      }
    }
  });
});

/* Intersection animations */
const els = $$('.panel, .card, .section-header, .kpi');
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('fade-in');
      obs.unobserve(e.target);
    }
  });
}, {threshold: 0.12});
els.forEach(el => io.observe(el));

/* KPI counters */
const kpis = $$('.kpi strong[data-count]');
kpis.forEach(el => {
  const target = Number(el.dataset.count || el.textContent) || 0;
  let cur = 0;
  const duration = 900;
  const steps = Math.max(20, Math.round(duration / 16));
  const inc = Math.max(1, Math.round(target / steps));
  const id = setInterval(() => {
    cur += inc;
    if(cur >= target){ el.textContent = String(target); clearInterval(id); }
    else el.textContent = String(cur);
  }, Math.round(duration/steps));
});

/* Search quick focus: press / */
const search = document.getElementById('site-search');
if(search){
  window.addEventListener('keydown', (e) => { if(e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); } });
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    const cards = Array.from(document.querySelectorAll('.project-card, .post-card, .card[data-title]'));
    cards.forEach(c => {
      const text = (c.dataset.title || c.textContent || '').toLowerCase();
      c.style.display = q === '' || text.includes(q) ? '' : 'none';
    });
  });
}

/* Contact form minimal demo */
const form = document.getElementById('contact-form');
if(form){
  const status = document.getElementById('form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
    if(!name || !email || !message){ status.textContent = 'Please fill all fields.'; status.style.color = '#ffcc66'; return; }
    status.textContent = 'Sending...';
    setTimeout(()=>{ status.textContent = 'Message queued (client-side demo).'; status.style.color = '#8fe6a4'; form.reset(); }, 900);
  });
  const mailBtn = document.getElementById('mailto-fallback');
  if(mailBtn) mailBtn.addEventListener('click', ()=> location.href = `mailto:yourmail@example.com?subject=${encodeURIComponent('Contact from portfolio')}`);
}

/* Back to top */
const back = document.getElementById('back-to-top');
window.addEventListener('scroll', () => { if(window.scrollY > 600) back.style.display = 'block'; else back.style.display = 'none'; });
if(back) back.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

/* Small card tilt on mouse for interactivity */
const tiltEls = Array.from(document.querySelectorAll('.project-card, .card'));
tiltEls.forEach(el => {
  el.addEventListener('mousemove', (ev) => {
    if(window.matchMedia('(hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = (ev.clientX - r.left - r.width/2) / (r.width/2);
    const dy = (ev.clientY - r.top - r.height/2) / (r.height/2);
    el.style.transform = `perspective(700px) rotateX(${(-dy*6).toFixed(2)}deg) rotateY(${(dx*6).toFixed(2)}deg) scale(1.02)`;
  });
  el.addEventListener('mouseleave', ()=> el.style.transform = '');
});

/* Accessibility focus outlines only for keyboard */
document.body.addEventListener('keydown', (e) => { if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
document.body.addEventListener('mousedown', ()=> document.documentElement.classList.remove('show-focus'));

/* Analytics placeholder hook */
const hook = document.getElementById('analytics-hook');
if(hook) hook.textContent = 'analytics placeholder';
