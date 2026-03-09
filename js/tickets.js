(function () {
  'use strict';
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer = btn.nextElementSibling;
      var isOpen = !answer.classList.contains('hidden');
      document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.add('hidden'); });
      document.querySelectorAll('.faq-question').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      if (isOpen) return;
      answer.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
    });
  });
}());
