// Enhanced Resume Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initResumeAnimations();
    initResumeControls();
    initAnimatedCounters();
    initParticleSystem();
    initRippleEffects();
    initLoadingSpinner();
});

function initResumeAnimations() {
    // Animate elements on scroll
    const resumeSection = document.querySelector('.resume-enhanced');
    if (!resumeSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animations
                const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                counters.forEach(counter => {
                    animateCounter(counter, parseInt(counter.getAttribute('data-count')));
                });
                
                // Animate highlight items with stagger
                const highlights = entry.target.querySelectorAll('.highlight-item');
                highlights.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                        
                        // Add entrance animation
                        item.style.animation = `slideInLeft 0.6s ease ${index * 0.1}s both`;
                    }, index * 100);
                });
                
                // Animate stat items
                const statItems = entry.target.querySelectorAll('.stat-item');
                statItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.animation = `slideInUp 0.6s ease ${index * 0.1}s both`;
                    }, 200 + index * 100);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(resumeSection);

    // Initial setup for animated elements
    const highlights = resumeSection.querySelectorAll('.highlight-item');
    highlights.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease';
    });
    
    const statItems = resumeSection.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
    });
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function initResumeControls() {
    const iframe = document.querySelector('.resume-preview iframe');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const fullscreenBtn = document.getElementById('fullscreen');
    
    if (!iframe) return;

    let currentZoom = 1;
    const zoomStep = 0.2;
    const minZoom = 0.6;
    const maxZoom = 2;

    // Zoom in functionality
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                iframe.style.transform = `scale(${currentZoom})`;
                iframe.style.transformOrigin = 'top left';
                
                // Add visual feedback
                zoomInBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    zoomInBtn.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    // Zoom out functionality
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                iframe.style.transform = `scale(${currentZoom})`;
                iframe.style.transformOrigin = 'top left';
                
                // Add visual feedback
                zoomOutBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    zoomOutBtn.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    // Fullscreen functionality
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const previewContainer = document.querySelector('.resume-preview');
            if (previewContainer) {
                if (previewContainer.requestFullscreen) {
                    previewContainer.requestFullscreen();
                } else if (previewContainer.webkitRequestFullscreen) {
                    previewContainer.webkitRequestFullscreen();
                } else if (previewContainer.msRequestFullscreen) {
                    previewContainer.msRequestFullscreen();
                }
                
                // Add visual feedback
                fullscreenBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    fullscreenBtn.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    // Add hover effects to control buttons
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Add enhanced button interactions
document.addEventListener('DOMContentLoaded', function() {
    const enhancedBtns = document.querySelectorAll('.btn-enhanced');
    
    enhancedBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(0) scale(0.98)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px) scale(1)';
        });
    });
});

// Enhanced Particle System
function initParticleSystem() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Add random horizontal movement
        const randomDelay = Math.random() * 5000;
        const randomDuration = 12000 + Math.random() * 8000;
        
        particle.style.animationDelay = randomDelay + 'ms';
        particle.style.animationDuration = randomDuration + 'ms';
        
        // Add subtle horizontal drift
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            particle.style.transform = `translateX(${randomX}px)`;
        }, 2000 + index * 500);
    });
}

// Ripple Effects for Buttons
function initRippleEffects() {
    const buttons = document.querySelectorAll('.btn-enhanced');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                }, 10);
                
                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                }, 600);
            }
        });
    });
}

// Loading Spinner Management
function initLoadingSpinner() {
    const iframe = document.querySelector('.resume-preview iframe');
    const overlay = document.querySelector('.preview-overlay');
    
    if (iframe && overlay) {
        iframe.addEventListener('load', () => {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// Enhanced floating elements with more complex movement
function enhanceFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        let angle = 0;
        const radius = 15;
        const speed = 0.02 + index * 0.01;
        
        setInterval(() => {
            angle += speed;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            element.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.sin(angle) * 0.2})`;
        }, 50);
    });
}

// Advanced geometric shapes animation
function enhanceGeometricShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        let rotation = 0;
        const rotationSpeed = 0.5 + index * 0.3;
        
        setInterval(() => {
            rotation += rotationSpeed;
            const scale = 1 + Math.sin(rotation * 0.05) * 0.1;
            shape.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        }, 50);
    });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', function() {
    enhanceFloatingElements();
    enhanceGeometricShapes();
});
