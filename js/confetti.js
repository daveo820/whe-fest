/* ============================================================
   WHE Fest — Hero Gold Confetti (DOM-based)
   Creates absolutely-positioned div elements inside the hero
   section. CSS animations handle the fall + fade.
   No canvas dependency — guaranteed to render.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COLORS = ['#C6A75E', '#D4BA78', '#E8D5A0', '#B8A060', '#A8893E', '#F0E4B8'];
  var COUNT   = 80;   /* total pieces */

  /* Inject keyframe animation once */
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes whe-fall {',
    '  0%   { transform: translateY(0)      rotate(0deg);   opacity: 1;   }',
    '  85%  { opacity: 1; }',
    '  100% { transform: translateY(110vh)  rotate(540deg); opacity: 0;   }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  function launch() {
    /* Wrap — fixed, full-screen, above everything, pointer-safe */
    var wrap = document.createElement('div');
    wrap.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:99999',
      'overflow:hidden'
    ].join(';');
    document.body.appendChild(wrap);

    for (var i = 0; i < COUNT; i++) {
      (function () {
        var isCircle  = Math.random() < 0.45;
        var size      = 5 + Math.random() * 7;          /* px */
        var color     = COLORS[Math.floor(Math.random() * COLORS.length)];
        /* Full width across the top */
        var x = Math.random() * 100;
        var delay     = Math.random() * 1.5;             /* s   */
        var duration  = 3 + Math.random() * 2;           /* s   */

        var el = document.createElement('div');
        el.style.cssText = [
          'position:absolute',
          'left:'    + x    + '%',
          'top:-12px',
          'width:'   + size + 'px',
          'height:'  + (isCircle ? size : size * 0.45) + 'px',
          'background:' + color,
          'border-radius:' + (isCircle ? '50%' : '2px'),
          'opacity:1',
          'animation:whe-fall ' + duration + 's ease-in ' + delay + 's both'
        ].join(';');
        wrap.appendChild(el);
      }());
    }

    /* Remove from DOM after all animations finish (~5.5 s) */
    setTimeout(function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }, 5500);
  }

  /* Fire as soon as page is interactive */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', launch);
  } else {
    launch();
  }

}());
