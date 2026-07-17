/* ============================================================
   DIY Finanzcoaching – main.js
   ============================================================ */

// ── CAL.COM BUCHUNGS-OVERLAY ──
// Ersetzt Calendly durch das cal.com-Inline-Widget, eingebettet in ein
// eigenes, im Seiten-Style gehaltenes Overlay. Klick auf einen Buchungs-
// link öffnet das Overlay über der Seite – ohne sie zu verlassen.
// Das Widget wird erst beim ersten Öffnen geladen (lazy).
const CAL_NAMESPACE = "coaching-uebersicht";
const CAL_LINK      = "diy-finanzcoaching-oliver-nitsch";

// cal.com Embed-Loader
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" });
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;

Cal.ns[CAL_NAMESPACE]("ui", {
  theme: "light",
  cssVarsPerTheme: {
    light: {
      "cal-brand": "#2d5a3d",
      "cal-text": "#1a1a18",
      "cal-text-emphasis": "#1a1a18",
      "cal-text-muted": "#7a7668",
      "cal-text-error": "#a33030",
      "cal-border": "#d4cfc3",
      "cal-border-default": "#d4cfc3",
      "cal-border-subtle": "#d4cfc3",
      "cal-border-booker": "#d4cfc3",
      "cal-bg-emphasis": "#ede9df"
    },
    dark: { "cal-brand": "#fafafa" }
  },
  hideEventTypeDetails: false,
  layout: "month_view"
});

// Overlay-Markup einmalig ins DOM einfügen
const calOverlay = document.createElement('div');
calOverlay.className = 'cal-overlay';
calOverlay.setAttribute('aria-hidden', 'true');
calOverlay.innerHTML = `
  <div class="cal-overlay__backdrop" data-cal-close></div>
  <div class="cal-overlay__dialog" role="dialog" aria-modal="true" aria-label="Termin buchen">
    <button class="cal-overlay__close" type="button" aria-label="Schließen" data-cal-close>&times;</button>
    <div class="cal-overlay__body">
      <div id="cal-modal-inline" class="cal-overlay__embed"></div>
    </div>
  </div>
`;
document.body.appendChild(calOverlay);

let calEmbedLoaded = false;

function openCalOverlay() {
  if (!calEmbedLoaded) {
    Cal.ns[CAL_NAMESPACE]("inline", {
      elementOrSelector: "#cal-modal-inline",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: CAL_LINK,
    });
    calEmbedLoaded = true;
  }
  calOverlay.classList.add('cal-overlay--open');
  calOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCalOverlay() {
  calOverlay.classList.remove('cal-overlay--open');
  calOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Klick-Delegation: alle Buchungslinks (data-cal-link) öffnen das Overlay
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-cal-link]');
  if (trigger) {
    e.preventDefault();
    openCalOverlay();
    return;
  }
  if (e.target.closest('[data-cal-close]')) {
    closeCalOverlay();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && calOverlay.classList.contains('cal-overlay--open')) {
    closeCalOverlay();
  }
});

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
  <a class="nav-drawer-link" href="${ROOT}#pricing">Preise</a>
  <a class="nav-drawer-link" href="${ROOT}#contact">Kontakt</a>
  <a class="nav-drawer-link" href="https://app.diy-finanzcoaching.de/dashboard" rel="noopener noreferrer">Login →</a>
  <a class="nav-drawer-link" href="https://app.cal.com/diy-finanzcoaching-oliver-nitsch" data-cal-namespace="coaching-uebersicht" data-cal-link="diy-finanzcoaching-oliver-nitsch" data-cal-config='{"layout":"month_view"}' rel="noopener noreferrer">Termin buchen</a>
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

// ── COOKIE BANNER & ANALYTICS ──
const COOKIE_KEY = 'diy_cookie_consent';
// ↓ Google Analytics Measurement-ID hier eintragen
const GA_ID = 'G-5M18DV1M83';

function loadAnalytics() {
  if (document.getElementById('ga-script')) return;
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

function initCookieBanner() {
  const stored = localStorage.getItem(COOKIE_KEY);
  if (stored === 'accepted') { loadAnalytics(); return; }
  if (stored === 'declined') return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie-Hinweis');
  banner.innerHTML = `
    <p>
      Diese Website verwendet Google Fonts und Google Analytics.
      Dabei werden Daten (u.&nbsp;a. deine IP-Adresse) an Google übertragen.
      Mit „Akzeptieren" stimmst du dem zu – bei „Ablehnen" werden keine
      Tracking-Daten erhoben und Schriften lokal ersetzt.
      Für die Terminbuchung wird beim Öffnen des Buchungsfensters cal.com
      geladen; dabei werden Daten an cal.com übertragen.
      <a href="${ROOT}datenschutz.html">Datenschutzerklärung</a>
    </p>
    <div class="cookie-banner-actions">
      <button class="cookie-btn cookie-btn-decline">Ablehnen</button>
      <button class="cookie-btn cookie-btn-accept">Akzeptieren</button>
    </div>
  `;

  document.body.appendChild(banner);
  requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('cookie-banner--visible')));

  banner.querySelector('.cookie-btn-accept').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    hideBanner(banner);
    loadAnalytics();
  });

  banner.querySelector('.cookie-btn-decline').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    hideBanner(banner);
  });
}

function hideBanner(banner) {
  banner.classList.remove('cookie-banner--visible');
  banner.addEventListener('transitionend', () => banner.remove(), { once: true });
}

initCookieBanner();

// ── CONTACT FORM (web3forms) ──
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const feedback = contactForm.querySelector('.form-feedback');
    const hCaptchaResponse = contactForm.querySelector('textarea[name=h-captcha-response]')?.value;
    if (!hCaptchaResponse) {
      feedback.className = 'form-feedback form-feedback--error';
      feedback.textContent = 'Bitte bestätige zuerst das Captcha.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm),
      });
      const data = await res.json();
      if (data.success) {
        feedback.classList.add('form-feedback--success');
        feedback.textContent = 'Danke – deine Nachricht ist angekommen! Ich melde mich in der Regel innerhalb von 24–48 Stunden.';
        contactForm.reset();
      } else {
        throw new Error(data.message);
      }
    } catch {
      feedback.classList.add('form-feedback--error');
      feedback.textContent = 'Da ist leider etwas schiefgelaufen. Bitte versuche es noch einmal oder schreib direkt an info@diy-finanzcoaching.de.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Nachricht senden →';
    }
  });
}
