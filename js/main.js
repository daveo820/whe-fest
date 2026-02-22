/**
 * WHE Fest — Main JavaScript
 * Nav scroll, scroll reveal, schedule tabs, email form, smooth scroll
 * Note: Mobile menu, footer, announcement bar, scroll-to-top
 *       and countdown are handled by components.js
 */

(function () {
  'use strict';

  // ── Nav scroll behavior ──────────────────────────────────
  const nav = document.getElementById('mainNav');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  // Run after components inject the bar
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(handleNavScroll, 50);
  });


  // ── Scroll reveal ────────────────────────────────────────
  function initReveal() {
    // Skip reveal animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', initReveal);


  // ── Schedule tabs (homepage preview) ─────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.schedule-tab');
    const day1 = document.getElementById('scheduleDay1');
    const day2 = document.getElementById('scheduleDay2');

    if (!tabs.length || !day1 || !day2) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const day = tab.dataset.day;

        // Update active class and ARIA state
        tabs.forEach(t => {
          t.classList.remove('schedule-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('schedule-tab--active');
        tab.setAttribute('aria-selected', 'true');

        if (day === '1') {
          day1.classList.remove('hidden');
          day2.classList.add('hidden');
        } else {
          day2.classList.remove('hidden');
          day1.classList.add('hidden');
        }

        // Trigger reveals on newly shown items
        const section = day === '1' ? day1 : day2;
        section.querySelectorAll('.reveal:not(.visible)').forEach(el => {
          setTimeout(() => el.classList.add('visible'), 80);
        });
      });

      // Keyboard: left/right arrow navigation between tabs
      tab.addEventListener('keydown', (e) => {
        const tabList = [...tabs];
        const idx = tabList.indexOf(tab);
        if (e.key === 'ArrowRight' && idx < tabList.length - 1) {
          tabList[idx + 1].focus();
          tabList[idx + 1].click();
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          tabList[idx - 1].focus();
          tabList[idx - 1].click();
        }
      });
    });
  });


  // ── Email form ───────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.querySelector('.email-signup__form');
    if (!emailForm) return;

    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = emailForm.querySelector('input[type="email"]');
      const btn   = emailForm.querySelector('button[type="submit"]');
      const email = input.value.trim();

      // Clear previous error state
      let errEl = emailForm.querySelector('.form-error');
      if (errEl) errEl.remove();
      input.style.borderColor = '';

      // Validate
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        input.style.borderColor = '#e57373';
        input.focus();
        errEl = document.createElement('p');
        errEl.className = 'form-error';
        errEl.style.cssText = 'color:#e57373; font-size:var(--text-xs); margin-top:0.4rem; letter-spacing:0.05em;';
        errEl.textContent = 'Please enter a valid email address.';
        input.insertAdjacentElement('afterend', errEl);
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          if (errEl.parentNode) errEl.remove();
        }, { once: true });
        return;
      }

      // Loading state
      btn.textContent = 'Joining\u2026';
      btn.disabled    = true;

      // Simulate async — replace setTimeout with actual API call
      setTimeout(() => {
        btn.textContent = 'You\'re In! ✦';
        input.disabled  = true;
        btn.style.cssText = 'background:transparent; border:1px solid var(--deep-gold); color:var(--deep-gold);';
        // TODO: fetch('/wp-json/newsletter/subscribe', { method:'POST', body: JSON.stringify({email}) });
      }, 800);
    });
  });


  // ── Sponsor / contact form ───────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const sponsorForm = document.querySelector('.sponsor-form');
    if (!sponsorForm) return;

    sponsorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = sponsorForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Inquiry Sent! We\'ll be in touch.';
        btn.style.cssText = 'background:transparent; border:1px solid var(--deep-gold); color:var(--deep-gold); width:100%;';
      }, 800);
    });
  });


  // ── Smooth scroll for anchor links ──────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navEl     = document.getElementById('mainNav');
        const barEl     = document.querySelector('.announcement-bar:not(.hidden)');
        const offset    = (navEl ? navEl.offsetHeight : 0) + (barEl ? barEl.offsetHeight : 0) + 20;
        const top       = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  });


  // ── Card hover tilt (subtle, desktop only) ───────────────
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.card, .ticket-card, .speaker-card, .hotel-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width  - 0.5;
          const y = (e.clientY - rect.top)  / rect.height - 0.5;
          card.style.transform = `translateY(-4px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
          card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.transition = 'transform 0.4s ease';
        });
      });
    });
  }

})();
