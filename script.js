const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const links = document.querySelectorAll('.main-nav a');
const glow = document.querySelector('.cursor-glow');

document.getElementById('year').textContent = new Date().getFullYear();

toggle.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

links.forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('mousemove', (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const floatingLinks = document.querySelectorAll('.floating-nav a');
const sections = [...document.querySelectorAll('main section[id], .hero')];

window.addEventListener('scroll', () => {
  let current = 'top';
  sections.forEach((section) => {
    const id = section.id || 'top';
    const top = section.getBoundingClientRect().top;
    if (top <= 180) current = id;
  });

  floatingLinks.forEach((link) => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current || (href === 'top' && current === 'top'));
  });
});
