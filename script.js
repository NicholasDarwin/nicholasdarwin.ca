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
  // Moon for dark mode toggle (shows when in light mode)
  // Sun for light mode toggle (shows when in dark mode)
  iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initThemeToggle();
    initMobileMenu();
    initProjectAnimations();
    initNavFade();
  });
} else {
  setActiveNavLink();
  initThemeToggle();
  initMobileMenu();
  initProjectAnimations();
  initNavFade();
}

