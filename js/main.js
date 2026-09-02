/* Mountain Landscapers — multi-platform ad click-ID capture.
   Google (gclid/wbraid/gbraid), Meta (fbclid), TikTok (ttclid), Microsoft (msclkid).

   The rules differ per field, on purpose:

   - Click IDs are LAST touch, stored per platform in their own slot. A new Google
     click overwrites the stored Google click and nothing else. This matches
     Google's _gcl_aw and Meta's _fbc: a click ID is a receipt for one specific
     auction, so uploading a stale one credits the wrong click and teaches Smart
     Bidding the wrong lesson.
   - A visit carrying NO click ID never clears a stored one. Ad click, leave,
     return via organic, convert — the ad still gets the credit it earned.
   - UTMs keep BOTH ends: first touch (what introduced them) and last touch (what
     closed them). Paid social is usually the first touch and search the last; if
     only last touch were kept, social would look like it produced nothing.

   MTN_ATTR_QS() exists because the Coraline form and calendar are iframes on
   another origin. Query params on this page do not cross that boundary, so
   without appending them to the iframe src no platform can ever match a lead
   back to the click that paid for it. */
(function () {
  'use strict';

  var CLICK_IDS = ['gclid', 'wbraid', 'gbraid', 'fbclid', 'ttclid', 'msclkid'];
  /* No real click ID approaches this. The cap exists because exceeding the
     4096-byte cookie limit makes the browser drop ml_attr entirely, which
     would discard every stored id rather than just the oversized one. */
  var MAX_LEN = 256;
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var COOKIE = 'ml_attr';
  var DAYS = 90;
  var VERSION = 1;

  function readCookie(name) {
    try {
      var m = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[2]) : '';
    } catch (e) { return ''; }
  }

  function writeCookie(name, value) {
    try {
      var d = new Date();
      d.setTime(d.getTime() + DAYS * 864e5);
      var domain = '';
      if (/(^|\.)mtnlandscapers\.com$/.test(location.hostname)) {
        domain = '; domain=.mtnlandscapers.com';
      }
      document.cookie = name + '=' + encodeURIComponent(value) +
        '; expires=' + d.toUTCString() + '; path=/' + domain +
        '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) { /* cookies blocked: attribution degrades, the page must not */ }
  }

  function parse(raw) {
    try {
      var o = JSON.parse(raw);
      if (o && typeof o === 'object' && o.v === VERSION) return o;
    } catch (e) {}
    return null;
  }

  var now = Date.now();
  var attr = parse(readCookie(COOKIE)) || { v: VERSION, ids: {}, first: null, last: null };
  if (!attr.ids || typeof attr.ids !== 'object') attr.ids = {};

  var qs = null;
  try { qs = new URLSearchParams(location.search); } catch (e) { qs = null; }

  var changed = false;
  var i;

  if (qs) {
    for (i = 0; i < CLICK_IDS.length; i++) {
      var ck = CLICK_IDS[i];
      var cv = qs.get(ck);
      if (cv) { attr.ids[ck] = { v: cv.slice(0, MAX_LEN), t: now }; changed = true; }
    }

    var utm = {};
    var hasUtm = false;
    for (i = 0; i < UTMS.length; i++) {
      var uv = qs.get(UTMS[i]);
      if (uv) { utm[UTMS[i]] = uv.slice(0, MAX_LEN); hasUtm = true; }
    }
    if (hasUtm) {
      utm.t = now;
      attr.last = utm;
      if (!attr.first) attr.first = utm;
      changed = true;
    }
  }

  if (changed) writeCookie(COOKIE, JSON.stringify(attr));

  window.MTN_ATTR = attr;

  /* Meta's Conversions API wants fbc formatted as fb.1.<timestamp>.<fbclid>,
     never the raw id. Storing the capture time is what makes this possible. */
  window.MTN_ATTR_FBC = function () {
    var f = attr.ids.fbclid;
    return f ? 'fb.1.' + f.t + '.' + f.v : '';
  };

  /* `extra` carries page-level context the CRM cannot otherwise see: the form is
     an iframe on another origin, so it has no idea which page it is sitting on.
     Passing the service here is what lets a short form on a service page drop the
     "which service?" checkboxes without losing the answer. */
  window.MTN_ATTR_QS = function (baseUrl, extra) {
    var out = [];
    function add(k, v) {
      if (v) out.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
    var k;
    for (k in attr.ids) {
      if (Object.prototype.hasOwnProperty.call(attr.ids, k)) add(k, attr.ids[k].v);
    }
    /* Last-touch UTMs under their standard names, so the CRM's own attribution
       capture reads them unchanged. First touch under a prefix, for our fields. */
    var n;
    if (attr.last) { for (n = 0; n < UTMS.length; n++) add(UTMS[n], attr.last[UTMS[n]]); }
    if (attr.first) { for (n = 0; n < UTMS.length; n++) add('ft_' + UTMS[n], attr.first[UTMS[n]]); }
    if (extra) {
      for (k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) add(k, extra[k]);
      }
    }
    if (!out.length) return '';
    var sep = (baseUrl && baseUrl.indexOf('?') !== -1) ? '&' : '?';
    return sep + out.join('&');
  };
})();

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
      var _base = mount.dataset.iframeSrc;
      /* The parameter name is whatever the CRM form's hidden field listens on, so it
         travels in from config rather than being hard-coded here. */
      var _extra = null;
      if (mount.dataset.service) {
        _extra = {};
        _extra[mount.dataset.serviceKey || 'service'] = mount.dataset.service;
      }
      iframe.src = _base + (window.MTN_ATTR_QS ? window.MTN_ATTR_QS(_base, _extra) : '');
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
