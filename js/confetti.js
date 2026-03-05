/* ============================================================
   WHE Fest — Hero Gold Confetti
   Two narrow columns: far-left and far-right margins only.
   Uses its own canvas (#confettiCanvas) separate from the
   hero-animation canvas to avoid any draw conflicts.
   Plays once on page load, lasts 4.2 s, fades the final 1.2 s.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const COLORS = ['#C6A75E', '#D4BA78', '#E8D5A0', '#B8A060', '#A8893E', '#F0E4B8'];

  const DURATION = 4200;   /* ms — total animation length */
  const FADE_AT  = 3000;   /* ms — fade-out begins        */

  let particles = [];
  let startTime = null;
  let animId    = null;
  let colW      = 80;      /* column width px — set in setup() */

  /* ── Sizing ─────────────────────────────────────────────── */
  function setup() {
    const dpr     = window.devicePixelRatio || 1;
    const cssW    = canvas.offsetWidth;
    const cssH    = canvas.offsetHeight;
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* CSS-pixel column width: 13 % of viewport, clamped 50–140 px.
       Stays narrow on mobile so it never covers the logo. */
    colW = Math.max(50, Math.min(140, cssW * 0.13));
  }

  /* Shorthand: CSS-pixel canvas dimensions */
  function cssW() { return canvas.offsetWidth; }
  function cssH() { return canvas.offsetHeight; }

  /* ── Particle factory ───────────────────────────────────── */
  function makeParticle(side) {
    const w       = cssW();
    const isLeft  = side === 'left';
    const xMin    = isLeft ? 0 : w - colW;
    const xMax    = isLeft ? colW : w;
    const isCirc  = Math.random() < 0.45;

    return {
      x:    xMin + Math.random() * (xMax - xMin),
      y:    -(Math.random() * 380),            /* stagger above canvas */
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   1.4 + Math.random() * 2.2,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() < 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.04),
      color:       COLORS[Math.floor(Math.random() * COLORS.length)],
      baseOpacity: 0.65 + Math.random() * 0.35,
      isCirc,
      r:  isCirc ? 2.5 + Math.random() * 2   : 0,
      w:  isCirc ? 0   : 5 + Math.random() * 5,
      h:  isCirc ? 0   : 2 + Math.random() * 2,
      xMin, xMax,
    };
  }

  function initParticles() {
    particles = [];
    const mobile  = cssW() < 768;
    const perSide = mobile ? 25 : 40;
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

    if (p.isCirc) {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      /* subtle metallic highlight */
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
      ctx.clearRect(0, 0, cssW(), cssH());
      return;   /* one-shot: stop */
    }

    const fade = elapsed < FADE_AT
      ? 1.0
      : 1.0 - (elapsed - FADE_AT) / (DURATION - FADE_AT);

    ctx.clearRect(0, 0, cssW(), cssH());

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y   += p.vy;
      p.x   += p.vx;
      p.rot += p.rotV;

      /* Soft column wall bounce */
      if (p.x < p.xMin) { p.x = p.xMin; p.vx = Math.abs(p.vx) * 0.6; }
      if (p.x > p.xMax) { p.x = p.xMax; p.vx = -Math.abs(p.vx) * 0.6; }

      drawPiece(p, fade);
    }

    animId = requestAnimationFrame(frame);
  }

  /* ── Start ──────────────────────────────────────────────── */
  function start() {
    setup();
    initParticles();
    startTime = null;
    animId    = requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', start);

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    /* One-shot — don't restart on resize */
  }, { passive: true });
}());
