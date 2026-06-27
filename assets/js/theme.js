/* ============================================================
   theme.js — Theme management: toggle, persist, sync
   ============================================================ */

const STORAGE_KEY  = 'portfolio-theme';
const ATTR         = 'data-theme';
const DARK         = 'dark';
const LIGHT        = 'light';

/* ── Read stored or system preference ───────────────────────── */
function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === DARK || stored === LIGHT) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

/* ── Apply theme to <html> ──────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute(ATTR, theme);
  document.documentElement.style.colorScheme = theme;
  updateToggleIcon(theme);
  dispatchThemeEvent(theme);
}

/* ── Persist to localStorage ────────────────────────────────── */
function persistTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

/* ── Toggle between dark ↔ light ────────────────────────────── */
function toggleTheme() {
  const current = document.documentElement.getAttribute(ATTR) || DARK;
  const next    = current === DARK ? LIGHT : DARK;
  applyTheme(next);
  persistTheme(next);
  return next;
}

/* ── Update toggle button icon ──────────────────────────────── */
function updateToggleIcon(theme) {
  const sunIcons  = document.querySelectorAll('.icon-sun');
  const moonIcons = document.querySelectorAll('.icon-moon');

  sunIcons.forEach(el => {
    el.style.display = theme === DARK ? 'block' : 'none';
  });

  moonIcons.forEach(el => {
    el.style.display = theme === LIGHT ? 'block' : 'none';
  });
}

/* ── Dispatch custom event for other modules to listen ──────── */
function dispatchThemeEvent(theme) {
  window.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: { theme } }));
}

/* ── Watch for OS-level preference changes ──────────────────── */
function watchSystemPreference() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', (e) => {
    // Only follow system if user has not manually set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT);
    }
  });
}

/* ── Main initialiser ───────────────────────────────────────── */
export function initTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);
  watchSystemPreference();

  // Wire up every .theme-toggle button (re-queried so layout.js can inject them first)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-toggle')) {
      toggleTheme();
    }
  });
}

/* ── Utility: get current theme ─────────────────────────────── */
export function getTheme() {
  return document.documentElement.getAttribute(ATTR) || DARK;
}

/* ── Utility: is dark? ───────────────────────────────────────── */
export function isDark() {
  return getTheme() === DARK;
}

/* ── Inline script snippet for <head> (prevents FOUC) ──────── */
export function getAntiFlashSnippet() {
  return `
    (function(){
      var s = localStorage.getItem('${STORAGE_KEY}');
      var p = window.matchMedia('(prefers-color-scheme: dark)').matches ? '${DARK}' : '${LIGHT}';
      document.documentElement.setAttribute('${ATTR}', s || p);
      document.documentElement.style.colorScheme = s || p;
    })();
  `.trim();
}
