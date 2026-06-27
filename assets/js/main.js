/* ============================================================
   main.js — Central coordinator + re-exports
   Imports from dedicated modules so HTML pages only need
   one import source while keeping each concern separated.
   ============================================================ */

/* ── Re-export dedicated modules ────────────────────────────── */
export { initTheme, getTheme, isDark } from './theme.js';
export { initCursor }                   from './cursor.js';
export { initLoading, dismissLoading, resetLoadingSession } from './loading.js';

/* ── Navbar ─────────────────────────────────────────────────── */
export function initNavbar() {
  const nav    = document.getElementById('navbar');
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (!nav) return;

  /* Scroll: add glass effect */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mark active link */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Mobile toggle */
  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  /* Close mobile menu on any nav link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Scroll Progress Bar ────────────────────────────────────── */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width  = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Back to Top ─────────────────────────────────────────────── */
export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Scroll Reveal (IntersectionObserver) ───────────────────── */
export function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Skill Bars ──────────────────────────────────────────────── */
export function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar[data-level]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = (entry.target.dataset.level || 0) + '%';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* ── Toast notification ──────────────────────────────────────── */
export function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Fetch JSON data ─────────────────────────────────────────── */
export async function fetchData(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[fetchData]', err);
    return null;
  }
}

/* ── Debounce ─────────────────────────────────────────────────── */
export function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ── Format date ──────────────────────────────────────────────── */
export function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/* ── Stagger reveal children ─────────────────────────────────── */
export function staggerReveal(parent, selector = ':scope > *', baseDelay = 80) {
  const children = parent.querySelectorAll(selector);
  children.forEach((child, i) => {
    child.classList.add('reveal');
    child.dataset.delay = String(i * baseDelay);
  });
  initReveal();
}
