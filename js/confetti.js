/* ============================================================
   WHE Fest — Hero Gold Confetti Streams
   Two continuous streams flanking the large centre logo.
   Starts immediately with fallback zones, then re-reads the
   logo's real position 1.7 s after load (after heroTitleIn
   animation finishes: 0.25 s delay + 1.2 s duration + buffer).
   Hidden on viewports narrower than 900 px.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const COLORS = ['#C6A75E','#D4BA78','#E8D5A0','#F0E4B8','#A8893E','#B8A060'];
  const PER_STREAM = 55;

  let leftEdge  = 0.08;   // fraction of canvas width — updated after animation
  let rightEdge = 0.92;
  let animId    = null;
  let particles = [];
  let running   = false;

  /* ── Zone calculation (reads actual rendered position) ──── */
  function readLogoZone() {
    const logo = document.querySelector('.hero__logo-img');
    if (!logo) return;

    const rect = logo.getBoundingClientRect();
    const cw   = canvas.offsetWidth;
    if (cw < 1) return;

    /* Extra right padding accounts for calligraphic overflow of
       the Fest script extending beyond the img element's CSS box */
    leftEdge  = Math.max(0,    (rect.left  - 20) / cw);
    rightEdge = Math.min(0.99, (rect.right + 100) / cw);
  }

  /* ── Particle factory ───────────────────────────────────── */
  function makeParticle(side, spreadY) {
    const isLeft = side === 'left';
    const xMin   = isLeft ? 0        : rightEdge;
    const xMax   = isLeft ? leftEdge : 1;
    const range  = Math.max(xMax - xMin, 0.01);

    const w = 7  + Math.random() * 9;
    const h = 2.5 + Math.random() * 3;

    return {
      x:    (xMin + Math.random() * range) * canvas.width,
      y:    spreadY !== undefined
              ? -Math.random() * canvas.height
              : -(Math.random() * 60 + 10),
      vx:   (Math.random() - 0.5) * 0.6,
      vy:   1.4 + Math.random() * 1.8,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() < 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.06),
      phase: Math.random() * Math.PI * 2,
      freq:  0.012 + Math.random() * 0.012,
      amp:   0.5   + Math.random() * 1.0,
      w, h,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.60 + Math.random() * 0.40,
      side,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PER_STREAM; i++) {
      particles.push(makeParticle('left',  true));
      particles.push(makeParticle('right', true));
    }
  }

  /* ── Draw ───────────────────────────────────────────────── */
  function drawPiece(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    /* metallic highlight */
    ctx.globalAlpha = p.opacity * 0.55;
    ctx.fillStyle   = '#FFF9EC';
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.28);
    ctx.restore();
  }

  /* ── Frame ──────────────────────────────────────────────── */
  function frame() {
    if (!running) return;

    /* Hide on narrow viewports */
    if (canvas.width < 900) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animId = requestAnimationFrame(frame);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x   += p.vx + Math.sin(p.y * p.freq + p.phase) * p.amp;
      p.y   += p.vy;
      p.rot += p.rotV;

      if (p.y > canvas.height + 20) {
        Object.assign(p, makeParticle(p.side));
      }

      drawPiece(p);
    }

    animId = requestAnimationFrame(frame);
  }

  /* ── Resize ─────────────────────────────────────────────── */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    readLogoZone();
  }

  /* ── Bootstrap ──────────────────────────────────────────── */
  function start() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    /* Start immediately with broad fallback zones so confetti
       is visible from the first frame */
    leftEdge  = 0.08;
    rightEdge = 0.92;
    initParticles();
    running = true;
    frame();

    /* After heroTitleIn finishes (0.25 s delay + 1.2 s duration),
       re-read the logo's true rendered position and re-spread */
    setTimeout(function () {
      readLogoZone();
      initParticles();
    }, 1700);
  }

  window.addEventListener('load', start);

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    resize();
    initParticles();
    frame();
  }, { passive: true });
}());
