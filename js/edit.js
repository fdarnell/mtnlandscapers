/**
 * Inline text editing for the site owner, driven from the Salt Services portal.
 *
 * Loaded ONLY when a signed edit token is present (see the bootstrap in the
 * page template), so a public pageload never carries a byte of this.
 *
 * What it can touch is decided at build time, not here: site_edits.py stamps
 * data-e keys on body copy inside <main> and nothing else, so navigation,
 * footer, phone numbers and schema are out of reach by construction. The
 * server re-checks everything this file sends.
 */
(function () {
  'use strict';

  var PORTAL = 'https://my.saltservicesusa.com';
  var API = PORTAL + '/api/portal/site-edit';
  var TOKEN_KEY = 'slt_edit';

  var token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return;

  var originals = {};   // key -> innerHTML as the page was served
  var dirty = {};       // key -> true while it differs from the original
  var active = null;
  var bar, countEl, statusEl;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function editables() { return document.querySelectorAll('main [data-e]'); }
  function pagePath() {
    var p = location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
    if (p.length > 1) p = p.replace(/\/$/, '');
    return p || '/';
  }
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function dirtyKeys() { return Object.keys(dirty); }

  // ---------------------------------------------------------------- styles
  var css = [
    '.slt-eb{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;',
    'gap:.75rem;align-items:center;flex-wrap:wrap;padding:.7rem 1rem;',
    'background:#180f2f;color:#fbfaf6;font:15px/1.4 system-ui,sans-serif;',
    'box-shadow:0 -2px 18px rgba(0,0,0,.35)}',
    '.slt-eb strong{font-weight:600}',
    '.slt-eb .slt-sp{margin-left:auto;display:flex;gap:.5rem;flex-wrap:wrap}',
    '.slt-eb button{font:inherit;cursor:pointer;border-radius:8px;padding:.45rem .9rem;',
    'border:1px solid rgba(251,250,246,.35);background:transparent;color:inherit}',
    '.slt-eb button:hover{background:rgba(251,250,246,.12)}',
    '.slt-eb button.slt-primary{background:#e9a13b;border-color:#e9a13b;color:#180f2f;font-weight:600}',
    '.slt-eb button.slt-primary:hover{background:#f0b055}',
    '.slt-eb button[disabled]{opacity:.5;cursor:default}',
    '.slt-eb .slt-status{font-size:14px;opacity:.85;flex-basis:100%}',
    'main [data-e]{outline:1px dashed rgba(105,73,193,.55);outline-offset:3px;',
    'cursor:text;transition:outline-color .15s,background-color .15s}',
    'main [data-e]:hover{outline-color:#e9a13b;background:rgba(233,161,59,.07)}',
    'main [data-e].slt-on{outline:2px solid #e9a13b;background:rgba(233,161,59,.1)}',
    'main [data-e].slt-changed{outline-color:#2e7d32}',
    '.slt-tip{position:fixed;right:1rem;bottom:4.5rem;z-index:2147483000;max-width:22rem;',
    'background:#fbfaf6;color:#241a3d;border-radius:12px;padding:.9rem 1rem;',
    'font:14px/1.5 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.28)}',
    '.slt-tip h4{margin:0 0 .4rem;font-size:14px}',
    '.slt-tip ul{margin:0;padding-left:1.1rem}.slt-tip li{margin:.2rem 0}',
    '.slt-tip .slt-warn{color:#8a4b00}',
    '.slt-tip button{margin-top:.6rem;font:inherit;border:0;background:none;',
    'text-decoration:underline;cursor:pointer;padding:0;color:#635a7d}',
    'body{padding-bottom:4.5rem!important}',
    '@media (prefers-reduced-motion:reduce){main [data-e]{transition:none}}'
  ].join('');

  // ------------------------------------------------------------------- bar
  function buildBar() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    bar = document.createElement('div');
    bar.className = 'slt-eb';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Website text editor');
    bar.innerHTML =
      '<strong>Editing your website</strong>' +
      '<span class="slt-hint">Click any paragraph or heading and type.</span>' +
      '<span class="slt-sp">' +
      '<button type="button" class="slt-tips">Writing tips</button>' +
      '<button type="button" class="slt-discard" disabled>Discard changes</button>' +
      '<button type="button" class="slt-done">Done</button>' +
      '<button type="button" class="slt-save slt-primary" disabled>Publish <span class="slt-n"></span></button>' +
      '</span>' +
      '<span class="slt-status" role="status" aria-live="polite"></span>';
    document.body.appendChild(bar);

    countEl = $('.slt-n', bar);
    statusEl = $('.slt-status', bar);
    $('.slt-save', bar).addEventListener('click', publish);
    $('.slt-discard', bar).addEventListener('click', discardAll);
    $('.slt-done', bar).addEventListener('click', finish);
    $('.slt-tips', bar).addEventListener('click', function () { showTips(); });
  }

  function refresh() {
    var n = dirtyKeys().length;
    countEl.textContent = n ? '(' + n + ')' : '';
    $('.slt-save', bar).disabled = n === 0;
    $('.slt-discard', bar).disabled = n === 0;
  }

  function say(msg, tone) {
    statusEl.textContent = msg || '';
    statusEl.style.color = tone === 'bad' ? '#ffb4a2' : tone === 'good' ? '#a8e6a3' : '';
  }

  // --------------------------------------------------------------- editing
  function wire(el) {
    var key = el.getAttribute('data-e');
    originals[key] = el.innerHTML;

    el.addEventListener('click', function (e) {
      // Let a real link inside the copy still be a link when not editing it.
      if (el.isContentEditable) return;
      e.preventDefault();
      focusEl(el);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { revert(el); el.blur(); }
      // Headings and paragraphs are single blocks — don't let Enter split them.
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); }
    });
    el.addEventListener('input', function () { mark(el); });
    el.addEventListener('blur', function () {
      el.removeAttribute('contenteditable');
      el.classList.remove('slt-on');
      if (active === el) active = null;
      mark(el);
    });
    el.addEventListener('paste', function (e) {
      // Paste from Word/Docs otherwise drags a payload of markup in.
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });
  }

  function focusEl(el) {
    if (active && active !== el) active.blur();
    active = el;
    el.setAttribute('contenteditable', 'plaintext-only');
    if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
    el.classList.add('slt-on');
    el.focus();
    say('');
  }

  function mark(el) {
    var key = el.getAttribute('data-e');
    if (norm(el.innerHTML) === norm(originals[key])) {
      delete dirty[key];
      el.classList.remove('slt-changed');
    } else {
      dirty[key] = true;
      el.classList.add('slt-changed');
    }
    refresh();
  }

  function revert(el) {
    var key = el.getAttribute('data-e');
    el.innerHTML = originals[key];
    mark(el);
  }

  function discardAll() {
    dirtyKeys().forEach(function (key) {
      var el = document.querySelector('main [data-e="' + key + '"]');
      if (el) revert(el);
    });
    say('Changes discarded.');
  }

  function finish() {
    if (dirtyKeys().length && !confirm('You have unpublished changes. Leave edit mode anyway?')) return;
    sessionStorage.removeItem(TOKEN_KEY);
    location.href = PORTAL + '/dashboard/';
  }

  // -------------------------------------------------------------- publish
  function publish() {
    var keys = dirtyKeys();
    if (!keys.length) return;
    var btn = $('.slt-save', bar);
    btn.disabled = true;
    say('Publishing…');

    var edits = keys.map(function (key) {
      var el = document.querySelector('main [data-e="' + key + '"]');
      return { key: key, html: el.innerHTML, origHtml: originals[key] };
    });

    // text/plain keeps this a "simple" cross-origin request, so the browser
    // sends no preflight. The portal has no OPTIONS handler on purpose: a
    // preflight carries no token, so it could not be answered for one client
    // without answering it for anyone. The body is still JSON.
    fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ action: 'save', token: token, path: pagePath(), edits: edits })
    }).then(function (r) {
      return r.json().then(function (body) { return { ok: r.ok, status: r.status, body: body }; });
    }).then(function (res) {
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          say('Your editing session expired. Open the editor again from your portal.', 'bad');
          return;
        }
        say((res.body && res.body.error) || 'Could not publish. Nothing was changed.', 'bad');
        btn.disabled = false;
        return;
      }
      // Published copy becomes the new baseline for this page view.
      edits.forEach(function (e) { originals[e.key] = e.html; delete dirty[e.key]; });
      document.querySelectorAll('main [data-e].slt-changed').forEach(function (el) {
        el.classList.remove('slt-changed');
      });
      refresh();
      say('Published. Your site updates in about a minute.', 'good');
      if (res.body && res.body.warnings && res.body.warnings.length) showTips(res.body.warnings);
    }).catch(function () {
      say('Could not reach the portal. Nothing was changed.', 'bad');
      btn.disabled = false;
    });
  }

  // ------------------------------------------------------------------ tips
  function showTips(warnings) {
    var old = $('.slt-tip');
    if (old) old.remove();
    var box = document.createElement('div');
    box.className = 'slt-tip';
    var html = '';
    if (warnings && warnings.length) {
      html += '<h4>Worth a look before you leave</h4><ul>' +
        warnings.map(function (w) {
          return '<li class="slt-warn">' + String(w).replace(/[&<>]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
          }) + '</li>';
        }).join('') + '</ul>';
    } else {
      html += '<h4>What makes this copy work</h4><ul>' +
        '<li>Name the street, subdivision or town.</li>' +
        '<li>Say what it actually costs, or the range.</li>' +
        '<li>Answer the first question customers ask you.</li>' +
        '<li>Use a real job you did as the example.</li>' +
        '<li>Write it the way you say it on the phone.</li>' +
        '</ul>';
    }
    box.innerHTML = html + '<button type="button">Close</button>';
    box.querySelector('button').addEventListener('click', function () { box.remove(); });
    document.body.appendChild(box);
  }

  // ------------------------------------------------------------------ boot
  function start() {
    var els = editables();
    if (!els.length) {
      console.warn('[slt-edit] no editable text on this page');
    }
    buildBar();
    els.forEach(wire);
    refresh();

    window.addEventListener('beforeunload', function (e) {
      if (!dirtyKeys().length) return;
      e.preventDefault();
      e.returnValue = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
