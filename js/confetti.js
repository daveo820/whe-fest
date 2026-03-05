/* ============================================================
   WHE Fest — Hero Gold Confetti Streams
   Two continuous streams flanking the large centre logo.
   Stream zones are measured from the real logo element so they
   stay tight regardless of viewport width.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx     = canvas.getContext('2d');
  const COLORS  = ['#C6A75E','#D4BA78','#E8D5A0','#F0E4B8','#A8893E','#B8A060'];
  const PER_STREAM = 55;  // particles per side

  /* Stream boundary fractions (0-1) relative to canvas width.
     Recalculated whenever the logo element reports its position. */
  let leftEdge  = 0;   // canvas left   → this x
  let rightEdge = 1;   // this x        → canvas right
  let animId    = null;
  let particles = [];

  /* ── Zone detection ─────────────────────────────────────── */
  function readLogoZone() {
    const logo = document.querySelector('.hero__logo-img');
    if (!logo || !canvas.width) return;

    const lr = logo.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    const w  = canvas.width;

    /* 12px clearance gap between stream and logo edge */
    leftEdge  = Math.max(0, (lr.left  - cr.left  - 12) / w);
    rightEdge = Math.min(1, (lr.right - cr.left  + 12) / w);
  }

  /* ── Particle factory ───────────────────────────────────── */
  function makeParticle(side, spreadY) {
    const isLeft   = side === 'left';
    const xMin     = isLeft ? 0        : rightEdge;
    const xMax     = isLeft ? leftEdge : 1;
    const xRange   = Math.max(xMax - xMin, 0.01);

    /* Ribbon shape — wide & thin, tumbles realistically */
    const w = 7  + Math.random() * 9;
    const h = 2.5 + Math.random() * 3;

    return {
      x:    (xMin + Math.random() * xRange) * canvas.width,
      y:    spreadY !== undefined
              ? -Math.random() * canvas.height      // initial fill spread
              : -(Math.random() * 60 + 10),         // recycle: just off top
      vx:   (Math.random() - 0.5) * 0.6,
      vy:   1.4 + Math.random() * 1.8,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() < 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.06),
      /* Sine drift — gives the lazy swirling fall */
      phase: Math.random() * Math.PI * 2,
      freq:  0.012 + Math.random() * 0.012,
      amp:   0.5   + Math.random() * 1.0,
      w, h,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.60 + Math.random() * 0.40,
      side,
    };
  }

  /* ── Init ───────────────────────────────────────────────── */
  function initParticles() {
    particles = [];
    for (let i = 0; i < PER_STREAM; i++) {
      particles.push(makeParticle('left',  true));
      particles.push(makeParticle('right', true));
    }
  }

  /* ── Draw one piece ─────────────────────────────────────── */
  function drawPiece(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    /* Thin highlight strip — gives metallic depth */
    ctx.globalAlpha = p.opacity * 0.55;
    ctx.fillStyle   = '#FFF9EC';
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.28);
    ctx.restore();
  }

  /* ── Frame ──────────────────────────────────────────────── */
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x   += p.vx + Math.sin(p.y * p.freq + p.phase) * p.amp;
      p.y   += p.vy;
      p.rot += p.rotV;

      if (p.y > canvas.height + 20) {
        /* Recycle back to top of the same stream */
        const next = makeParticle(p.side);
        Object.assign(p, next);
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
    resize();
    initParticles();
    frame();
  }

  /* Wait for everything (incl. logo image) to be laid out */
  window.addEventListener('load', start);

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    resize();
    frame();
  }, { passive: true });
}());
