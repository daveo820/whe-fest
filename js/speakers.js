(function () {
  'use strict';
  var trackBtns    = document.querySelectorAll('.track-btn');
  var speakerCards = document.querySelectorAll('.speaker-full-card');
  if (!trackBtns.length) return;

  trackBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var track = btn.dataset.track;
      trackBtns.forEach(function (b) {
        b.classList.remove('track-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('track-btn--active');
      btn.setAttribute('aria-pressed', 'true');
      speakerCards.forEach(function (card) {
        card.style.display = (track === 'all' || card.dataset.track === track) ? '' : 'none';
      });
    });
  });
}());
