/* ============================================================
   main.js — Core utilities: theme, cursor, scroll, loading
   ============================================================ */

/* ── Theme ──────────────────────────────────────────────────── */
export function initTheme() {
  const root    = document.documentElement;
  const toggle  = document.querySelector('.theme-toggle');
  const stored  = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme   = stored || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', theme);

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

/* ── Custom Cursor ──────────────────────────────────────────── */
export function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [role="button"], .card, .project-card, .cert-card, .article-card, .filter-tab, .cmd-item, .social-link, .nav-link')) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, [role="button"], .card, .project-card, .cert-card, .article-card, .filter-tab, .cmd-item, .social-link, .nav-link')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ── Scroll Progress ────────────────────────────────────────── */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = progress + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
}

/* ── Navbar scroll behaviour ────────────────────────────────── */
export function initNavbar() {
  const nav    = document.getElementById('navbar');
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mark active link
  const navLinks = document.querySelectorAll('.nav-link');
  const current  = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links?.classList.toggle('open');
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
    });
  });
}

/* ── Back to Top ────────────────────────────────────────────── */
export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Loading Screen ─────────────────────────────────────────── */
const LOADING_MESSAGES = [
  'INITIALISING PORTFOLIO...',
  'LOADING PROJECT DATABASE...',
  'RENDERING EXPERIENCE...',
  'LAUNCHING INTERFACE...',
  'READY',
];

export function initLoading(onComplete) {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.querySelector('.loading-bar');
  const text    = document.querySelector('.loading-text');
  const percent = document.querySelector('.loading-percent');
  if (!screen) { onComplete?.(); return; }

  // Skip if already seen this session
  if (sessionStorage.getItem('portfolio-loaded')) {
    screen.classList.add('loaded');
    onComplete?.();
    return;
  }

  let step  = 0;
  let pct   = 0;
  const total = LOADING_MESSAGES.length;

  function tick() {
    if (step >= total) {
      sessionStorage.setItem('portfolio-loaded', '1');
      setTimeout(() => {
        screen.classList.add('loaded');
        onComplete?.();
      }, 300);
      return;
    }
    const target = Math.round(((step + 1) / total) * 100);
    if (text)    text.textContent = LOADING_MESSAGES[step];
    animatePct(pct, target, () => {
      pct = target;
      step++;
      setTimeout(tick, 180);
    });
  }

  function animatePct(from, to, cb) {
    const duration = 350;
    const start    = performance.now();
    function frame(now) {
      const t   = Math.min((now - start) / duration, 1);
      const val = Math.round(from + (to - from) * easeOut(t));
      if (bar)     bar.style.width = val + '%';
      if (percent) percent.textContent = val + '%';
      if (t < 1)  requestAnimationFrame(frame);
      else        cb();
    }
    requestAnimationFrame(frame);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  setTimeout(tick, 200);
}

/* ── Scroll Reveal (IntersectionObserver) ───────────────────── */
export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Stagger children ───────────────────────────────────────── */
export function staggerReveal(parent, selector = '*', baseDelay = 80) {
  const children = parent.querySelectorAll(selector);
  children.forEach((child, i) => {
    child.classList.add('reveal');
    child.dataset.delay = i * baseDelay;
  });
  initReveal();
}

/* ── Toast notification ─────────────────────────────────────── */
export function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Skill bars animate on scroll ──────────────────────────── */
export function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const level = bar.dataset.level || '0';
        bar.style.width = level + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* ── Format date ─────────────────────────────────────────────── */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── Fetch JSON data ─────────────────────────────────────────── */
export async function fetchData(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('fetchData error:', err);
    return null;
  }
}

/* ── Debounce ────────────────────────────────────────────────── */
export function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}