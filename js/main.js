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

/* Enhanced Responsive Navigation */
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

if(navToggle && primaryNav){
  // Toggle mobile menu
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('open');
    
    // Prevent body scroll when menu is open
    if(!expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if(!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && primaryNav.classList.contains('open')) {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
  
  // Close menu when window is resized to desktop
  window.addEventListener('resize', () => {
    if(window.innerWidth > 768 && primaryNav.classList.contains('open')) {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
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

/* Formspree Email Handler */
const form = document.getElementById('contact-form');
if(form){
  const status = document.getElementById('form-status');
  
  // Email validation function
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const email = formData.get('_replyto')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();
    
    // Validation
    if(!name || !email || !subject || !message) {
      status.textContent = 'Please fill all required fields.';
      status.style.color = '#ff6b6b';
      return;
    }
    
    if(!isValidEmail(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#ff6b6b';
      return;
    }
    
    status.textContent = 'Sending message...';
    status.style.color = '#00d4ff';
    
    try {
      // Send via Formspree
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if(response.ok) {
        status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        status.style.color = '#4ade80';
        form.reset();
        
        // Clear status after 5 seconds
        setTimeout(() => {
          status.textContent = '';
        }, 5000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Email send error:', error);
      status.textContent = 'Failed to send message. Please try again.';
      status.style.color = '#ff6b6b';
    }
  });
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

/* =========================
   Live Background Effects
   ========================= */

/* Create geometric patterns */
function createGeometricPatterns() {
  const patternsContainer = document.createElement('div');
  patternsContainer.className = 'geometric-patterns';
  document.body.appendChild(patternsContainer);

  const shapes = ['square', 'circle', 'triangle'];
  const shapeCount = 15;

  for (let i = 0; i < shapeCount; i++) {
    const shape = document.createElement('div');
    shape.className = 'geometric-shape';
    
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 20 + Math.random() * 60;
    
    shape.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${Math.random() * 20}s;
      animation-duration: ${20 + Math.random() * 10}s;
    `;

    if (shapeType === 'circle') {
      shape.style.borderRadius = '50%';
    } else if (shapeType === 'triangle') {
      shape.style.width = '0';
      shape.style.height = '0';
      shape.style.borderLeft = `${size/2}px solid transparent`;
      shape.style.borderRight = `${size/2}px solid transparent`;
      shape.style.borderBottom = `${size}px solid rgba(255, 255, 255, 0.1)`;
      shape.style.background = 'transparent';
    }

    patternsContainer.appendChild(shape);
  }
}

/* Create floating particles */
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);

  const particleCount = 80;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = 1 + Math.random() * 3;
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${Math.random() * 25}s;
      animation-duration: ${25 + Math.random() * 15}s;
    `;
    
    particlesContainer.appendChild(particle);
  }
}

/* Create wave effects */
function createWaveEffects() {
  const waveContainer = document.createElement('div');
  waveContainer.className = 'wave-container';
  document.body.appendChild(waveContainer);

  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div');
    wave.className = 'wave';
    wave.style.top = `${i * 33}%`;
    waveContainer.appendChild(wave);
  }
}

/* Create matrix rain effect (canvas-based, non-intrusive) */
function createMatrixRain() {
  if (document.getElementById('matrix-canvas')) return; // ensure single instance

  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:-3;pointer-events:none;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const fontSize = 16;
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let columns, drops, width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * height / fontSize);
    ctx.font = `${fontSize}px monospace`;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0,212,255,0.6)';
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      if (y > height && Math.random() > 0.975) drops[i] = 0; else drops[i] += 0.9 + Math.random() * 0.6;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* Interactive background on mouse move */
function createInteractiveBackground() {
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
    
    // Subtle parallax effect on background gradients
    const before = document.body;
    if (before) {
      before.style.setProperty('--mouse-x', mouseX);
      before.style.setProperty('--mouse-y', mouseY);
    }
  });
}

/* Create premium dust effect */
function createPremiumDust() {
  const dustContainer = document.createElement('div');
  dustContainer.className = 'premium-dust';
  dustContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
  `;
  document.body.appendChild(dustContainer);

  // Add subtle dust particles
  for (let i = 0; i < 40; i++) {
    const dust = document.createElement('div');
    dust.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: premiumDustFloat ${12 + Math.random() * 8}s infinite linear;
      animation-delay: ${Math.random() * 12}s;
    `;
    dustContainer.appendChild(dust);
  }
}

/* Initialize live background */
document.addEventListener('DOMContentLoaded', () => {
  // Non-intrusive backgrounds
  createGeometricPatterns();
  createParticles();
  createWaveEffects();
  createMatrixRain(); // now canvas-based
  createInteractiveBackground();
  createPremiumDust();
  
  // Add CSS for premium dust animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes premiumDustFloat {
      0% {
        transform: translateY(0) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 0.4;
        transform: scale(1);
      }
      90% {
        opacity: 0.4;
      }
      100% {
        transform: translateY(-150px) translateX(100px) scale(0);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Performance optimization: pause animations when tab is not visible
  document.addEventListener('visibilitychange', () => {
    const particles = document.querySelector('.particles');
    const matrix = document.querySelector('.matrix-rain');
    const geometric = document.querySelector('.geometric-patterns');
    const waves = document.querySelector('.wave-container');
    const dust = document.querySelector('.premium-dust');
    
    if (document.hidden) {
      particles?.style.setProperty('animation-play-state', 'paused');
      matrix?.style.setProperty('animation-play-state', 'paused');
      geometric?.style.setProperty('animation-play-state', 'paused');
      waves?.style.setProperty('animation-play-state', 'paused');
      dust?.style.setProperty('animation-play-state', 'paused');
    } else {
      particles?.style.setProperty('animation-play-state', 'running');
      matrix?.style.setProperty('animation-play-state', 'running');
      geometric?.style.setProperty('animation-play-state', 'running');
      waves?.style.setProperty('animation-play-state', 'running');
      dust?.style.setProperty('animation-play-state', 'running');
    }
  });
});

/* Dynamic particle generation on scroll */
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  
  // Add extra particles during scroll
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer && Math.random() > 0.5) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = 1 + Math.random() * 2;
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${20 + Math.random() * 10}s;
    `;
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 30000);
  }
  
  scrollTimeout = setTimeout(() => {
    // Clean up extra particles after scroll stops
    const particles = document.querySelectorAll('.particle');
    if (particles.length > 100) {
      for (let i = 100; i < particles.length; i++) {
        particles[i].remove();
      }
    }
  }, 1000);
});
