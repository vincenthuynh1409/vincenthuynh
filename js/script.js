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

const COMMAND = 'nmap -sV --scripts=vuln target.local';

const SCAN_LINES = [
  { text: 'Starting scan on target.local (10.0.4.22)', cls: 'term-dim' },
  { text: 'Discovered open port 22/tcp  (ssh)', cls: '' },
  { text: 'Discovered open port 443/tcp (https)', cls: '' },
  { text: 'Discovered open port 8080/tcp (http-proxy)', cls: '' },
  { text: 'Running vuln scripts against 3 services…', cls: 'term-dim' },
  { text: '✓ No known CVEs matched', cls: 'term-ok' },
  { text: '⚠ TLS cert expires in 12 days', cls: 'term-warn' },
  { text: '✓ 0 critical, 0 high findings', cls: 'term-ok' },
  { text: '', cls: '' },
  { text: 'STATUS: SECURE — scan complete in 4.2s', cls: 'term-ok' },
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
  '.section-head, .about-grid, .matrix-card, .timeline-item, .project-card, .cert-card, .contact-grid'
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
