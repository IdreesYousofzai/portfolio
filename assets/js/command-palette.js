/* ============================================================
   command-palette.js — Ctrl+K command palette
   ============================================================ */

const COMMANDS = [
  { label: 'Home',           icon: '🏠', action: () => navigate('index.html'),          shortcut: 'G H' },
  { label: 'About',          icon: '👤', action: () => navigate('about.html'),           shortcut: 'G A' },
  { label: 'Projects',       icon: '🚀', action: () => navigate('projects.html'),        shortcut: 'G P' },
  { label: 'Experience',     icon: '💼', action: () => navigate('experience.html'),      shortcut: 'G E' },
  { label: 'Certifications', icon: '🎓', action: () => navigate('certifications.html'), shortcut: 'G C' },
  { label: 'Articles',       icon: '✍️', action: () => navigate('articles.html'),        shortcut: 'G W' },
  { label: 'CV',             icon: '📄', action: () => navigate('cv.html'),              shortcut: 'G V' },
  { label: 'Contact',        icon: '📬', action: () => navigate('contact.html'),         shortcut: 'G M' },
  { label: 'Toggle Theme',   icon: '🌓', action: () => document.querySelector('.theme-toggle')?.click() },
  { label: 'GitHub',         icon: '🐙', action: () => openLink('https://github.com/ahmadidrees') },
  { label: 'LinkedIn',       icon: '💼', action: () => openLink('https://linkedin.com/in/ahmadidrees') },
  { label: 'Email Me',       icon: '📧', action: () => openLink('mailto:ahmad@example.com') },
  { label: 'Download CV',    icon: '⬇️', action: () => openLink('assets/documents/ahmad-idrees-cv.pdf') },
  { label: 'Scroll to Top',  icon: '⬆️', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
];

function navigate(path) {
  window.location.href = path;
}

function openLink(url) {
  window.open(url, '_blank', 'noopener');
}

export function initCommandPalette() {
  const overlay  = document.getElementById('cmd-overlay');
  const input    = document.getElementById('cmd-input');
  const results  = document.getElementById('cmd-results');
  const closeBtn = document.querySelector('.cmd-close');
  const cmdHints = document.querySelectorAll('.cmd-hint');
  if (!overlay || !input || !results) return;

  let selected = 0;
  let filtered = [...COMMANDS];

  function open() {
    overlay.classList.add('open');
    input.value = '';
    renderResults(COMMANDS);
    setTimeout(() => input.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderResults(items) {
    filtered = items;
    selected = 0;
    if (!items.length) {
      results.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--text-secondary);font-size:.85rem">No results found</div>`;
      return;
    }
    results.innerHTML = `
      <div class="cmd-section-title">Navigate</div>
      ${items.map((cmd, i) => `
        <div class="cmd-item${i === 0 ? ' selected' : ''}" data-index="${i}" role="option" aria-selected="${i === 0}">
          <div class="cmd-item-icon">${cmd.icon}</div>
          <span class="cmd-item-label">${cmd.label}</span>
          ${cmd.shortcut ? `<span class="cmd-item-shortcut">${cmd.shortcut}</span>` : ''}
        </div>
      `).join('')}
    `;
    attachItemListeners();
  }

  function attachItemListeners() {
    results.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        execute(filtered[idx]);
      });
      item.addEventListener('mouseover', () => {
        updateSelected(parseInt(item.dataset.index));
      });
    });
  }

  function updateSelected(idx) {
    const items = results.querySelectorAll('.cmd-item');
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === idx);
      item.setAttribute('aria-selected', i === idx);
    });
    selected = idx;
  }

  function execute(cmd) {
    if (!cmd) return;
    close();
    setTimeout(() => cmd.action(), 100);
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const matched = q ? COMMANDS.filter(c => c.label.toLowerCase().includes(q)) : COMMANDS;
    renderResults(matched);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if (!overlay.classList.contains('open')) return;

    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateSelected(Math.min(selected + 1, filtered.length - 1));
      scrollSelectedIntoView();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateSelected(Math.max(selected - 1, 0));
      scrollSelectedIntoView();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(filtered[selected]);
    }
  });

  function scrollSelectedIntoView() {
    const el = results.querySelector('.cmd-item.selected');
    el?.scrollIntoView({ block: 'nearest' });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn?.addEventListener('click', close);
  cmdHints.forEach(hint => hint.addEventListener('click', open));
}