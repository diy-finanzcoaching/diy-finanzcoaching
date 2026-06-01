/* ============================================================
   DIY Finanzcoaching – main.js
   ============================================================ */

// ── ROOT PATH DETECTION ──
// Erkennt den Pfad zum Site-Root anhand des style.css-Links.
// Root-Seiten laden "style.css", Blog-Seiten "../style.css".
const _cssHref = document.querySelector('link[href$="style.css"]')?.getAttribute('href') ?? 'style.css';
const ROOT = _cssHref.replace('style.css', '') || './';

// ── DYNAMIC NAV DRAWER ──
// Drawer wird nach dem <nav> ins DOM eingefügt
const drawerHTML = `
<div class="nav-drawer" id="nav-drawer">
  <a class="nav-drawer-link" href="${ROOT}">Start</a>
  <a class="nav-drawer-link" href="${ROOT}blog/">Blog</a>
  <a class="nav-drawer-link" href="${ROOT}#contact">Kontakt</a>
  <a class="nav-drawer-link" href="https://calendly.com/diy-finanzcoaching-nitsch/neues-meeting" rel="noopener noreferrer">Termin buchen</a>
  <div class="nav-drawer-meta">
    <a href="${ROOT}impressum.html">Impressum</a>
    <a href="${ROOT}datenschutz.html">Datenschutz</a>
  </div>
</div>
`;
document.querySelector('nav').insertAdjacentHTML('afterend', drawerHTML);

// ── BURGER TOGGLE ──
const navEl     = document.querySelector('nav');
const drawer    = document.getElementById('nav-drawer');
const burger    = document.querySelector('.nav-burger');

if (burger) {
  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('nav-drawer--open');
    navEl.classList.toggle('nav--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// Close drawer when a link inside is clicked
drawer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    drawer.classList.remove('nav-drawer--open');
    navEl.classList.remove('nav--open');
    document.body.style.overflow = '';
  });
});

// ── DYNAMIC FOOTER ──
const footerHTML = `
<footer>
  <div class="footer-logo">DIY Finanzcoaching</div>
  <div>Oliver Nitsch · <a href="${ROOT}impressum.html">Impressum</a> · <a href="${ROOT}datenschutz.html">Datenschutz</a></div>
  <div>© 2026</div>
</footer>
`;
document.querySelector('footer').outerHTML = footerHTML;

// ── HIDE-ON-SCROLL / SHOW-ON-SCROLL ──
let lastScrollY = window.scrollY;
let ticking = false;
const SCROLL_THRESHOLD = 80; // px vom Top – Nav bleibt sichtbar ganz oben

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentY = window.scrollY;

      if (currentY < SCROLL_THRESHOLD) {
        // Ganz oben – immer sichtbar
        navEl.classList.remove('nav--hidden');
      } else if (currentY > lastScrollY) {
        // Runterscrollen → verstecken
        navEl.classList.add('nav--hidden');
        // Drawer schließen falls offen
        drawer.classList.remove('nav-drawer--open');
        navEl.classList.remove('nav--open');
        document.body.style.overflow = '';
      } else {
        // Hochscrollen → zeigen
        navEl.classList.remove('nav--hidden');
      }

      lastScrollY = currentY;
      ticking = false;
    });
    ticking = true;
  }
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── HASH NAVIGATION ──
// Beim direkten Aufruf mit #anchor (z. B. von einer anderen Seite):
// Reveal-Animation am Ziel sofort auslösen, dann hinscrollen.
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  target.classList.add('visible');
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
});

// ── ACTIVE NAV LINK (für Unterseiten) ──
const currentPath = window.location.pathname.replace(/\/$/, '') + '/';
document.querySelectorAll('nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (currentPath.endsWith('/' + href) || currentPath === href || currentPath.endsWith(href))) {
    link.style.opacity = '0.5';
    link.style.pointerEvents = 'none';
  }
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('faq-open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('faq-open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    // Toggle clicked
    if (!isOpen) {
      item.classList.add('faq-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── COST BARS ANIMATION ──
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.cost-bar-fill').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { bar.style.width = target; });
        });
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.cost-chart').forEach(el => barObserver.observe(el));
