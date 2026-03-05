/* ============================================================
   WHE Fest — Hero Gold Confetti Streams
   Two continuous streams flanking the large centre logo.
   Zones are derived from CSS math (no DOM timing dependency)
   so confetti starts the instant the page opens.
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

  let leftEdge  = 0.08;
  let rightEdge = 0.88;
  let animId    = null;
  let particles = [];
  let running   = false;

  /* ── Zone calculation ───────────────────────────────────────
     Logo CSS: width = min(860px, 92vw), transform = translateX(-8%)
     +120 px right padding accounts for calligraphic Fest overflow. */
  function calcZones() {
    const vw          = canvas.width;
    const logoW       = Math.min(860, vw * 0.92);
    const visualShift = logoW * 0.08;
    const visualLeft  = (vw - logoW) / 2 - visualShift;
    const visualRight = visualLeft + logoW;

    leftEdge  = Math.max(0,    (visualLeft  - 20)  / vw);
    rightEdge = Math.min(0.99, (visualRight + 120) / vw);
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
    calcZones();
  }

  /* ── Bootstrap ──────────────────────────────────────────── */
  function start() {
    resize();
    initParticles();
    running = true;
    frame();
  }

  document.addEventListener('DOMContentLoaded', start);

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    resize();
    initParticles();
    frame();
  }, { passive: true });
}());
