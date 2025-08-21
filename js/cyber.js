/* cyber.js: interactive mind map (simple clickable nodes) */
document.addEventListener('DOMContentLoaded', () => {
  const map = document.getElementById('cyber-mindmap');
  if(!map) return;

  // Build simple interactive nodes
  const data = {
    achievements: [
      {title:'Cisco Endpoint Security', desc:'Completed certificate — hands-on labs.'},
      {title:'Bug Hunting', desc:'Web & Android writeups.'},
      {title:'B.Tech Cybersecurity', desc:'Formal education background.'},
      {title:'Bash Tooling', desc:'Automation scripts for recon & reporting.'}
    ],
    goals: [
      {title:'Security Architect', desc:'Design secure systems and blueprints.'},
      {title:'White-box Pentesting', desc:'Master code auditing & secure reviews.'},
      {title:'DevSecOps Integration', desc:'Embed security in CI/CD.'}
    ]
  };

  const canvas = document.createElement('div'); canvas.className = 'map-canvas interactive';
  ['achievements','goals'].forEach(key => {
    const col = document.createElement('div'); col.className = 'map-col';
    const h = document.createElement('h4'); h.textContent = key[0].toUpperCase() + key.slice(1);
    col.appendChild(h);
    data[key].forEach(node => {
      const btn = document.createElement('button');
      btn.className = 'map-node btn';
      btn.textContent = node.title;
      btn.setAttribute('aria-expanded','false');
      const detail = document.createElement('div'); detail.className = 'node-detail muted'; detail.textContent = node.desc; detail.style.display='none';
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        detail.style.display = open ? 'none' : 'block';
      });
      col.appendChild(btn); col.appendChild(detail);
    });
    canvas.appendChild(col);
  });
  // replace fallback content
  map.innerHTML = '';
  map.appendChild(canvas);

  /* Filters for project cards */
  const filterChips = Array.from(document.querySelectorAll('.filters .chip'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const applyFilter = (key) => {
    projectCards.forEach(card => {
      if(key === 'all') { card.classList.remove('is-filtered-out'); return; }
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      if(tags.includes(key)) card.classList.remove('is-filtered-out'); else card.classList.add('is-filtered-out');
    });
  };
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed','false'); });
      chip.classList.add('active'); chip.setAttribute('aria-pressed','true');
      applyFilter((chip.dataset.filter || 'all').toLowerCase());
    });
  });

  /* Tabs */
  const tabsRoot = document.getElementById('skills-tabs');
  if(tabsRoot){
    const tabButtons = Array.from(tabsRoot.querySelectorAll('.tab'));
    const panels = Array.from(tabsRoot.querySelectorAll('.tab-panel'));
    const showTab = (id) => {
      tabButtons.forEach(b => b.setAttribute('aria-selected', String(b.getAttribute('aria-controls') === id)));
      panels.forEach(p => { p.hidden = (p.id !== id); });
    };
    tabButtons.forEach(btn => btn.addEventListener('click', () => showTab(btn.getAttribute('aria-controls'))));
  }

  /* Accordion */
  Array.from(document.querySelectorAll('.accordion-header')).forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  /* Code copy */
  Array.from(document.querySelectorAll('.code-block')).forEach(block => {
    const btn = document.createElement('button');
    btn.className = 'btn small copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    block.appendChild(btn);
    btn.addEventListener('click', async () => {
      const code = block.querySelector('pre')?.innerText || '';
      try{
        await navigator.clipboard.writeText(code);
        const old = btn.textContent; btn.textContent = 'Copied!'; setTimeout(()=> btn.textContent = old, 1100);
      }catch(err){
        const old = btn.textContent; btn.textContent = 'Press Ctrl/Cmd+C'; setTimeout(()=> btn.textContent = old, 1500);
      }
    });
  });

  /* Modal */
  const modal = document.getElementById('cyber-modal');
  const modalTitle = modal?.querySelector('.modal-title');
  const modalDesc = modal?.querySelector('.modal-desc');
  const openModal = (title, desc) => {
    if(!modal) return;
    if(modalTitle) modalTitle.textContent = title || 'Details';
    if(modalDesc) modalDesc.textContent = desc || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
  };
  const closeModal = () => { if(!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); };
  Array.from(document.querySelectorAll('.open-modal')).forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const title = card?.querySelector('h4')?.textContent || card?.getAttribute('data-title') || '';
      const desc = card?.getAttribute('data-desc') || '';
      openModal(title, desc);
    });
  });
  modal?.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  modal?.querySelector('.modal-close')?.addEventListener('click', closeModal);
});
