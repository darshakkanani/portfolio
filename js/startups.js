/* Enhanced Startups Page JavaScript */
(function() {
  'use strict';

  // Animated Counter for metrics
  function AnimatedCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || '0', 10);
    const start = performance.now();
    const duration = 2000;
    
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      const current = Math.floor(easeOut * target);
      
      el.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    
    requestAnimationFrame(tick);
  }

  // Subtle animated background
  function SubtleAnimatedBackground(canvas){
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const points = Array.from({length: 25}).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      
      // Very subtle gradient overlay
      const g = ctx.createRadialGradient(canvas.width*0.8, canvas.height*0.2, 50, canvas.width*0.8, canvas.height*0.2, canvas.width*0.6);
      g.addColorStop(0, 'rgba(0,212,255,0.02)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // update points
      points.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      // draw very subtle connections
      ctx.strokeStyle = 'rgba(0,212,255,0.04)';
      ctx.lineWidth = 0.5;
      for(let i=0;i<points.length;i++){
        for(let j=i+1;j<points.length;j++){
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d2 = dx*dx + dy*dy;
          if(d2 < 200*200){
            ctx.globalAlpha = (1 - d2/(200*200)) * 0.3;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      // draw very subtle points
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = 'rgba(0,212,255,0.2)';
      points.forEach(p => { 
        ctx.beginPath(); 
        ctx.arc(p.x,p.y,0.8,0,Math.PI*2); 
        ctx.fill(); 
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  // Intersection Observer for animations
  function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Trigger counter animations when metrics come into view
          if (entry.target.classList.contains('hero-metrics')) {
            entry.target.querySelectorAll('.metric-number').forEach(el => {
              new AnimatedCounter(el);
            });
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for scroll animations
    document.querySelectorAll('.hero-metrics, .venture-card, .timeline-item, .collab-item').forEach(el => {
      observer.observe(el);
    });
  }

  // Enhanced card interactions
  function setupCardInteractions() {
    document.querySelectorAll('.venture-card').forEach(card => {
      const progressFill = card.querySelector('.progress-fill');
      const originalWidth = progressFill ? progressFill.style.width : '0%';
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        
        // Animate progress bar on hover
        if (progressFill) {
          const currentWidth = parseInt(originalWidth) || 0;
          progressFill.style.width = Math.min(100, currentWidth + 5) + '%';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        
        // Reset progress bar
        if (progressFill) {
          progressFill.style.width = originalWidth;
        }
      });
    });
  }

  // Floating elements animation
  function setupFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
      // Add random movement
      setInterval(() => {
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        
        element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 10 - 5}deg)`;
      }, 3000 + index * 500);
    });
  }

  // Network visualization animation
  function setupNetworkVisualization() {
    const networkNodes = document.querySelectorAll('.network-node:not(.central)');
    
    networkNodes.forEach((node, index) => {
      node.addEventListener('mouseenter', () => {
        node.style.transform = 'scale(1.1)';
        node.style.borderColor = '#00d4ff';
        node.style.backgroundColor = 'rgba(0, 212, 255, 0.2)';
      });
      
      node.addEventListener('mouseleave', () => {
        node.style.transform = '';
        node.style.borderColor = '';
        node.style.backgroundColor = '';
      });
      
      // Add subtle floating animation
      setInterval(() => {
        const angle = (Date.now() / 1000 + index * 1.5) * 0.5;
        const offsetX = Math.cos(angle) * 5;
        const offsetY = Math.sin(angle) * 5;
        
        if (!node.matches(':hover')) {
          node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      }, 50);
    });
  }

  // Button interactions
  function setupButtonInteractions() {
    // Enhanced primary buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.05)';
        btn.style.boxShadow = '0 15px 35px rgba(0, 212, 255, 0.4)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
      });
    });

    // Card buttons
    document.querySelectorAll('.btn-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Gradient text animation
  function setupGradientAnimation() {
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
      let hue = 0;
      setInterval(() => {
        hue = (hue + 1) % 360;
        gradientText.style.filter = `hue-rotate(${hue}deg)`;
      }, 100);
    }
  }

  // Parallax effect for background elements
  function setupParallaxEffect() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.bg-grid, .bg-gradient');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.2;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Add CSS for ripple animation
  function addRippleStyles() {
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize everything when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    setupCardInteractions();
    setupFloatingElements();
    setupNetworkVisualization();
    setupButtonInteractions();
    setupGradientAnimation();
    setupParallaxEffect();
    addRippleStyles();
    // Canvas background removed for simple background

    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  });

})();
