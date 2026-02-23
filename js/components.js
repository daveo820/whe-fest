/**
 * WHE Fest — Shared Components
 * Injects: Announcement Bar · Full Footer · Scroll-to-Top · Page Transitions
 * Also handles: Hamburger animation · Nav overlay · Countdown timer
 */

(function () {
  'use strict';

  // ── Detect root path (home vs inner pages) ───────────────
  const isInnerPage = window.location.pathname.includes('/pages/');
  const root = isInnerPage ? '../' : './';
  const ticketsHref = `${root}pages/tickets.html`;
  const signupHref  = `${root}index.html#signup`;

  // ── Skip-to-Content Link ─────────────────────────────────
  function injectSkipLink() {
    const skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);

    // Since all pages now have <main id="main-content">, no patching needed.
    // Fallback: if the id is somehow missing, set it on <main> or first <section>.
    if (!document.getElementById('main-content')) {
      const mainTarget = document.querySelector('main') || document.querySelector('section');
      if (mainTarget) mainTarget.id = 'main-content';
    }
  }


  // ── Announcement Bar ─────────────────────────────────────
  function injectAnnouncementBar() {
    if (sessionStorage.getItem('whe-bar-dismissed')) return;

    const bar = document.createElement('div');
    bar.className = 'announcement-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Site announcement');
    bar.innerHTML = `
      <span class="announcement-bar__pulse" aria-hidden="true"></span>
      <p class="announcement-bar__text">
        <strong>Early Bird Tickets Now Open</strong> — Limited seats available for WHE Fest 2026
      </p>
      <a href="${ticketsHref}" class="announcement-bar__cta">
        Get Tickets&nbsp;→
      </a>
      <button class="announcement-bar__dismiss" aria-label="Dismiss announcement">✕</button>
    `;

    document.body.prepend(bar);
    document.body.classList.add('has-announcement-bar');

    bar.querySelector('.announcement-bar__dismiss').addEventListener('click', () => {
      bar.classList.add('hidden');
      document.body.classList.remove('has-announcement-bar');
      setTimeout(() => bar.remove(), 400);
      sessionStorage.setItem('whe-bar-dismissed', '1');
    });
  }


  // ── Full Footer ──────────────────────────────────────────
  function injectFooter() {
    // Remove any existing minimal footer on inner pages
    const existingFooter = document.querySelector('footer');
    if (existingFooter) existingFooter.remove();

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('role', 'contentinfo');
    footer.innerHTML = `
      <div class="container">
        <div class="site-footer__grid">

          <div>
            <a href="${root}index.html" class="site-footer__brand-name">
              WHE<span>Fest</span>
            </a>
            <p class="site-footer__tagline">
              Women Health Empowerment Festival<br/>
              Washington, DC · 2026
            </p>
            <p class="site-footer__org">
              Connected with Moms Across America<br/>
              &amp; the MAHA Initiative
            </p>
            <div class="site-footer__social" aria-label="Social media links">
              <a href="#" class="site-footer__social-link" aria-label="Instagram">IG</a>
              <a href="#" class="site-footer__social-link" aria-label="Twitter/X">𝕏</a>
              <a href="#" class="site-footer__social-link" aria-label="Facebook">FB</a>
              <a href="#" class="site-footer__social-link" aria-label="YouTube">YT</a>
            </div>
          </div>

          <div>
            <p class="site-footer__heading">Festival</p>
            <a href="${root}pages/speakers.html" class="site-footer__link">Speakers</a>
            <a href="${root}pages/schedule.html" class="site-footer__link">Schedule</a>
            <a href="${root}pages/location.html" class="site-footer__link">Location &amp; Lodging</a>
            <a href="${root}pages/tickets.html" class="site-footer__link">Tickets</a>
            <a href="${root}pages/sponsors.html" class="site-footer__link">Sponsors</a>
          </div>

          <div>
            <p class="site-footer__heading">Connect</p>
            <a href="${signupHref}" class="site-footer__link">Email List</a>
            <a href="${root}pages/sponsors.html#contact-sponsor" class="site-footer__link">Become a Sponsor</a>
            <a href="#" class="site-footer__link">Press Inquiries</a>
            <a href="#" class="site-footer__link">Contact Us</a>
            <a href="#" class="site-footer__link">Volunteer</a>
          </div>

          <div>
            <p class="site-footer__heading">Resources</p>
            <a href="#" class="site-footer__link">Sponsorship Packet</a>
            <a href="${root}pages/tickets.html#nonprofit" class="site-footer__link">Nonprofit Pricing</a>
            <a href="${root}pages/tickets.html#checkout" class="site-footer__link">Ticket FAQ</a>
            <a href="#" class="site-footer__link">Accessibility</a>
            <a href="#" class="site-footer__link">Media Kit</a>
          </div>

        </div>

        <div class="site-footer__bottom">
          <p class="site-footer__copy">
            © 2026 WHE Fest. All rights reserved. A nonprofit-affiliated event.
          </p>
          <div class="site-footer__legal">
            <a href="#" class="site-footer__legal-link">Privacy Policy</a>
            <a href="#" class="site-footer__legal-link">Terms of Service</a>
            <a href="#" class="site-footer__legal-link">Accessibility</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(footer);
  }


  // ── Nav Overlay ──────────────────────────────────────────
  function injectNavOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    if (!navToggle || !navLinks) return;

    function openMenu() {
      navLinks.classList.add('open');
      navToggle.classList.add('open');
      overlay.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      overlay.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
    });
  }


  // ── Countdown Timer ──────────────────────────────────────
  function initCountdown(targetId, targetDate) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const target = new Date(targetDate).getTime();

    function tick() {
      const now  = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        el.innerHTML = '<p class="section-label" style="text-align:center;">The Festival Has Begun!</p>';
        return;
      }

      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const pad = n => String(n).padStart(2, '0');

      el.innerHTML = `
        <div class="countdown__unit">
          <span class="countdown__number">${days}</span>
          <span class="countdown__label">Days</span>
        </div>
        <span class="countdown__sep" aria-hidden="true">:</span>
        <div class="countdown__unit">
          <span class="countdown__number">${pad(hours)}</span>
          <span class="countdown__label">Hours</span>
        </div>
        <span class="countdown__sep" aria-hidden="true">:</span>
        <div class="countdown__unit">
          <span class="countdown__number">${pad(minutes)}</span>
          <span class="countdown__label">Minutes</span>
        </div>
        <span class="countdown__sep" aria-hidden="true">:</span>
        <div class="countdown__unit">
          <span class="countdown__number">${pad(seconds)}</span>
          <span class="countdown__label">Seconds</span>
        </div>
      `;
    }

    tick();
    setInterval(tick, 1000);
  }


  // ── Page Transition ──────────────────────────────────────
  function initPageTransitions() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    // Fade in on load
    window.addEventListener('load', () => {
      overlay.style.opacity = '0';
    });

    // Fade out on internal link click
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (link.target === '_blank') return;
      if (href.startsWith('http') && !href.includes(window.location.hostname)) return;

      e.preventDefault();
      overlay.style.opacity = '1';
      overlay.style.transition = 'opacity 0.25s ease';
      setTimeout(() => { window.location.href = href; }, 260);
    });
  }


  // ── Active Nav Link Auto-Detection ──────────────────────
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav__links .nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      try {
        const resolved = new URL(href, window.location.href).pathname;
        link.classList.remove('nav__link--active');
        if (resolved === currentPath) {
          link.classList.add('nav__link--active');
        }
      } catch (e) { /* ignore malformed href */ }
    });
  }


  // ── Boot ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    injectSkipLink();
    injectAnnouncementBar();
    injectFooter();
    injectNavOverlay();
    setActiveNavLink();
    initPageTransitions();

    // Countdown — fires on homepage hero and tickets page
    // Target date: placeholder — replace with actual event date
    const EVENT_DATE = 'October 15, 2026 09:00:00';
    initCountdown('heroCountdown', EVENT_DATE);
    initCountdown('ticketsCountdown', EVENT_DATE);
  });

})();
