(function () {
  'use strict';
  var dayTabs = document.querySelectorAll('.day-tab');
  var panels = [
    document.getElementById('day1Schedule'),
    document.getElementById('day2Schedule'),
    document.getElementById('day3Schedule')
  ].filter(Boolean);
  if (!dayTabs.length || !panels.length) return;

  dayTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var day = tab.dataset.day;
      dayTabs.forEach(function (t) {
        t.classList.remove('day-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('day-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Hide all panels, show selected
      panels.forEach(function (p) { p.classList.add('hidden'); });
      var activePanel = document.getElementById('day' + day + 'Schedule');
      if (activePanel) {
        activePanel.classList.remove('hidden');
        activePanel.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
          setTimeout(function () { el.classList.add('visible'); }, 80);
        });
      }
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
