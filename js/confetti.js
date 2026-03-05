/* ============================================================
   WHE Fest — Hero Gold Confetti
   Two narrow columns: far-left and far-right margins only.
   Plays once on page load, lasts 4 s, fades out the last 1 s.
   Canvas-based (GPU-accelerated, no DOM reflow).
   Respects prefers-reduced-motion.
   Hidden on viewports narrower than 600 px.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const COLORS = ['#C6A75E', '#D4BA78', '#E8D5A0', '#B8A060', '#A8893E', '#F0E4B8'];

  const DURATION   = 4200;  /* ms — total animation length          */
  const FADE_AT    = 3000;  /* ms — fade-out begins here            */

  let particles = [];
  let startTime = null;
  let animId    = null;
  let colW      = 120;     /* column width in px — set in resize() */

  /* ── Sizing ─────────────────────────────────────────────── */
  function setup() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    /* Column: 9 % of viewport, clamped 70–140 px */
    colW = Math.max(70, Math.min(140, canvas.width * 0.09));
  }

  /* ── Particle factory ───────────────────────────────────── */
  function makeParticle(side) {
    const isLeft   = side === 'left';
    const xMin     = isLeft ? 0 : canvas.width - colW;
    const xMax     = isLeft ? colW : canvas.width;
    const isCircle = Math.random() < 0.45;     /* 45 % circles, 55 % rects */

    return {
      x:    xMin + Math.random() * (xMax - xMin),
      /* stagger entry — spread particles 0 → 350 px above canvas */
      y:    -(Math.random() * 350),
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   1.5 + Math.random() * 2.0,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() < 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.04),
      color:       COLORS[Math.floor(Math.random() * COLORS.length)],
      baseOpacity: 0.65 + Math.random() * 0.35,
      isCircle,
      r:  isCircle ? 2.5 + Math.random() * 2   : 0,
      w:  isCircle ? 0   : 5 + Math.random() * 5,
      h:  isCircle ? 0   : 2 + Math.random() * 2,
      xMin, xMax,   /* column bounds for soft clamping */
    };
  }

  function initParticles() {
    particles = [];
    const mobile   = canvas.width < 768;
    const perSide  = mobile ? 22 : 40;

    for (let i = 0; i < perSide; i++) {
      particles.push(makeParticle('left'));
      particles.push(makeParticle('right'));
    }
  }

  /* ── Draw one piece ─────────────────────────────────────── */
  function drawPiece(p, fade) {
    ctx.save();
    ctx.globalAlpha = p.baseOpacity * fade;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if (p.isCircle) {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      /* subtle metallic highlight strip */
      ctx.globalAlpha = p.baseOpacity * fade * 0.45;
      ctx.fillStyle   = '#FFF9EC';
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.30);
    }

    ctx.restore();
  }

  /* ── Animation loop ─────────────────────────────────────── */
  function frame(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;

    if (elapsed >= DURATION) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;   /* one-shot: stop without scheduling next frame */
    }

    /* Global fade multiplier: 1.0 → 0 over the last second */
    const fade = elapsed < FADE_AT
      ? 1.0
      : 1.0 - (elapsed - FADE_AT) / (DURATION - FADE_AT);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y   += p.vy;
      p.x   += p.vx;
      p.rot += p.rotV;

      /* Soft horizontal clamp — bounce gently off column walls */
      if (p.x < p.xMin) { p.x = p.xMin; p.vx = Math.abs(p.vx) * 0.6; }
      if (p.x > p.xMax) { p.x = p.xMax; p.vx = -Math.abs(p.vx) * 0.6; }

      drawPiece(p, fade);
    }

    animId = requestAnimationFrame(frame);
  }

  /* ── Start ──────────────────────────────────────────────── */
  function start() {
    setup();
    if (canvas.width < 600) return;   /* skip on very narrow viewports */
    initParticles();
    startTime = null;
    animId    = requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', start);

  /* Resize only redraws dimensions — animation already ran or is running */
  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    /* Don't restart — one-shot animation plays on page open only */
  }, { passive: true });
}());
