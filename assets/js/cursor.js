/* ============================================================
   cursor.js — Custom cursor: dot + trailing ring, hover, click
   ============================================================ */

const HOVER_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  'label',
  '.card',
  '.project-card',
  '.cert-card',
  '.cert-card-full',
  '.article-card',
  '.filter-tab',
  '.cmd-item',
  '.social-link',
  '.social-pill',
  '.nav-link',
  '.footer-link',
  '.contact-method',
  '.skill-icon-card',
  '.interest-card',
  '.edu-card',
  '.faq-card',
  '[data-tilt]',
  '[data-magnetic]',
].join(', ');

export function initCursor() {
  /* Skip on touch-only devices */
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  /* ── Position tracking ──────────────────────────────────── */
  let mouseX = -200;
  let mouseY = -200;
  let ringX  = -200;
  let ringY  = -200;
  let rafId;
  let isVisible = false;

  /* ── Mouse move: snap dot, lag ring ────────────────────── */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      // First move — snap ring too so it doesn't streak from corner
      ringX = mouseX;
      ringY = mouseY;
      isVisible = true;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    }
  }, { passive: true });

  /* ── Animate ring with lerp ─────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateRing() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);

    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
    ring.style.left = ringX  + 'px';
    ring.style.top  = ringY  + 'px';

    rafId = requestAnimationFrame(animateRing);
  }

  animateRing();

  /* ── Hover state ────────────────────────────────────────── */
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SELECTORS)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SELECTORS)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  /* ── Click state ────────────────────────────────────────── */
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  /* ── Hide when pointer leaves viewport ─────────────────── */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  /* ── Text inputs — shrink cursor to I-beam hint ─────────── */
  const inputSelectors = 'input, textarea, [contenteditable]';

  document.addEventListener('focusin', (e) => {
    if (e.target.matches(inputSelectors)) {
      ring.style.width  = '20px';
      ring.style.height = '20px';
      ring.style.borderRadius = '2px';
    }
  });

  document.addEventListener('focusout', (e) => {
    if (e.target.matches(inputSelectors)) {
      ring.style.width  = '';
      ring.style.height = '';
      ring.style.borderRadius = '';
    }
  });

  /* ── Cleanup ────────────────────────────────────────────── */
  return () => cancelAnimationFrame(rafId);
}
