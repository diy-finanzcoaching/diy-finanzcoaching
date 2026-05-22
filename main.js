/* ============================================================
   DIY Finanzcoaching – main.js
   ============================================================ */

// ── DYNAMIC FOOTER ──
const footerHTML = `
<footer>
  <div class="footer-logo">DIY Finanzcoaching</div>
  <div>Oliver Nitsch · <a href="/diy-finanzcoaching.de/impressum.html">Impressum</a> · <a href="/diy-finanzcoaching.de/datenschutz.html">Datenschutz</a></div>
  <div>© 2026</div>
</footer>
`;

document.querySelector('footer').outerHTML = footerHTML;


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


// ── ACTIVE NAV LINK (für Unterseiten) ──
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.style.opacity = '0.5';
    link.style.pointerEvents = 'none';
  }
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
