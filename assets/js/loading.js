/* ============================================================
   loading.js — Loading screen: progress bar, messages, dismiss
   ============================================================ */

const MESSAGES = [
  'INITIALISING PORTFOLIO...',
  'LOADING PROJECT DATABASE...',
  'RENDERING EXPERIENCE...',
  'LAUNCHING INTERFACE...',
  'READY',
];

const SESSION_KEY = 'portfolio-loaded';
const TIMING = {
  initialDelay:  200,   // ms before first tick
  stepPause:     180,   // ms between message steps
  fillDuration:  350,   // ms to animate each percentage segment
  dismissDelay:  300,   // ms after 100% before hiding
};

/* ── Easing ─────────────────────────────────────────────────── */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Animate a number from `from` to `to` ───────────────────── */
function animateNumber(from, to, duration, onTick, onDone) {
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t       = Math.min(elapsed / duration, 1);
    const value   = Math.round(from + (to - from) * easeOutCubic(t));
    onTick(value);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      onDone?.();
    }
  }

  requestAnimationFrame(frame);
}

/* ── Main loading init ──────────────────────────────────────── */
export function initLoading(onComplete) {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.querySelector('.loading-bar');
  const textEl  = document.querySelector('.loading-text');
  const pctEl   = document.querySelector('.loading-percent');

  /* No loading screen in DOM → just call back */
  if (!screen) {
    onComplete?.();
    return;
  }

  /* Already shown this session → skip immediately */
  if (sessionStorage.getItem(SESSION_KEY)) {
    screen.classList.add('loaded');
    onComplete?.();
    return;
  }

  const total = MESSAGES.length;
  let step    = 0;
  let pct     = 0;

  function tick() {
    if (step >= total) {
      /* All steps done — mark session, dismiss */
      sessionStorage.setItem(SESSION_KEY, '1');
      setTimeout(() => {
        screen.classList.add('loaded');
        /* Remove from DOM after transition */
        screen.addEventListener('transitionend', () => screen.remove(), { once: true });
        onComplete?.();
      }, TIMING.dismissDelay);
      return;
    }

    const targetPct = Math.round(((step + 1) / total) * 100);

    if (textEl) textEl.textContent = MESSAGES[step];

    animateNumber(pct, targetPct, TIMING.fillDuration, (val) => {
      if (bar)   bar.style.width    = val + '%';
      if (pctEl) pctEl.textContent  = val + '%';
    }, () => {
      pct = targetPct;
      step++;
      setTimeout(tick, TIMING.stepPause);
    });
  }

  setTimeout(tick, TIMING.initialDelay);
}

/* ── Force dismiss (e.g. on error) ─────────────────────────── */
export function dismissLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  screen.classList.add('loaded');
  sessionStorage.setItem(SESSION_KEY, '1');
}

/* ── Reset session flag (useful in dev) ─────────────────────── */
export function resetLoadingSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
