document.documentElement.classList.add('reveal-ready');

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const glow = document.querySelector('.cursor-glow');
const year = document.getElementById('year');
const mobileQuery = window.matchMedia('(max-width: 61.25rem)');

if (year) year.textContent = new Date().getFullYear();

function openMenu() {
  if (!toggle || !nav || !mobileQuery.matches) return;
  document.body.classList.add('menu-open');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close navigation menu');
  navLinks[0]?.focus({ preventScroll: true });
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!toggle) return;
  document.body.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation menu');
  if (restoreFocus) toggle.focus({ preventScroll: true });
}

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) closeMenu();
  else openMenu();
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  if (!document.body.classList.contains('menu-open')) return;
  closeMenu({ restoreFocus: !link.hash });
  if (link.hash) {
    const section = document.getElementById(link.hash.slice(1));
    section?.setAttribute('tabindex', '-1');
    section?.focus({ preventScroll: true });
  }
}));

document.querySelector('.site-header')?.addEventListener('focusout', (event) => {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeMenu();
});

// Mount external pages only after a visitor asks to see a preview.
document.querySelectorAll('.project-demo').forEach((demo) => {
  demo.addEventListener('toggle', () => {
    const frame = demo.querySelector('iframe');
    if (demo.open && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
    demo.querySelector('summary').textContent = demo.open ? 'Hide live preview' : 'Show live preview';
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    closeMenu({ restoreFocus: true });
  }
});

document.addEventListener('click', (event) => {
  if (!document.body.classList.contains('menu-open')) return;
  if (!nav?.contains(event.target) && !toggle?.contains(event.target)) closeMenu();
});

mobileQuery.addEventListener?.('change', (event) => {
  if (!event.matches) closeMenu();
});

if (glow && window.matchMedia('(pointer: fine)').matches) {
  let glowFrame = 0;
  window.addEventListener('pointermove', (event) => {
    cancelAnimationFrame(glowFrame);
    glowFrame = requestAnimationFrame(() => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
  }, { passive: true });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('show'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const floatingLinks = [...document.querySelectorAll('.floating-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id], .hero')];
let scrollFrame = 0;

function updateCurrentSection() {
  let current = 'top';
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 180) current = section.id || 'top';
  });

  floatingLinks.forEach((link) => {
    const target = link.hash.slice(1) || 'top';
    const active = target === current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(updateCurrentSection);
}, { passive: true });

updateCurrentSection();
