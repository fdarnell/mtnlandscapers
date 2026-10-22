/* Home page only: three effects from the Salt Prompt Arsenal, adapted to this
   site (its fonts and colours, its own job photos, no outside servers, no
   custom cursor).

     36  Inertia drag carousel  -> "Work From Our Crews" (.reel)
     71  Timeline spine         -> "Here's What to Expect" (.steps-tl)
     63  Ticker tape bars       -> towns and services band (.ticker-band)

   Phones (from the arsenal's phone notes, learned on iPhone): a tap is a lifted
   finger that moved under 14px in under 600ms, deduped for 400ms; nothing grows
   under a finger; hints have their own touch wording. Desktop behaviour sits
   behind (hover: hover) / pointerType checks.

   prefers-reduced-motion: the band stands still, the timeline is fully lit,
   and the carousel only moves when it is dragged (no drift, skew or glide). */

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_HOVER = matchMedia('(hover: hover)').matches;

// run fn every frame only while el is on screen
function whileVisible(el, start, stop) {
  new IntersectionObserver((ents) => {
    for (const e of ents) (e.isIntersecting ? start : stop)();
  }, { rootMargin: '120px 0px' }).observe(el);
}

/* ------------------------------------------------------------------ */
/* 36 - Inertia drag carousel                                          */
/* ------------------------------------------------------------------ */
function reel() {
  const sec = document.querySelector('.reel');
  if (!sec) return;
  const vp = sec.querySelector('.reel-vp');
  const belt = sec.querySelector('.reel-belt');
  const bar = sec.querySelector('.reel-track i');
  let x = 0, vx = 0, max = 0, drift = 1, raf = 0, idleUntil = 0, visible = false;
  let dragging = false, pid = null, lastX = 0, downX = 0, downY = 0, downT = 0, moved = 0;
  let lastTap = 0, suppressClick = false;

  const measure = () => { max = Math.max(0, belt.scrollWidth - vp.clientWidth); };
  measure();
  addEventListener('resize', measure);
  // images arrive lazily and can change the belt width
  belt.querySelectorAll('img').forEach((im) => im.addEventListener('load', measure, { once: true }));

  const hold = (ms) => { idleUntil = performance.now() + ms; };

  vp.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; pid = e.pointerId;
    lastX = downX = e.clientX; downY = e.clientY; downT = performance.now(); moved = 0; vx = 0;
    suppressClick = false;
    hold(4000); kick();
  });
  vp.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - lastX;
    moved = Math.max(moved, Math.abs(e.clientX - downX));
    vx = -dx * 1.15;
    x += vx;
    lastX = e.clientX;
    if (moved > 6 && !suppressClick) {
      suppressClick = true;
      // capture only once it is really a drag, so a plain click still reaches the link
      if (e.pointerType === 'mouse') { try { vp.setPointerCapture(pid); } catch (err) { /* already released */ } }
    }
  });
  const end = (e) => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    hold(4000);
    // iPhone: a lifted finger is a tap (Safari may send no click)
    if (e.type === 'pointerup' && e.pointerType === 'touch') {
      const dt = performance.now() - downT;
      if (moved < 14 && Math.abs(e.clientY - downY) < 14 && dt < 600) {
        const a = e.target.closest && e.target.closest('a.reel-slide');
        const now = performance.now();
        if (a && now - lastTap > 400) { lastTap = now; suppressClick = true; location.href = a.href; }
      }
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);   // the page took the gesture for a vertical scroll
  belt.addEventListener('click', (e) => {
    if (suppressClick || performance.now() - lastTap < 400) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  belt.addEventListener('dragstart', (e) => e.preventDefault());

  // sideways trackpad swipes move it; ordinary vertical wheel scrolls the page
  vp.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { vx += e.deltaX * 0.35; e.preventDefault(); hold(4000); kick(); }
  }, { passive: false });

  // buttons and keyboard focus
  sec.querySelectorAll('.reel-btn').forEach((b) => b.addEventListener('click', () => {
    const step = (belt.firstElementChild?.offsetWidth || 300) + 26;
    if (REDUCE) x = Math.max(0, Math.min(max, x + +b.dataset.dir * step));
    else vx = +b.dataset.dir * step * 0.05;
    hold(5000); kick();
  }));
  belt.addEventListener('focusin', (e) => {
    const s = e.target.closest('.reel-slide');
    if (!s) return;
    vp.scrollLeft = 0;
    x = Math.max(0, Math.min(max, s.offsetLeft - 40)); vx = 0; hold(6000); kick();
  });

  function frame(now) {
    raf = 0;
    if (!dragging) {
      x += vx;
      vx *= REDUCE ? 0.6 : 0.95;                       // momentum decay
      if (!REDUCE && now > idleUntil) vx += 0.18 * drift; // idle drift keeps it alive
    }
    // rubber-band edges; the drift turns round at each end
    if (x < 0) { x += (0 - x) * 0.12; vx *= 0.7; drift = 1; }
    if (x > max) { x += (max - x) * 0.12; vx *= 0.7; drift = -1; }
    const skew = REDUCE ? 0 : Math.max(-6, Math.min(6, -vx * 0.12));
    belt.style.transform = `translateX(${-x}px) skewX(${skew}deg)`;
    if (bar) bar.style.transform = `translateX(${max ? (x / max) * 733 : 0}%)`;
    if (visible && (dragging || !REDUCE || Math.abs(vx) > 0.05 || x < 0 || x > max)) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && visible) raf = requestAnimationFrame(frame); }
  whileVisible(sec, () => { visible = true; measure(); kick(); }, () => { visible = false; });
}

/* ------------------------------------------------------------------ */
/* 71 - Timeline spine                                                 */
/* ------------------------------------------------------------------ */
function steps() {
  const sec = document.querySelector('.steps-tl');
  if (!sec) return;
  const list = sec.querySelector('ul');
  if (!list) return;
  const items = [...list.children].filter((li) => li.tagName === 'LI');
  list.classList.add('tl');

  // Pull the step number and its title forward without changing a word of
  // the copy: "1. Consultation and Site Evaluation Our process begins..."
  // The title is the run of capitalised words that ends where a sentence
  // starts (a capitalised word followed by a lower-case one). Skipped while
  // the client is editing in the portal so their saved HTML stays plain.
  let editing = false;
  try { editing = !!sessionStorage.getItem('slt_edit'); } catch (e) { /* storage blocked */ }
  if (!editing) {
    for (const li of items) {
      if (li.children.length) continue;               // only plain-text steps
      const t = li.textContent;
      const m = t.match(/^\s*(\d+\.)\s+/);
      if (!m) continue;
      const words = t.slice(m[0].length).split(/\s+/);
      const minor = /^(and|of|the|&|to|for|in)$/;
      let end = -1;
      for (let i = 0; i < words.length - 1; i++) {
        if (/^[A-Z]/.test(words[i]) && /^[a-z]/.test(words[i + 1]) && !minor.test(words[i + 1])) { end = i; break; }
      }
      if (end < 1) continue;
      const title = words.slice(0, end).join(' ');
      if (t.slice(m[0].length, m[0].length + title.length) !== title) continue;
      const rest = t.slice(m[0].length + title.length);
      li.textContent = '';
      const num = document.createElement('span'); num.className = 'tl-num'; num.textContent = m[1] + ' ';
      const st = document.createElement('strong'); st.className = 'tl-title'; st.textContent = title;
      li.append(num, st, document.createTextNode(rest));
    }
  }
  const spine = document.createElement('span');
  spine.className = 'tl-spine'; spine.setAttribute('aria-hidden', 'true');
  spine.innerHTML = '<i></i>';
  list.prepend(spine);
  items.forEach((li) => { const d = document.createElement('span'); d.className = 'tl-dot'; d.setAttribute('aria-hidden', 'true'); li.prepend(d); });
  const ink = spine.firstChild;

  if (REDUCE) { sec.classList.add('tl-still'); items.forEach((li) => li.classList.add('lit')); ink.style.transform = 'scaleY(1)'; return; }
  sec.classList.add('tl-live');
  let raf = 0;
  function update() {
    raf = 0;
    const r = list.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.7 - r.top) / r.height));
    ink.style.transform = `scaleY(${p})`;
    const inkY = r.top + r.height * p;
    for (const li of items) li.classList.toggle('lit', inkY > li.getBoundingClientRect().top + 30);
  }
  const req = () => { if (!raf) raf = requestAnimationFrame(update); };
  let on = false;
  const onScroll = () => on && req();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', req);
  whileVisible(sec, () => { on = true; req(); }, () => { on = false; req(); });
  update();
}

/* ------------------------------------------------------------------ */
/* 63 - Ticker tape bars                                               */
/* ------------------------------------------------------------------ */
function ticker() {
  const band = document.querySelector('.ticker-band');
  if (!band) return;
  const rows = [...band.querySelectorAll('.ticker')].map((t) => {
    const track = t.querySelector('.tk-track');
    const unit = track.innerHTML;
    // repeat the content until the track is over twice the screen width
    // (measured once, then written in one go: no layout thrash)
    const w = track.firstElementChild.getBoundingClientRect().width || 600;
    const copies = Math.min(30, Math.ceil((Math.max(innerWidth, 1600) * 2.2) / w));
    if (copies > 1) track.insertAdjacentHTML('beforeend', unit.repeat(copies - 1));
    const r = { el: track, x: 0, half: track.scrollWidth / 2, speed: +t.dataset.speed, dir: +t.dataset.dir, cur: +t.dataset.speed, hover: false };
    if (CAN_HOVER) {
      t.addEventListener('mouseenter', () => { r.hover = true; });
      t.addEventListener('mouseleave', () => { r.hover = false; });
    }
    return r;
  });
  if (REDUCE) return;                                  // a still band
  addEventListener('resize', () => rows.forEach((r) => { r.half = r.el.scrollWidth / 2; }));
  let raf = 0, last = 0, on = false;
  function tick(now) {
    raf = 0;
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    for (const r of rows) {
      const target = r.hover ? 0 : r.speed;
      r.cur += (target - r.cur) * 0.08;
      r.x = ((r.x + r.cur * r.dir * dt) % r.half + r.half) % r.half;
      r.el.style.transform = `translate3d(${-r.x}px,0,0)`;
    }
    if (on) raf = requestAnimationFrame(tick);
  }
  whileVisible(band, () => { on = true; last = 0; if (!raf) raf = requestAnimationFrame(tick); }, () => { on = false; });
}

// Nothing here runs before the first paint: each effect starts only when its
// section comes within ~800px of the screen (IntersectionObserver callbacks
// arrive after layout), so a phone on a slow connection paints the hero
// exactly as fast as before.
function whenNear(sel, fn) {
  const el = document.querySelector(sel);
  if (!el) return;
  const io = new IntersectionObserver((ents) => {
    if (ents.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: '800px 0px' });
  io.observe(el);
}
whenNear('.reel', reel);
whenNear('.steps-tl', steps);
whenNear('.ticker-band', ticker);
