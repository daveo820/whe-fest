/* ============================================================
   WHE Fest — Homepage Hero Gold Confetti
   Canvas-based, plays once on load (~4 s), then fades out.
   4 lane zones: outer-left, inner-left, inner-right, outer-right.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const DURATION   = 4200;  // total ms
  const FADE_START = 3300;  // ms at which global fade begins
  const PER_LANE   = 30;    // particles per lane (4 lanes = 120 total)

  /* Lane definitions as fractions of canvas width.
     inner lanes mirror each other across centre. */
  const LANES = [
    { side: 'outer-left',  xMin: 0.00, xMax: 0.15 },
    { side: 'inner-left',  xMin: 0.19, xMax: 0.29 },
    { side: 'inner-right', xMin: 0.71, xMax: 0.81 },
    { side: 'outer-right', xMin: 0.85, xMax: 1.00 },
  ];

  const COLORS = ['#C6A75E', '#A8893E', '#D4BA78', '#E8D5A0', '#B8953A'];

  let startTime = null;
  let particles  = [];

  /* ---------- Canvas sizing ---------- */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  /* ---------- Particle factory ---------- */
  function makeParticle(lane) {
    const w    = canvas.width;
    const x    = (lane.xMin + Math.random() * (lane.xMax - lane.xMin)) * w;
    const type = Math.random() < 0.5 ? 'rect'
               : Math.random() < 0.5 ? 'circle' : 'diamond';
    const size = 5 + Math.random() * 9;
    return {
      x,
      y:    -(Math.random() * canvas.height * 0.6 + 10),
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   0.85 + Math.random() * 1.2,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.045,
      size,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.28 + Math.random() * 0.30,
      type,
      lane,
    };
  }

  function initParticles() {
    particles = [];
    LANES.forEach(lane => {
      for (let i = 0; i < PER_LANE; i++) particles.push(makeParticle(lane));
    });
  }

  /* ---------- Draw one particle ---------- */
  function drawParticle(p, alpha) {
    ctx.save();
    ctx.globalAlpha = p.opacity * alpha;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const s = p.size;
    if (p.type === 'rect') {
      ctx.fillRect(-s / 2, -s * 0.22, s, s * 0.44);
    } else if (p.type === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      ctx.fill();
    } else { /* diamond */
      ctx.beginPath();
      ctx.moveTo(0,  -s * 0.5);
      ctx.lineTo( s * 0.32, 0);
      ctx.lineTo(0,   s * 0.5);
      ctx.lineTo(-s * 0.32, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- Animation loop ---------- */
  function animate(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;

    if (elapsed > DURATION) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
      return;
    }

    const alpha = elapsed > FADE_START
      ? Math.max(0, 1 - (elapsed - FADE_START) / (DURATION - FADE_START))
      : 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;

      /* Recycle to top of same lane during active phase */
      if (p.y > canvas.height + 20 && elapsed < FADE_START) {
        Object.assign(p, makeParticle(p.lane));
        p.y = -(Math.random() * 30 + 10);
      }

      drawParticle(p, alpha);
    }

    requestAnimationFrame(animate);
  }

  /* ---------- Bootstrap ---------- */
  function start() {
    resize();
    initParticles();
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('resize', resize, { passive: true });
}());
