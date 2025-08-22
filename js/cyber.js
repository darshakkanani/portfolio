/* cyber.js: interactive mind map (simple clickable nodes) */
// Cybersecurity Page Interactive Features

// Matrix Rain Background
class MatrixRain {
  constructor() {
    this.canvas = document.getElementById('matrix-rain');
    this.ctx = this.canvas.getContext('2d');
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    this.drops = [];
    this.fontSize = 14;
    this.columns = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Create drops
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = 1;
    }
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
  }

  animate() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
      
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Typing Effect
class TypeWriter {
  constructor(element, text, speed = 50) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.currentText = '';
    this.currentIndex = 0;
    this.isTyping = false;
  }

  start() {
    if (this.isTyping) return;
    this.isTyping = true;
    this.type();
  }

  type() {
    if (this.currentIndex < this.text.length) {
      this.currentText += this.text.charAt(this.currentIndex);
      this.element.textContent = this.currentText;
      this.currentIndex++;
      setTimeout(() => this.type(), this.speed);
    } else {
      this.isTyping = false;
    }
  }
}

// Terminal Functionality
class Terminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.commands = {
      help: () => this.printHelp(),
      clear: () => this.clear(),
      ls: () => this.listFiles(),
      whoami: () => this.whoami(),
      date: () => this.date(),
      echo: (args) => this.echo(args),
      hack: () => this.hack(),
      status: () => this.status()
    };
    
    this.init();
  }

  init() {
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(this.input.value);
        this.input.value = '';
      }
    });
  }

  executeCommand(cmd) {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    this.printLine(`$ ${cmd}`, 'input');
    
    if (this.commands[command]) {
      this.commands[command](args);
    } else if (command === 'exit') {
      this.close();
    } else {
      this.printLine(`Command not found: ${command}`, 'error');
    }
  }

  printLine(text, type = 'output') {
    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    line.textContent = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  printHelp() {
    this.printLine('Available commands:');
    this.printLine('  help     - Show this help');
    this.printLine('  clear    - Clear terminal');
    this.printLine('  ls       - List files');
    this.printLine('  whoami   - Show current user');
    this.printLine('  date     - Show current date');
    this.printLine('  echo     - Echo arguments');
    this.printLine('  hack     - Start hacking sequence');
    this.printLine('  status   - Show system status');
    this.printLine('  exit     - Close terminal');
  }

  clear() {
    this.output.innerHTML = '';
  }

  listFiles() {
    this.printLine('drwxr-xr-x 2 root root 4096 Dec 15 10:30 .');
    this.printLine('drwxr-xr-x 3 root root 4096 Dec 15 10:30 ..');
    this.printLine('-rw-r--r-- 1 root root  123 Dec 15 10:30 README.md');
    this.printLine('-rw-r--r-- 1 root root  456 Dec 15 10:30 config.txt');
    this.printLine('-rw-r--r-- 1 root root  789 Dec 15 10:30 secret.key');
  }

  whoami() {
    this.printLine('root');
  }

  date() {
    this.printLine(new Date().toString());
  }

  echo(args) {
    this.printLine(args.join(' '));
  }

  hack() {
    this.printLine('🚀 Starting hacking sequence...');
    this.printLine('[INFO] Bypassing firewall...');
    this.printLine('[INFO] Exploiting vulnerability...');
    this.printLine('[SUCCESS] System compromised!');
  }

  status() {
    this.printLine('System Status:');
    this.printLine('  CPU: 23%');
    this.printLine('  Memory: 67%');
    this.printLine('  Network: Active');
    this.printLine('  Security: Compromised');
  }

  close() {
    document.getElementById('terminal-modal').classList.remove('active');
  }
}

// Hacking Progress Simulation
class HackingProgress {
  constructor() {
    this.progressBar = document.getElementById('hacking-progress');
    this.progressText = document.getElementById('hacking-text');
    this.logs = document.getElementById('hacking-logs');
    this.steps = [
      { text: 'Initializing system...', progress: 10 },
      { text: 'Bypassing security protocols...', progress: 25 },
      { text: 'Accessing mainframe...', progress: 40 },
      { text: 'Decrypting data...', progress: 60 },
      { text: 'Installing backdoor...', progress: 80 },
      { text: 'System compromised successfully!', progress: 100 }
    ];
    this.currentStep = 0;
  }

  start() {
    this.currentStep = 0;
    this.runStep();
  }

  runStep() {
    if (this.currentStep >= this.steps.length) {
      setTimeout(() => this.complete(), 2000);
      return;
    }

    const step = this.steps[this.currentStep];
    this.progressText.textContent = step.text;
    this.progressBar.style.width = `${step.progress}%`;
    
    this.addLog(`[INFO] ${step.text}`);
    
    this.currentStep++;
    setTimeout(() => this.runStep(), 1500);
  }

  addLog(message) {
    const logLine = document.createElement('div');
    logLine.className = 'log-line';
    logLine.textContent = message;
    this.logs.appendChild(logLine);
    this.logs.scrollTop = this.logs.scrollHeight;
  }

  complete() {
    this.addLog('[SUCCESS] System initialization complete!');
    this.addLog('[INFO] All security protocols bypassed');
    this.addLog('[INFO] Welcome to the matrix...');
  }
}

// Animated Counter
class AnimatedCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = target;
    this.duration = duration;
    this.start = 0;
    this.increment = target / (duration / 16);
    this.current = 0;
  }

  start() {
    this.animate();
  }

  animate() {
    this.current += this.increment;
    if (this.current < this.target) {
      this.element.textContent = Math.floor(this.current);
      requestAnimationFrame(() => this.animate());
    } else {
      this.element.textContent = this.target;
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Start matrix rain background
  new MatrixRain();
  
  // Initialize typing effects
  const titleElement = document.getElementById('typing-title');
  const subtitleElement = document.getElementById('typing-subtitle');
  
  if (titleElement) {
    const titleWriter = new TypeWriter(titleElement, titleElement.textContent, 100);
    titleWriter.start();
  }
  
  if (subtitleElement) {
    setTimeout(() => {
      const subtitleWriter = new TypeWriter(subtitleElement, subtitleElement.textContent, 50);
      subtitleWriter.start();
    }, 2000);
  }
  
  // Initialize terminal
  const terminal = new Terminal();
  
  // Initialize hacking progress
  const hackingProgress = new HackingProgress();
  
  // Button event listeners
  const hackBtn = document.getElementById('hack-btn');
  const terminalBtn = document.getElementById('terminal-btn');
  
  if (hackBtn) {
    hackBtn.addEventListener('click', () => {
      document.getElementById('hacking-modal').classList.add('active');
      hackingProgress.start();
    });
  }
  
  if (terminalBtn) {
    terminalBtn.addEventListener('click', () => {
      document.getElementById('terminal-modal').classList.add('active');
      setTimeout(() => document.getElementById('terminal-input').focus(), 100);
    });
  }
  
  // Animate counters when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statItem = entry.target;
        const numberElement = statItem.querySelector('.stat-number');
        const target = parseInt(statItem.dataset.count);
        
        if (numberElement && target) {
          const counter = new AnimatedCounter(numberElement, target);
          counter.start();
        }
        
        observer.unobserve(statItem);
      }
    });
  });
  
  document.querySelectorAll('.stat-item').forEach(item => {
    observer.observe(item);
  });
  
  // Filter functionality
  const filterChips = document.querySelectorAll('.chip');
  const statusValue = document.querySelector('.status-value');
  const statusIndicator = document.querySelector('.status-indicator');
  
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Remove active class from all chips
      filterChips.forEach(c => c.classList.remove('active'));
      // Add active class to clicked chip
      chip.classList.add('active');
      
      // Update status
      if (statusValue) statusValue.textContent = chip.textContent;
      if (statusIndicator) statusIndicator.className = 'status-indicator active';
      
      // Simulate filtering
      setTimeout(() => {
        if (statusIndicator) statusIndicator.className = 'status-indicator';
      }, 1000);
    });
  });
  
  // Modal close functionality
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.remove('active');
    });
  });
  
  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Add some cyberpunk effects
  addCyberpunkEffects();
});

// Add cyberpunk visual effects
function addCyberpunkEffects() {
  // Add glitch effect to title
  const title = document.getElementById('typing-title');
  if (title) {
    setInterval(() => {
      if (Math.random() > 0.95) {
        title.style.textShadow = '2px 0 #ff00ff, -2px 0 #00ffff';
        setTimeout(() => {
          title.style.textShadow = '';
        }, 100);
      }
    }, 1000);
  }
  
  // Add scan line effect
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-line';
  document.body.appendChild(scanLine);
  
  // Add particle effects
  createParticles();
}

// Create floating particles
function createParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particles-container';
  document.body.appendChild(particleContainer);
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particleContainer.appendChild(particle);
  }
}
