// Set active nav link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === 'index.html' && (href === '/' || href === 'index.html')) || (href && currentPage.includes(href.replace('.html','')))) {
      link.classList.add('active');
    }
  });
}

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;
  
  if (!themeToggle || !themeIcon) return;
  
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
    
    // Reinitialize particle animation for new theme
    window.reinitializeParticles && window.reinitializeParticles();
  });
}

function updateThemeIcon(theme, iconElement) {
  // Moon icon for light mode (click to go dark)
  const moonPath = 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z';
  // Sun icon for dark mode (click to go light)
  const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z';
  
  const pathElement = iconElement.querySelector('path');
  if (pathElement) {
    pathElement.setAttribute('d', theme === 'dark' ? sunPath : moonPath);
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  console.log('Viewport width:', window.innerWidth);
  console.log('Hamburger element:', hamburger);
  console.log('Nav menu element:', navMenu);
  console.log('Hamburger display:', window.getComputedStyle(hamburger)?.display);
  
  if (!hamburger || !navMenu) {
    console.warn('Hamburger or nav menu not found');
    return;
  }
  
  // Prevent default behavior and toggle menu
  hamburger.addEventListener('click', (e) => {
    console.log('Hamburger clicked!');
    e.preventDefault();
    e.stopPropagation();
    const isActive = navMenu.classList.contains('active');
    console.log('Menu currently active:', isActive, '-> toggling to', !isActive);
    navMenu.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      navMenu.classList.remove('active');
    }
  });
}

// Project card reveal using IntersectionObserver (staggered)
function initProjectAnimations() {
  const cards = document.querySelectorAll('.projects-grid .project-card');
  if (!cards || cards.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    cards.forEach(c => c.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach((card, i) => {
    // staggered transition using inline delay
    card.style.transitionDelay = `${i * 70}ms`;
    io.observe(card);
  });
}

// Nav fade-in initializer
function initNavFade() {
  const navMenu = document.getElementById('nav-menu');
  if (!navMenu) return;

  // Add visible class after a tiny delay so CSS transitions kick in on load
  setTimeout(() => navMenu.classList.add('visible'), 80);

  // When mobile menu toggles active, ensure links show (CSS handles .active)
  // Also remove visible when navigating away (handled elsewhere)
}

// Initialize when DOM is ready
// Parallax scroll effect for background grid
function initParallaxScroll() {
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        document.documentElement.style.setProperty('--scroll-y', scrollY);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Fire particle animation
class Particle {
  constructor(canvas, isInitial = false, isDarkMode = true) {
    this.canvas = canvas;
    this.isDarkMode = isDarkMode;
    if (isDarkMode) {
      this.size = Math.random() * 3 + 4; // 4-7px for fire pieces (smaller)
    } else {
      this.size = Math.random() * 2 + 2; // 2-4px for stars
    }
    this.rotation = Math.random() * Math.PI * 2; // Random starting rotation
    this.rotationSpeed = (Math.random() - 0.5) * 0.15; // Random spin speed
    this.hasBreeze = Math.random() < 0.4; // 40% of particles have breeze
    this.breezeTime = Math.random() * Math.PI * 2; // Random start phase
    this.opacity = 1;
    if (isDarkMode) {
      this.lifespan = 8000 + Math.random() * 4000; // 8-12 second lifespan for fire
    } else {
      this.lifespan = Math.random() * 1 + 2; // 2-3 seconds for light mode stars
    }
    this.age = 0;
    if (isInitial) {
      this.initializeSpread();
    } else {
      this.reset();
    }
  }

  initializeSpread() {
    if (this.isDarkMode) {
      // Dark mode: spawn from bottom or right edge, ON the visible screen
      if (Math.random() < 0.5) {
        // Spawn from bottom edge
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height - 10; // 10px from bottom edge
      } else {
        // Spawn from right edge
        this.x = this.canvas.width - 10; // 10px from right edge
        this.y = Math.random() * this.canvas.height;
      }
      
      // Constant velocity N 35 degrees W (35 degrees west of north)
      const speed = 1.8; // Fixed speed (slower)
      const angleRad = (90 + 35) * Math.PI / 180; // 125 degrees in standard math
      this.vx = Math.cos(angleRad) * speed; // westward (negative)
      this.vy = -Math.sin(angleRad) * speed; // northward (negative/upward)
      this.speed = 1;
    } else {
      // Light mode: old animation - spread across full screen
      this.x = Math.random() * (this.canvas.width + 400) - 100;
      this.y = Math.random() * (this.canvas.height + 200) - 100;
      
      // 50 degrees left-downward
      this.vx = -1.0 * Math.cos(Math.PI / 180 * 50); // ~-0.64
      this.vy = 1.0 * Math.sin(Math.PI / 180 * 50); // ~0.77
      
      this.speed = Math.random() * 1 + 2; // 2-3 px per frame
    }
  }

  reset() {
    if (this.isDarkMode) {
      // Dark mode: spawn from bottom or right edge, ON the visible screen edge
      if (Math.random() < 0.5) {
        // Spawn from bottom edge
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height - 10; // 10px from bottom edge
      } else {
        // Spawn from right edge
        this.x = this.canvas.width - 10; // 10px from right edge
        this.y = Math.random() * this.canvas.height;
      }
      
      // Constant velocity N 35 degrees W (35 degrees west of north)
      const speed = 1.8; // Fixed speed (slower)
      const angleRad = (90 + 35) * Math.PI / 180; // 125 degrees in standard math
      this.vx = Math.cos(angleRad) * speed; // westward (negative)
      this.vy = -Math.sin(angleRad) * speed; // northward (negative/upward)
      this.speed = 1;
    } else {
      // Light mode: old animation - spawn from across full width
      this.x = Math.random() * (this.canvas.width + 400) - 100;
      this.y = Math.random() * 100 - 100;
      
      // 50 degrees left-downward
      this.vx = -1.0 * Math.cos(Math.PI / 180 * 50); // ~-0.64
      this.vy = 1.0 * Math.sin(Math.PI / 180 * 50); // ~0.77
      
      this.speed = Math.random() * 1 + 2; // 2-3 px per frame
    }
    
    this.age = 0;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.15;
  }

  update(cursorX = null) {
    this.age += 16; // Roughly 60fps
    
    // Update rotation
    this.rotation += this.rotationSpeed;
    
    let vx = this.vx;
    let vy = this.vy;
    
    if (this.isDarkMode) {
      // Dark mode: gravity effect (particles fall slightly)
      vy += 0.05;
      
      // Air resistance
      vx *= 0.99;
      vy *= 0.99;
      
      // Breeze effect for dark mode particles
      if (this.hasBreeze) {
        this.breezeTime += 0.02;
        const breezeAmount = Math.sin(this.breezeTime) * 0.3;
        vx += breezeAmount * 0.2;
      }
    } else {
      // Light mode: old animation with cursor interaction
      // Light breeze effect for some particles
      if (this.hasBreeze) {
        this.breezeTime += 0.02;
        const breezeAmount = Math.sin(this.breezeTime) * 0.3;
        vx += breezeAmount * 0.3;
      }
      
      // Adjust direction based on cursor position
      if (cursorX !== null) {
        const centerX = this.canvas.width / 2;
        const cursorNormalized = (cursorX - centerX) / centerX;
        const angleAdjustment = cursorNormalized * 25;
        const angleRad = angleAdjustment * (Math.PI / 180);
        const speed = 1.0;
        vx = Math.sin(angleRad) * speed;
        vy = Math.cos(angleRad) * speed;
      }
    }
    
    this.x += vx * this.speed;
    this.y += vy * this.speed;
    
    // Fade out based on position - particles disappear before leaving screen
    if (this.isDarkMode) {
      // Dark mode: particles move up and left from bottom-right
      // Complete fade before reaching edge of screen
      const distFromStart = Math.sqrt(
        Math.pow(this.canvas.width - this.x, 2) + 
        Math.pow(this.canvas.height - this.y, 2)
      );
      const maxDist = Math.sqrt(
        Math.pow(this.canvas.width, 2) + 
        Math.pow(this.canvas.height, 2)
      );
      const progress = distFromStart / maxDist;
      
      // Fade from 40% to 80% of travel distance, disappear by 80%
      if (progress > 0.4) {
        this.opacity = Math.max(0, 1 - (progress - 0.4) / 0.4);
      } else {
        this.opacity = 1;
      }
    } else {
      // Light mode: particles fall diagonally from top
      // Fade starts when they reach middle vertically and complete before bottom
      const verticalProgress = this.y / (this.canvas.height * 0.8); // Complete fade by 80% down
      
      if (verticalProgress > 0.5) {
        this.opacity = Math.max(0, 1 - (verticalProgress - 0.5) / 0.5);
      } else {
        this.opacity = 1;
      }
    }

    // Reset if particle exits the canvas or is too old
    if (this.isDarkMode) {
      if (this.y < -100 || this.x < -100 || this.age > this.lifespan) {
        this.reset();
      }
    } else {
      // Light mode: old boundary check
      if (this.x < -50 || this.y > this.canvas.height + 100) {
        this.reset();
      }
    }
  }

  drawStar(ctx, color) {
    // Draw a 5-point star
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = color;

    const points = 10;
    const outerRadius = this.size;
    const innerRadius = this.size * 0.4;

    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawFirePiece(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw a rough rectangular fire piece
    const width = this.size * 0.6;
    const height = this.size;
    
    // Main fire color (bright red-orange)
    ctx.fillStyle = `rgba(255, 100, 50, ${this.opacity * 1.0})`; // Brighter red-orange
    ctx.fillRect(-width / 2, -height / 2, width, height);
    
    // Inner glow (yellow-orange)
    ctx.fillStyle = `rgba(255, 170, 80, ${this.opacity * 0.8})`; // Brighter orange glow
    ctx.fillRect(-width / 3, -height / 3, width * 0.66, height * 0.66);
    
    // Bright center (yellow)
    ctx.fillStyle = `rgba(255, 240, 100, ${this.opacity * 0.7})`; // Brighter yellow core
    ctx.fillRect(-width / 5, -height / 5, width * 0.4, height * 0.4);
    
    // Add some jagged edges for a more chaotic fire look
    ctx.strokeStyle = `rgba(239, 68, 68, ${this.opacity * 0.7})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height / 2);
    ctx.lineTo(-width * 0.4, -height * 0.6);
    ctx.lineTo(-width / 2, -height * 0.3);
    ctx.lineTo(-width * 0.3, -height * 0.2);
    ctx.lineTo(-width / 2, 0);
    ctx.lineTo(-width * 0.4, height * 0.4);
    ctx.lineTo(-width / 2, height / 2);
    ctx.stroke();

    ctx.restore();
  }

  draw(ctx, isDarkMode) {
    if (isDarkMode) {
      // Dark mode: draw fire pieces
      this.drawFirePiece(ctx);
    } else {
      // Light mode: draw star with blue color
      this.drawStar(ctx, '#0b66ff'); // Use light mode accent color
    }
  }
}

function initRainfallAnimation() {
  const canvas = document.getElementById('rainfall-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const html = document.documentElement;
  
  // Calculate particle count based on viewport size
  function calculateParticleCount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;
    // Target density: ~1 particle per 40,000 pixels
    const targetDensity = 40000;
    return Math.max(10, Math.floor(area / targetDensity));
  }
  
  // Set canvas size
  let particles = [];
  let nextParticleTime = 0;
  let animationFrameId;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Start with just 1 particle, rest will spawn gradually
    if (particles.length === 0) {
      const isDarkMode = html.getAttribute('data-theme') === 'dark';
      particles.push(new Particle(canvas, false, isDarkMode));
    }
  }
  
  function reinitializeForThemeChange() {
    // Clear all existing particles
    particles = [];
    nextParticleTime = 0;
    
    // Create first particle with new theme
    const isDarkMode = html.getAttribute('data-theme') === 'dark';
    particles.push(new Particle(canvas, false, isDarkMode));
  }
  
  // Initialize canvas and particles
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track cursor position
  let cursorX = window.innerWidth / 2; // Default to center
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
  });

  // Animation loop
  function animate() {
    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Detect current theme
    const isDarkMode = html.getAttribute('data-theme') === 'dark';

    // Spawn new particles gradually
    const targetParticleCount = isDarkMode ? calculateParticleCount() : 40; // More stars for light mode
    const spawnInterval = isDarkMode ? 200 : 100; // Faster spawning for light mode
    
    if (Date.now() > nextParticleTime && particles.length < targetParticleCount) {
      particles.push(new Particle(canvas, false, isDarkMode));
      nextParticleTime = Date.now() + spawnInterval;
    }

    // Update and draw particles with cursor position
    particles.forEach(particle => {
      particle.update(cursorX);
      particle.draw(ctx, isDarkMode);
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Start animation
  animate();
  
  // Expose reinitialize function globally for theme changes
  window.reinitializeParticles = reinitializeForThemeChange;

  // Return cleanup function if needed
  return () => cancelAnimationFrame(animationFrameId);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initThemeToggle();
    initMobileMenu();
    initProjectAnimations();
    initNavFade();
    initParallaxScroll();
    initRainfallAnimation();
  });
} else {
  setActiveNavLink();
  initThemeToggle();
  initMobileMenu();
  initProjectAnimations();
  initNavFade();
  initParallaxScroll();
  initRainfallAnimation();
}


