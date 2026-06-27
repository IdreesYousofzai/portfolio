/* ============================================================
   layout.js — Injects shared nav + footer + global elements
   ============================================================ */

export function injectLayout() {
  injectHead();
  injectNav();
  injectFooter();
  injectGlobals();
}

function injectHead() {
  // Inject Google Fonts link if not present
  if (!document.getElementById('gfonts')) {
    const link = document.createElement('link');
    link.id   = 'gfonts';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
}

function injectNav() {
  const navEl = document.getElementById('navbar');
  if (!navEl) return;

  navEl.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">AI<span>.</span>dev</a>

      <nav class="nav-links" role="navigation" aria-label="Main navigation">
        <a href="index.html"           class="nav-link">Home</a>
        <a href="about.html"           class="nav-link">About</a>
        <a href="projects.html"        class="nav-link">Projects</a>
        <a href="experience.html"      class="nav-link">Experience</a>
        <a href="certifications.html"  class="nav-link">Certs</a>
        <a href="articles.html"        class="nav-link">Articles</a>
        <a href="cv.html"              class="nav-link">CV</a>
        <a href="contact.html"         class="nav-link">Contact</a>
      </nav>

      <div class="nav-actions">
        <button class="cmd-hint" aria-label="Open command palette (Ctrl+K)" title="Command palette">
          <kbd>⌘</kbd><kbd>K</kbd>
        </button>
        <button class="theme-toggle" aria-label="Toggle theme" title="Toggle light/dark">
          <svg class="icon-sun" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg class="icon-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;
}

function injectFooter() {
  const footerEl = document.querySelector('footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-copy">
        <div class="nav-logo" style="font-family:var(--font-display);font-weight:800;font-size:1rem;letter-spacing:-0.03em;color:var(--text-primary);margin-bottom:0.4rem">AI<span style="color:var(--accent)">.</span>dev</div>
        <p>© ${new Date().getFullYear()} Ahmad Idrees Yousofzai · Built with passion from Preston, UK 🇬🇧</p>
      </div>
      <div class="footer-links">
        <a href="about.html"    class="footer-link">About</a>
        <a href="projects.html" class="footer-link">Projects</a>
        <a href="contact.html"  class="footer-link">Contact</a>
      </div>
      <div class="footer-social">
        <a href="https://github.com/ahmadidrees" target="_blank" rel="noopener" class="social-link" aria-label="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
        </a>
        <a href="https://linkedin.com/in/ahmadidrees" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a href="mailto:ahmad@example.com" class="social-link" aria-label="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </a>
      </div>
    </div>
  `;
}

function injectGlobals() {
  // Cursor elements
  if (!document.getElementById('cursor-dot')) {
    document.body.insertAdjacentHTML('afterbegin', `
      <div id="cursor-dot"  aria-hidden="true"></div>
      <div id="cursor-ring" aria-hidden="true"></div>
    `);
  }

  // Scroll progress bar
  if (!document.getElementById('scroll-progress')) {
    document.body.insertAdjacentHTML('afterbegin', `<div id="scroll-progress" role="progressbar" aria-hidden="true"></div>`);
  }

  // Back to top
  if (!document.getElementById('back-to-top')) {
    document.body.insertAdjacentHTML('beforeend', `
      <button id="back-to-top" aria-label="Back to top" title="Back to top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    `);
  }

  // Toast
  if (!document.getElementById('toast')) {
    document.body.insertAdjacentHTML('beforeend', `<div id="toast" role="status" aria-live="polite"></div>`);
  }

  // Command palette overlay
  if (!document.getElementById('cmd-overlay')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cmd-overlay" role="dialog" aria-modal="true" aria-label="Command palette">
        <div id="cmd-palette">
          <div class="cmd-header">
            <svg class="cmd-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input id="cmd-input" type="text" placeholder="Search commands, pages..." autocomplete="off" spellcheck="false"/>
            <button class="cmd-close" aria-label="Close">Esc</button>
          </div>
          <div id="cmd-results" role="listbox"></div>
        </div>
      </div>
    `);
  }
}