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

// Rainfall animation with theme-aware particles
class Particle {
  constructor(canvas, isInitial = false) {
    this.canvas = canvas;
    this.size = Math.random() * 2 + 2; // 2-4px
    this.hasBreeze = Math.random() < 0.3; // 30% of particles have breeze
    this.breezeTime = Math.random() * Math.PI * 2; // Random start phase
    if (isInitial) {
      this.initializeSpread();
    } else {
      this.reset();
    }
  }

  initializeSpread() {
    // On initial page load, spread particles across the full screen height
    this.x = Math.random() * (this.canvas.width + 400) - 100;
    this.y = Math.random() * (this.canvas.height + 200) - 100; // Spread across full height
    
    // 50 degrees left-downward
    this.vx = -1.0 * Math.cos(Math.PI / 180 * 50); // ~-0.64
    this.vy = 1.0 * Math.sin(Math.PI / 180 * 50); // ~0.77
    
    this.speed = Math.random() * 1 + 2; // 2-3 px per frame
  }

  reset() {
    // Spawn particles from across the full width of the screen
    this.x = Math.random() * (this.canvas.width + 400) - 100; // Span full width plus overflow
    this.y = Math.random() * 100 - 100; // Slightly above top edge
    
    // 50 degrees left-downward: angle = 180 - 50 = 130 degrees or -50 from horizontal
    // vx = -0.64 (left), vy = 0.77 (down) - normalized for 50 degree angle
    this.vx = -1.0 * Math.cos(Math.PI / 180 * 50); // ~-0.64
    this.vy = 1.0 * Math.sin(Math.PI / 180 * 50); // ~0.77
    
    // Scale speed for visual appeal
    this.speed = Math.random() * 1 + 2; // 2-3 px per frame (slower)
  }

  update(cursorX = null) {
    let vx = this.vx;
    let vy = this.vy;
    
    // Light breeze effect for some particles
    if (this.hasBreeze) {
      this.breezeTime += 0.02; // Advance breeze animation
      const breezeAmount = Math.sin(this.breezeTime) * 0.3; // Gentle breeze oscillation
      vx += breezeAmount * 0.3; // Apply breeze (reduced impact)
    }
    
    // Adjust direction based on cursor position, but keep speed constant
    if (cursorX !== null) {
      const centerX = this.canvas.width / 2;
      const cursorNormalized = (cursorX - centerX) / centerX; // -1 to 1
      
      // Map cursor to angle (-25 to 25 degrees from vertical)
      // Left side: 25 degrees left, Right side: 25 degrees right
      const angleAdjustment = cursorNormalized * 25; // -25 to 25 degrees
      
      // Convert to radians
      const angleRad = (angleAdjustment) * (Math.PI / 180);
      
      // Calculate velocity components maintaining constant speed
      // Base speed magnitude is ~1.0 (from sqrt(vx^2 + vy^2) where vx=-0.64, vy=0.77)
      const speed = 1.0;
      vx = Math.sin(angleRad) * speed; // Horizontal component
      vy = Math.cos(angleRad) * speed; // Vertical component (always positive/downward)
    }
    
    this.x += vx * this.speed;
    this.y += vy * this.speed;

    // Reset if particle exits the canvas
    if (this.x < -50 || this.y > this.canvas.height + 50) {
      this.reset();
    }
  }

  drawRaindrop(ctx, color) {
    // Draw a tapered raindrop shape
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Rotate to match falling angle
    const angle = Math.atan2(this.vy, this.vx);
    ctx.rotate(angle);

    ctx.strokeStyle = color;
    ctx.lineWidth = this.size * 0.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw teardrop/raindrop shape
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 1.5);
    ctx.lineTo(0, this.size * 1.5);
    ctx.stroke();

    ctx.restore();
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

  draw(ctx, isDarkMode) {
    if (isDarkMode) {
      // Dark mode: draw star with red/accent color
      this.drawStar(ctx, '#ef4444'); // Use dark mode accent color
    } else {
      // Light mode: draw star with blue/accent color
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
    // Target density: ~1 particle per 20,000 pixels
    const targetDensity = 20000;
    return Math.max(20, Math.floor(area / targetDensity));
  }
  
  // Set canvas size
  let particles = [];
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate particle count based on new size
    const newParticleCount = calculateParticleCount();
    const currentCount = particles.length;
    
    if (newParticleCount > currentCount) {
      // Add more particles
      for (let i = 0; i < newParticleCount - currentCount; i++) {
        particles.push(new Particle(canvas, true));
      }
    } else if (newParticleCount < currentCount) {
      // Remove excess particles
      particles = particles.slice(0, newParticleCount);
    }
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
  let animationFrameId;
  function animate() {
    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Detect current theme
    const isDarkMode = html.getAttribute('data-theme') === 'dark';

    // Update and draw particles with cursor position
    particles.forEach(particle => {
      particle.update(cursorX);
      particle.draw(ctx, isDarkMode);
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Start animation
  animate();

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


