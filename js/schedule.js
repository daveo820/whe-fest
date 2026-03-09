(function () {
  'use strict';
  var dayTabs = document.querySelectorAll('.day-tab');
  var day1    = document.getElementById('day1Schedule');
  var day2    = document.getElementById('day2Schedule');
  if (!dayTabs.length || !day1 || !day2) return;

  dayTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var day = tab.dataset.day;
      dayTabs.forEach(function (t) {
        t.classList.remove('day-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('day-tab--active');
      tab.setAttribute('aria-selected', 'true');
      if (day === '1') { day1.classList.remove('hidden'); day2.classList.add('hidden'); }
      else             { day2.classList.remove('hidden'); day1.classList.add('hidden'); }
      var panel = day === '1' ? day1 : day2;
      panel.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
        setTimeout(function () { el.classList.add('visible'); }, 80);
      });
    });

    tab.addEventListener('keydown', function (e) {
      var tabList = Array.from(dayTabs);
      var idx = tabList.indexOf(tab);
      if (e.key === 'ArrowRight' && idx < tabList.length - 1) {
        tabList[idx + 1].focus(); tabList[idx + 1].click();
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        tabList[idx - 1].focus(); tabList[idx - 1].click();
      }
    });
  });
}());
