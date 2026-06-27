/* ============================================================
   animations.js — Hero text, role rotator, tilt, parallax
   ============================================================ */

/* ── Animated role rotator ──────────────────────────────────── */
export function initRoleRotator() {
  const el    = document.getElementById('role-rotator');
  if (!el) return;

  const roles  = ['Software Developer', 'Web Developer', 'Problem Solver', 'T-Level Student'];
  let index    = 0;
  let charIdx  = 0;
  let deleting = false;
  let waiting  = false;

  function tick() {
    const word    = roles[index];
    const current = el.textContent;

    if (waiting) return;

    if (!deleting && charIdx <= word.length) {
      el.textContent = word.slice(0, charIdx++);
      setTimeout(tick, 70);
    } else if (!deleting && charIdx > word.length) {
      waiting = true;
      setTimeout(() => { deleting = true; waiting = false; tick(); }, 1800);
    } else if (deleting && charIdx > 0) {
      el.textContent = word.slice(0, --charIdx);
      setTimeout(tick, 35);
    } else {
      deleting = false;
      index = (index + 1) % roles.length;
      setTimeout(tick, 400);
    }
  }
  tick();
}

/* ── Text character reveal (split by char) ──────────────────── */
export function initCharReveal() {
  const targets = document.querySelectorAll('[data-char-reveal]');
  targets.forEach(el => {
    const text = el.textContent;
    el.innerHTML = text
      .split('')
      .map((ch, i) => `<span class="char" style="transition-delay:${i * 25}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('');
    el.classList.add('char-reveal-ready');

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('char-reveal-active');
        observer.unobserve(el);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
  });
}

/* ── 3D Card tilt ───────────────────────────────────────────── */
export function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = (e.clientX - rect.left) / rect.width  - 0.5;
      const y       = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX   = y * -12;
      const tiltY   = x *  12;
      const glow    = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(59,130,246,0.08) 0%, transparent 60%)`;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
      card.style.background = glow;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.background = '';
      card.style.transition = 'transform 0.5s ease, background 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ── Parallax on scroll ─────────────────────────────────────── */
export function initParallax() {
  const targets = document.querySelectorAll('[data-parallax]');
  if (!targets.length) return;

  function update() {
    const scrollY = window.scrollY;
    targets.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
}

/* ── Counter animation ──────────────────────────────────────── */
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = target / 60;

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Hero name reveal ────────────────────────────────────────── */
export function initHeroReveal() {
  const items = document.querySelectorAll('.hero-reveal');
  items.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.8s cubic-bezier(0,0,0.2,1) ${i * 140}ms, transform 0.8s cubic-bezier(0,0,0.2,1) ${i * 140}ms`;
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 100);
  });
}

/* ── Magnetic buttons ────────────────────────────────────────── */
export function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  const btns = document.querySelectorAll('[data-magnetic]');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.25;
      const dy     = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = '';
      setTimeout(() => btn.style.transition = '', 400);
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });
}