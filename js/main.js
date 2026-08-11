/* Mountain Landscapers — nav toggle + dropdowns. No dependencies. */
(function () {
  'use strict';

  var toggle = document.querySelector('.navtoggle');
  var nav = document.getElementById('mainnav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  var tops = document.querySelectorAll('.mainnav .navtop');
  Array.prototype.forEach.call(tops, function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var li = btn.parentNode;
      var wasOpen = li.classList.contains('open');
      Array.prototype.forEach.call(document.querySelectorAll('.mainnav li.open'), function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.navtop');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // hover-open the dropdowns on pointer devices
  if (window.matchMedia('(min-width: 901px)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.mainnav > ul > li'), function (li) {
      if (!li.querySelector('.submenu')) return;
      li.addEventListener('mouseenter', function () { li.classList.add('open'); });
      li.addEventListener('mouseleave', function () {
        li.classList.remove('open');
        var b = li.querySelector('.navtop');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.mainnav')) {
      Array.prototype.forEach.call(document.querySelectorAll('.mainnav li.open'), function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.navtop');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(document.querySelectorAll('.mainnav li.open'), function (o) {
      o.classList.remove('open');
    });
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    }
  });
})();
