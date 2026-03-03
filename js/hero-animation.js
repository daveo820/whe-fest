/**
 * WHE Fest — Hero Canvas Animation
 * Particle light field with gold shimmer rays
 */

(function () {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, rays, raf;
  const PARTICLE_COUNT = 80;
  const RAY_COUNT = 8;
  const GOLD = 'rgba(198, 167, 94,';
  const WHITE = 'rgba(248, 246, 242,';

  // ── Resize (HiDPI / Retina aware) ───────────────────────
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Particle class ───────────────────────────────────────
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.4 + 0.15;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.opacityDelta = (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
      this.xDrift = (Math.random() - 0.5) * 0.3;
      // Gold or white, weighted toward gold
      this.isGold = Math.random() < 0.65;
      this.color = this.isGold ? GOLD : WHITE;
    }

    update() {
      this.y -= this.speed;
      this.x += this.xDrift;
      this.opacity += this.opacityDelta;
      if (this.opacity > 0.75 || this.opacity < 0.05) {
        this.opacityDelta *= -1;
      }
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity.toFixed(2)})`;
      ctx.fill();
    }
  }

  // ── Light Ray class ──────────────────────────────────────
  class LightRay {
    constructor(index, total) {
      this.index = index;
      this.total = total;
      this.reset();
    }

    reset() {
      // Origin below the logo, near bottom of hero
      this.originX = W * 0.5;
      this.originY = H * 0.78;
      // Spread rays in a fan pointing upward
      const spread = Math.PI * 0.9;
      const baseAngle = Math.PI * 1.5; // pointing up
      this.angle = baseAngle - spread / 2 + (this.index / (this.total - 1)) * spread;
      this.length = Math.random() * H * 0.6 + H * 0.3;
      this.width = Math.random() * 60 + 20;
      this.opacity = Math.random() * 0.04 + 0.01;
      this.opacityTarget = Math.random() * 0.06 + 0.01;
      this.speed = Math.random() * 0.0003 + 0.0001;
    }

    update() {
      // Breathe opacity gently
      this.opacity += (this.opacityTarget - this.opacity) * 0.005;
      if (Math.abs(this.opacity - this.opacityTarget) < 0.001) {
        this.opacityTarget = Math.random() * 0.07 + 0.01;
      }
      // Slowly rotate angle
      this.angle += this.speed * (this.index % 2 === 0 ? 1 : -1);
    }

    draw() {
      const endX = this.originX + Math.cos(this.angle) * this.length;
      const endY = this.originY + Math.sin(this.angle) * this.length;

      ctx.save();
      ctx.translate(this.originX, this.originY);
      ctx.rotate(this.angle - Math.PI / 2);
      ctx.translate(-this.originX, -this.originY);

      ctx.beginPath();
      ctx.moveTo(this.originX, this.originY);
      ctx.lineTo(endX - this.width / 2, endY);
      ctx.lineTo(endX + this.width / 2, endY);
      ctx.closePath();

      // Gradient created inside save/restore to align with rotated coordinate space
      const grad = ctx.createLinearGradient(this.originX, this.originY, endX, endY);
      grad.addColorStop(0, `${GOLD}${this.opacity.toFixed(3)})`);
      grad.addColorStop(1, `${GOLD}0)`);

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Central Glow Pulse ───────────────────────────────────
  let glowPhase = 0;
  function drawCentralGlow() {
    glowPhase += 0.008;
    const pulse = Math.sin(glowPhase) * 0.5 + 0.5; // 0..1
    const radius = H * 0.35 + pulse * H * 0.05;
    const alpha = 0.04 + pulse * 0.03;

    const grad = ctx.createRadialGradient(
      W / 2, H * 0.78, 0,
      W / 2, H * 0.78, radius
    );
    grad.addColorStop(0, `rgba(255,255,255,${(alpha * 0.6).toFixed(3)})`);
    grad.addColorStop(0.3, `${GOLD}${alpha.toFixed(3)})`);
    grad.addColorStop(1, `${GOLD}0)`);

    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.78, radius * 1.4, radius, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    rays = Array.from({ length: RAY_COUNT }, (_, i) => new LightRay(i, RAY_COUNT));
  }

  // ── Loop ─────────────────────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Rays first (behind particles)
    rays.forEach(r => { r.update(); r.draw(); });

    // Central glow
    drawCentralGlow();

    // Particles
    particles.forEach(p => { p.update(); p.draw(); });

    raf = requestAnimationFrame(loop);
  }

  // ── Boot ─────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    resize();
    // Reposition rays on resize
    rays.forEach(r => {
      r.originX = W * 0.5;
      r.originY = H * 0.78;
    });
  });

  init();
  loop();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
})();
