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
const spotlightCards = document.querySelectorAll('.matrix-card, .project-card, .cert-card');

spotlightCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// =====================================================================
// Footer year
// =====================================================================
document.getElementById('year').textContent = new Date().getFullYear();

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
// Hero terminal: typed command + scan output
// respects prefers-reduced-motion
// =====================================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const typedLineEl = document.getElementById('typedLine');
const typedCursorEl = document.getElementById('typedCursor');
const outputEl = document.getElementById('terminalOutput');

const COMMAND = 'cat profile.json';

const SCAN_LINES = [
  { text: '{', cls: 'term-dim' },
  { text: '  "name": "Vincent Huynh",', cls: '' },
  { text: '  "role": "Cybersecurity Professional",', cls: '' },
  { text: '  "focus": ["security", "problem-solving", "growth"],', cls: '' },
  { text: '  "status": "open_to_work",', cls: 'term-ok' },
  { text: '  "response_time": "< 24h"', cls: 'term-dim' },
  { text: '}', cls: 'term-dim' },
  { text: '', cls: '' },
  { text: '✓ Profile loaded successfully', cls: 'term-ok' },
];

function typeCommand(text, el, onDone) {
  if (reduceMotion) {
    el.textContent = text;
    onDone();
    return;
  }
  let i = 0;
  const speed = 32;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, speed);
    } else {
      onDone();
    }
  })();
}

function printOutput(lines, container) {
  if (reduceMotion) {
    lines.forEach(line => {
      const p = document.createElement('p');
      p.className = `out-line ${line.cls}`;
      p.textContent = line.text || '\u00A0';
      p.style.opacity = 1;
      container.appendChild(p);
    });
    return;
  }
  let idx = 0;
  (function next() {
    if (idx >= lines.length) {
      typedCursorEl.style.display = 'none';
      return;
    }
    const line = lines[idx];
    const p = document.createElement('p');
    p.className = `out-line ${line.cls}`;
    p.textContent = line.text || '\u00A0';
    container.appendChild(p);
    idx++;
    setTimeout(next, 320);
  })();
}

// Kick off once hero is in view (or immediately — it's above the fold)
typeCommand(COMMAND, typedLineEl, () => {
  setTimeout(() => printOutput(SCAN_LINES, outputEl), 250);
});

// =====================================================================
// Scroll reveal for sections
// =====================================================================
const revealTargets = document.querySelectorAll(
  '.section-head, .about-grid, .matrix-card, .timeline, .timeline-item, .project-card, .cert-card, .contact-grid'
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
// Contact form — placeholder handler (see README for real endpoints)
// =====================================================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Message captured locally — wire this form up to an endpoint (see README) to actually receive it.';
  formNote.style.color = 'var(--teal)';
  contactForm.reset();
});
