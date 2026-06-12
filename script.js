/* ════════════════════════════════
   SUBTLE FOLIO — script.js
════════════════════════════════ */

function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('active'));

  document.getElementById('tab-' + name).classList.add('active');
  if (btn) btn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'about') animateSkillBars();
}

/* ─── THEME ─── */

function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  const icon = document.getElementById('theme-icon');
  icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-icon')
    .setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
})();

/* ─── PAGE LOADER ─── */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('page-loader').classList.add('hidden');
  }, 400);
});

/* ─── TOAST ─── */

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function copyEmail(btn) {
  const email = 'yalhadha@icloud.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast('Copied to clipboard');
  }).catch(() => {
    showToast('Failed to copy');
  });
}

/* ─── BACK TO TOP ─── */

const bttBtn = document.getElementById('btt-btn');

window.addEventListener('scroll', () => {
  bttBtn.classList.toggle('show', window.scrollY > 300);
}, { passive: true });

bttBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── SKILL BARS ─── */

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const w = bar.getAttribute('data-width');
    if (w && !bar.style.width) {
      setTimeout(() => { bar.style.width = w + '%'; }, 200);
    }
  });
}

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutTab = document.getElementById('tab-about');
if (aboutTab) skillObserver.observe(aboutTab);

/* ─── PROJECT FILTER ─── */

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.getAttribute('data-filter');
    const cards = document.querySelectorAll('#tab-projects .proj-card');
    let count = 0;

    cards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-year') === filter) {
        card.classList.remove('filter-chip-hidden');
        count++;
      } else {
        card.classList.add('filter-chip-hidden');
      }
    });

    document.getElementById('proj-count').textContent = count + ' work' + (count !== 1 ? 's' : '');
  });
});

/* ─── PROJECT MODAL ─── */

const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalYear = document.getElementById('modal-year');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalLinks = document.getElementById('modal-links');

function openModal(id) {
  const data = projectsData[id];
  if (!data) return;

  if (data.screenshot) {
    modalImg.src = data.screenshot;
    modalImg.alt = data.title + ' screenshot';
  } else {
    modalImg.src = '';
    modalImg.alt = '';
  }

  modalIcon.textContent = data.icon;
  modalTitle.textContent = data.title;
  modalYear.textContent = data.year;
  modalDesc.textContent = data.descLong || data.desc;
  modalTags.innerHTML = data.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

  if (data.url) {
    modalLinks.innerHTML = `<a href="${data.url}" target="_blank" rel="noopener" class="btn btn-d"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>${data.urlLabel || 'Live Preview'}</a>`;
  } else {
    modalLinks.innerHTML = '';
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-project]');
  if (card) {
    e.preventDefault();
    openModal(card.getAttribute('data-project'));
  }
});

/* ─── CONTACT FORM ─── */

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const message = this.message.value.trim();
  const recipient = 'yalhadha@icloud.com';

  const subject = encodeURIComponent('Portfolio Contact');
  const body = encodeURIComponent(
    `Hi, I'm ${name} (${email}).\n\n${message}`
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  showToast('Opening your email client…');
});

/* ─── KEYBOARD SHORTCUTS ─── */

document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const map = { '1': 'home', '2': 'about', '3': 'projects', '4': 'now' };
  const tab = map[e.key];
  if (tab) {
    const btn = document.querySelector(`.nav-icon[data-tab="${tab}"]`);
    if (btn) switchTab(tab, btn);
  }
});

if (typeof lucide !== 'undefined') lucide.createIcons();
