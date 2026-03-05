/* ============================================================
   WHE Fest — Hero Gold Confetti
   Two narrow columns: far-left and far-right margins only.
   Plays once on page open for 5 s, fades the final 1.5 s.
   Uses its own canvas (#confettiCanvas) — no conflict with
   the hero-animation (#heroCanvas).
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const COLORS = ['#C6A75E', '#D4BA78', '#E8D5A0', '#B8A060', '#A8893E', '#F0E4B8'];

  const DURATION = 5000;   /* ms total           */
  const FADE_AT  = 3500;   /* ms fade-out starts */

  let particles = [];
  let startTime = null;
  let animId    = null;
  let vW = 0, vH = 0;     /* CSS-pixel viewport dimensions */
  let colW = 90;           /* column width in CSS px        */

  /* ── Setup ──────────────────────────────────────────────── */
  function setup() {
    const dpr = window.devicePixelRatio || 1;
    vW = canvas.offsetWidth;
    vH = canvas.offsetHeight;
    if (!vW || !vH) return false;            /* not laid out yet */

    canvas.width  = Math.round(vW * dpr);
    canvas.height = Math.round(vH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* 14 % of viewport, clamped 60–150 px */
    colW = Math.max(60, Math.min(150, vW * 0.14));
    return true;
  }

  /* ── Particle factory ───────────────────────────────────── */
  function makeParticle(side) {
    const isLeft = side === 'left';
    const xMin   = isLeft ? 0      : vW - colW;
    const xMax   = isLeft ? colW   : vW;
    const isCirc = Math.random() < 0.45;

    return {
      x:    xMin + Math.random() * (xMax - xMin),
      y:    -(Math.random() * 420),          /* stagger entry above top */
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   1.5 + Math.random() * 2.5,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() < 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.05),
      color:       COLORS[Math.floor(Math.random() * COLORS.length)],
      baseOpacity: 0.7 + Math.random() * 0.30,
      isCirc,
      r:  isCirc ? 3 + Math.random() * 2.5 : 0,
      pw: isCirc ? 0 : 6 + Math.random() * 6,
      ph: isCirc ? 0 : 3 + Math.random() * 2,
      xMin, xMax,
    };
  }

  function initParticles() {
    particles = [];
    const perSide = vW < 768 ? 30 : 50;
    for (let i = 0; i < perSide; i++) {
      particles.push(makeParticle('left'));
      particles.push(makeParticle('right'));
    }
  }

  /* ── Draw ───────────────────────────────────────────────── */
  function drawPiece(p, fade) {
    ctx.save();
    ctx.globalAlpha = p.baseOpacity * fade;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if (p.isCirc) {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.pw / 2, -p.ph / 2, p.pw, p.ph);
      ctx.globalAlpha = p.baseOpacity * fade * 0.45;
      ctx.fillStyle   = '#FFF9EC';
      ctx.fillRect(-p.pw / 2, -p.ph / 2, p.pw, p.ph * 0.30);
    }

    ctx.restore();
  }

  /* ── Frame loop ─────────────────────────────────────────── */
  function frame(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;

    if (elapsed >= DURATION) {
      ctx.clearRect(0, 0, vW, vH);
      return;
    }

    const fade = elapsed < FADE_AT
      ? 1.0
      : 1.0 - (elapsed - FADE_AT) / (DURATION - FADE_AT);

    ctx.clearRect(0, 0, vW, vH);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y   += p.vy;
      p.x   += p.vx;
      p.rot += p.rotV;

      if (p.x < p.xMin) { p.x = p.xMin; p.vx =  Math.abs(p.vx) * 0.6; }
      if (p.x > p.xMax) { p.x = p.xMax; p.vx = -Math.abs(p.vx) * 0.6; }

      drawPiece(p, fade);
    }

    animId = requestAnimationFrame(frame);
  }

  /* ── Boot — use rAF so layout is guaranteed computed ────── */
  function boot() {
    if (!setup()) {
      /* Canvas not laid out yet — retry next frame */
      requestAnimationFrame(boot);
      return;
    }
    initParticles();
    startTime = null;
    animId    = requestAnimationFrame(frame);
  }

  /* window.load guarantees images & layout are computed */
  window.addEventListener('load', function () {
    requestAnimationFrame(boot);
  });

  /* Pause when tab is hidden, resume when visible */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else if (startTime !== null) {
      animId = requestAnimationFrame(frame);
    }
  });

}());
