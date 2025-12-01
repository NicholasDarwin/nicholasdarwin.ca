// Set active nav link based on current page
function setActiveNavLink(): void {
  const currentPage: string = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach((link: HTMLAnchorElement) => {
    link.classList.remove('active');
    const href: string | null = link.getAttribute('href');
    
    if (href && (
      href === currentPage || 
      (currentPage === 'index.html' && (href === '/' || href === 'index.html')) || 
      currentPage.includes(href.replace('.html', ''))
    )) {
      link.classList.add('active');
    }
  });
}

// Theme toggle functionality
function initThemeToggle(): void {
  const themeToggle: HTMLElement | null = document.getElementById('theme-toggle');
  const themeIcon: HTMLElement | null = document.getElementById('theme-icon');
  const html: HTMLElement = document.documentElement;
  
  if (!themeToggle || !themeIcon) return;
  
  // Check for saved theme preference or default to light mode
  const savedTheme: string = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme: string | null = html.getAttribute('data-theme');
    const newTheme: string = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
  });
}

function updateThemeIcon(theme: string, iconElement: HTMLElement): void {
  // Moon for dark mode toggle (shows when in light mode)
  // Sun for light mode toggle (shows when in dark mode)
  iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile menu toggle
function initMobileMenu(): void {
  const hamburger: HTMLElement | null = document.getElementById('hamburger-toggle');
  const navMenu: HTMLElement | null = document.getElementById('nav-menu');
  
  console.log('Viewport width:', window.innerWidth);
  console.log('Hamburger element:', hamburger);
  console.log('Nav menu element:', navMenu);
  
  if (hamburger) {
    const computedStyle = window.getComputedStyle(hamburger);
    console.log('Hamburger display:', computedStyle?.display);
  }
  
  if (!hamburger || !navMenu) {
    console.warn('Hamburger or nav menu not found');
    return;
  }
  
  // Prevent default behavior and toggle menu
  hamburger.addEventListener('click', (e: MouseEvent) => {
    console.log('Hamburger clicked!');
    e.preventDefault();
    e.stopPropagation();
    const isActive: boolean = navMenu.classList.contains('active');
    console.log('Menu currently active:', isActive, '-> toggling to', !isActive);
    navMenu.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  const menuLinks: NodeListOf<HTMLAnchorElement> = navMenu.querySelectorAll('a');
  menuLinks.forEach((link: HTMLAnchorElement) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('nav')) {
      navMenu.classList.remove('active');
    }
  });
}

// Project card reveal using IntersectionObserver (staggered)
function initProjectAnimations(): void {
  const cards: NodeListOf<HTMLElement> = document.querySelectorAll('.projects-grid .project-card');
  
  if (!cards || cards.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    cards.forEach((c: HTMLElement) => c.classList.add('visible'));
    return;
  }

  const options: IntersectionObserverInit = { 
    threshold: 0.12 
  };

  const io = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  cards.forEach((card: HTMLElement, i: number) => {
    // staggered transition using inline delay
    card.style.transitionDelay = `${i * 70}ms`;
    io.observe(card);
  });
}

// Nav fade-in initializer
function initNavFade(): void {
  const navMenu: HTMLElement | null = document.getElementById('nav-menu');
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
