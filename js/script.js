const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =====================================================================
// Scroll progress bar
// =====================================================================
const progressBar = document.getElementById('progressBar');
let progressTicking = false;

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${pct})`;
  progressTicking = false;
}

window.addEventListener('scroll', () => {
  if (!progressTicking) {
    requestAnimationFrame(updateProgressBar);
    progressTicking = true;
  }
}, { passive: true });
updateProgressBar();

// =====================================================================
// Scrollspy — highlight the nav link for the section in view
// =====================================================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => spy.observe(s));
}

// =====================================================================
// Card spotlight — cursor-tracking glow on hoverable cards
// =====================================================================
const spotlightCards = document.querySelectorAll('.matrix-card, .project-card, .cert-card, .contact-card');

spotlightCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// =====================================================================
// Footer year + live local clock
// =====================================================================
document.getElementById('year').textContent = new Date().getFullYear();

const footerClock = document.getElementById('footerClock');
function updateClock() {
  if (!footerClock) return;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace('_', ' ');
  footerClock.textContent = `${time} · ${tz}`;
}
updateClock();
setInterval(updateClock, 30000);

// =====================================================================
// Mobile nav toggle
// =====================================================================
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =====================================================================
// Hero name — per-letter staggered reveal
// =====================================================================
const heroName = document.getElementById('heroName');
if (heroName) {
  const text = heroName.textContent;
  heroName.textContent = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = reduceMotion ? '0s' : `${0.25 + i * 0.035}s`;
    heroName.appendChild(span);
  });
}

// =====================================================================
// Scroll reveal for sections
// =====================================================================
const revealTargets = document.querySelectorAll(
  '.section-head, .about-grid, .matrix-card, .timeline, .timeline-item, .project-card, .cert-card, .contact-cards'
);
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

// =====================================================================
// Hero stat count-up — animates any hero-meta-num with a numeric
// data-count > 0. Placeholders ("X+") are left as-is until real
// numbers are set on the data-count attribute in index.html.
// =====================================================================
const statEls = document.querySelectorAll('.hero-meta-num[data-count]');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (!target || reduceMotion) return;
  const suffix = el.textContent.replace(/[0-9]/g, '');
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window) {
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statIo.observe(el));
}

// =====================================================================
// "Uptime" counter — playful nod to career start date. Edit START_DATE.
// =====================================================================
const START_DATE = new Date('2021-06-01T00:00:00');
const uptimeEl = document.getElementById('uptimeCounter');

function updateUptime() {
  if (!uptimeEl) return;
  const diffMs = Date.now() - START_DATE.getTime();
  const days = Math.floor(diffMs / 86400000);
  const years = (days / 365.25).toFixed(1);
  uptimeEl.textContent = `${years} yrs (${days.toLocaleString()} days)`;
}
updateUptime();

// =====================================================================
// Back to top button
// =====================================================================
const backToTop = document.getElementById('backToTop');
let backToTopTicking = false;

function updateBackToTop() {
  backToTop.classList.toggle('is-visible', window.scrollY > 480);
  backToTopTicking = false;
}
window.addEventListener('scroll', () => {
  if (!backToTopTicking) {
    requestAnimationFrame(updateBackToTop);
    backToTopTicking = true;
  }
}, { passive: true });
updateBackToTop();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
