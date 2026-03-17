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
    const panels = [
      document.getElementById('scheduleDay1'),
      document.getElementById('scheduleDay2'),
      document.getElementById('scheduleDay3')
    ].filter(Boolean);

    if (!tabs.length || !panels.length) return;

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

        // Hide all panels, show selected
        panels.forEach(p => p.classList.add('hidden'));
        const activePanel = document.getElementById('scheduleDay' + day);
        if (activePanel) {
          activePanel.classList.remove('hidden');
          activePanel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            setTimeout(() => el.classList.add('visible'), 80);
          });
        }
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

    let emailSubmitted = false;

    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (emailSubmitted) return;
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
      emailSubmitted  = true;
      btn.textContent = 'Joining\u2026';
      btn.disabled    = true;

      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            btn.textContent = 'You\'re In! ✦';
            input.disabled  = true;
            btn.style.cssText = 'background:transparent; border:1px solid var(--deep-gold); color:var(--deep-gold);';
          } else {
            emailSubmitted  = false;
            btn.textContent = 'Join the List';
            btn.disabled    = false;
            let errEl = emailForm.querySelector('.form-error');
            if (!errEl) {
              errEl = document.createElement('p');
              errEl.className = 'form-error';
              errEl.style.cssText = 'color:#e57373; font-size:var(--text-xs); margin-top:0.4rem; letter-spacing:0.05em;';
              input.insertAdjacentElement('afterend', errEl);
            }
            errEl.textContent = data.error || 'Something went wrong. Please try again.';
          }
        })
        .catch(() => {
          emailSubmitted  = false;
          btn.textContent = 'Join the List';
          btn.disabled    = false;
        });
    });
  });


  // ── Sponsor / contact form ───────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const sponsorForm = document.querySelector('.sponsor-form');
    if (!sponsorForm) return;

    // Rate limit: max 3 submissions per session
    let submitCount = 0;
    const MAX_SUBMITS = 3;

    function showFieldError(field, msg) {
      let err = field.parentElement.querySelector('.field-error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'field-error';
        err.style.cssText = 'color:#e57373;font-size:var(--text-xs);margin-top:0.3rem;letter-spacing:0.05em;';
        field.insertAdjacentElement('afterend', err);
      }
      err.textContent = msg;
      field.style.borderColor = '#e57373';
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        if (err.parentNode) err.remove();
      }, { once: true });
    }

    sponsorForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check — bots fill the hidden field
      const honeypot = sponsorForm.querySelector('input[name="website_url"]');
      if (honeypot && honeypot.value.trim() !== '') return;

      // Rate limiting
      if (submitCount >= MAX_SUBMITS) return;

      const orgName     = sponsorForm.querySelector('#orgName');
      const contactName = sponsorForm.querySelector('#contactName');
      const emailInput  = sponsorForm.querySelector('#email');
      const message     = sponsorForm.querySelector('#message');
      const btn         = sponsorForm.querySelector('button[type="submit"]');

      // Clear previous errors
      sponsorForm.querySelectorAll('.field-error').forEach(el => el.remove());
      [orgName, contactName, emailInput, message].forEach(f => { if (f) f.style.borderColor = ''; });

      let valid = true;
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Strip characters that have no place in plain-text names/org names
      const dangerRe = /<|>|javascript:|data:/i;

      if (!orgName.value.trim()) {
        showFieldError(orgName, 'Organization name is required.'); valid = false;
      } else if (orgName.value.trim().length > 120 || dangerRe.test(orgName.value)) {
        showFieldError(orgName, 'Please enter a valid organization name.'); valid = false;
      }

      if (!contactName.value.trim()) {
        showFieldError(contactName, 'Contact name is required.'); valid = false;
      } else if (contactName.value.trim().length > 80 || dangerRe.test(contactName.value)) {
        showFieldError(contactName, 'Please enter a valid name.'); valid = false;
      }

      if (!emailRe.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address.'); valid = false;
      }

      if (message.value.trim().length > 1200) {
        showFieldError(message, 'Message must be 1200 characters or fewer.'); valid = false;
      }

      if (!valid) return;

      submitCount++;
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;

      fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName:     orgName.value.trim(),
          contactName: contactName.value.trim(),
          email:       emailInput.value.trim(),
          message:     message.value.trim(),
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            btn.textContent = 'Inquiry Sent! We\'ll be in touch.';
            btn.style.cssText = 'background:transparent; border:1px solid var(--deep-gold); color:var(--deep-gold); width:100%;';
          } else {
            submitCount--;
            btn.textContent = 'Send Inquiry';
            btn.disabled = false;
            showFieldError(emailInput, data.error || 'Something went wrong. Please try again.');
          }
        })
        .catch(() => {
          submitCount--;
          btn.textContent = 'Send Inquiry';
          btn.disabled = false;
        });
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
