/* ============================================================
   CV. Safira Mandiri — script.js
   ============================================================ */

/* ── Navbar: scroll style & active link ─────────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  showBackToTop();
  revealOnScroll();
});

updateNavbar();
updateActiveLink();

/* ── Hamburger menu ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});

/* ── Smooth scroll for anchor links ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Scroll-reveal animation ─────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const trigger = window.innerHeight * 0.88;
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add('visible');
  });
}

// Stagger siblings inside the same grid/container
document.querySelectorAll(
  '.produk-grid, .keunggulan-grid, .galeri-grid, .tentang-grid, .kontak-grid'
).forEach(container => {
  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
});

revealOnScroll(); // run on load too

/* ── Counter animation ───────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num');
let countersDone = false;

function animateCounters() {
  if (countersDone) return;
  const heroBottom = document.querySelector('.hero').getBoundingClientRect().bottom;
  if (heroBottom > 0) return; // still in view, skip
  countersDone = true;

  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const step   = Math.ceil(target / 60);
    let current  = 0;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = current;
    }, 28);
  });
}

// Also trigger counters when hero is in view
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    countersDone = false;
    counters.forEach(c => { c.textContent = '0'; });
    setTimeout(() => {
      counters.forEach(counter => {
        const target = +counter.dataset.target;
        const step   = Math.ceil(target / 60);
        let current  = 0;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          counter.textContent = current;
        }, 28);
      });
    }, 600);
  }
}, { threshold: 0.5 });

if (document.querySelector('.hero-stats')) {
  heroObserver.observe(document.querySelector('.hero-stats'));
}

/* ── Back to top button ──────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

function showBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Gallery lightbox ────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.galeri-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── Contact form ────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nama    = document.getElementById('nama').value.trim();
  const email   = document.getElementById('email').value.trim();
  const telepon = document.getElementById('telepon').value.trim();
  const pesan   = document.getElementById('pesan').value.trim();

  if (!nama || !email || !pesan) {
    showToast('Harap lengkapi semua field yang wajib diisi.', 'error');
    return;
  }

  // Simulate sending (replace with real API call as needed)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
    contactForm.reset();
    showToast(`Terima kasih, ${nama}! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.`, 'success');
  }, 1800);
});

/* ── Toast notification ──────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '100px',
    right:        '28px',
    background:   type === 'success' ? '#2e7d32' : '#c62828',
    color:        '#fff',
    padding:      '14px 20px',
    borderRadius: '12px',
    display:      'flex',
    alignItems:   'center',
    gap:          '10px',
    fontSize:     '.9rem',
    fontWeight:   '500',
    maxWidth:     '340px',
    boxShadow:    '0 8px 24px rgba(0,0,0,.18)',
    zIndex:       '3000',
    transform:    'translateY(16px)',
    opacity:      '0',
    transition:   'all .35s ease',
    fontFamily:   'Poppins, sans-serif',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ── Navbar overlay on mobile (click outside) ───────────────── */
// Already handled above, no duplicate needed

/* ── Init ────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  revealOnScroll();
  showBackToTop();
});
