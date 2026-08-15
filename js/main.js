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

  /* ---- home hero: rotating photo crossfade (progressive enhancement) ----
     The section's inline background is slide 1, so with JS off (or reduced
     motion) the hero is simply a static photo. Extra slides load after the
     page has finished loading so they never compete with the LCP. */
  var slidesMount = document.querySelector('.hero-slides');
  if (slidesMount && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('load', function () {
      var srcs = slidesMount.getAttribute('data-slides').split(',');
      if (srcs.length < 2) return;
      var layers = srcs.map(function (src) {
        var d = document.createElement('div');
        d.className = 'hero-slide';
        d.style.backgroundImage = 'url(' + src + ')';
        slidesMount.appendChild(d);
        return d;
      });
      var current = 0;
      layers[0].classList.add('on');
      setInterval(function () {
        layers[current].classList.remove('on');
        current = (current + 1) % layers.length;
        layers[current].classList.add('on');
      }, 5500);
    });
  }

  /* ---- Coraline form: inject the iframe only when it's actually needed ---- */
  var mounts = document.querySelectorAll('.coraline-form');
  if (mounts.length) {
    var embedJsLoaded = false;

    var loadForm = function (mount) {
      if (mount.dataset.loaded) return;
      mount.dataset.loaded = 'true';

      var formId = mount.dataset.formId;
      var height = parseInt(mount.dataset.formHeight, 10) || 900;

      var iframe = document.createElement('iframe');
      iframe.src = mount.dataset.iframeSrc;
      iframe.id = 'inline-' + formId;
      iframe.title = mount.dataset.formName || 'Contact form';
      iframe.style.cssText =
        'width:100%;border:none;border-radius:0;min-height:' + height + 'px';
      iframe.setAttribute('data-layout', "{'id':'INLINE'}");
      iframe.setAttribute('data-trigger-type', 'alwaysShow');
      iframe.setAttribute('data-trigger-value', '');
      iframe.setAttribute('data-activation-type', 'alwaysActivated');
      iframe.setAttribute('data-activation-value', '');
      iframe.setAttribute('data-deactivation-type', 'neverDeactivate');
      iframe.setAttribute('data-deactivation-value', '');
      iframe.setAttribute('data-form-name', mount.dataset.formName || '');
      iframe.setAttribute('data-height', String(height));
      iframe.setAttribute('data-layout-iframe-id', 'inline-' + formId);
      iframe.setAttribute('data-form-id', formId);

      mount.innerHTML = '';
      mount.appendChild(iframe);

      if (!embedJsLoaded) {
        embedJsLoaded = true;
        var s = document.createElement('script');
        s.src = mount.dataset.embedJs;
        s.defer = true;
        document.body.appendChild(s);
      }
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadForm(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '600px' });
      Array.prototype.forEach.call(mounts, function (m) { io.observe(m); });
    } else {
      Array.prototype.forEach.call(mounts, loadForm);
    }

    Array.prototype.forEach.call(mounts, function (m) {
      var btn = m.querySelector('.coraline-form__load-btn');
      if (btn) btn.addEventListener('click', function () { loadForm(m); });
    });
  }

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
