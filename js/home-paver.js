/* Home page only: the paver progress bar along the top of the window, and the
   3D stack of tumbled pavers that turns as the visitor scrolls.

   Nothing here loads from another server. three.js (0.160.0, self-hosted in
   /js/vendor/) is only fetched after the page has finished loading AND the 3D
   spot is within 200px of the screen, so on a first visit nothing 3D downloads
   until the visitor starts scrolling toward it, and it never competes with
   the hero photo.

   prefers-reduced-motion: the bar is drawn once, fully laid, and the 3D spot
   keeps its still photo; nothing moves. */

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Paver progress bar                                                  */
/* ------------------------------------------------------------------ */

// A dark tumbled blend: mostly charcoal and brown-grey with a little warm
// tan, weighted the way a pallet mixes. The 3D stack uses the same colours.
const BLEND = [
  ['#585654', 5], ['#454341', 4], ['#655a51', 3], ['#55514d', 3], ['#8a7660', 1.5],
];

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickBlend(rnd) {
  const total = BLEND.reduce((a, b) => a + b[1], 0);
  let r = rnd() * total;
  for (const [c, w] of BLEND) { if ((r -= w) <= 0) return c; }
  return BLEND[0][0];
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

function paverBar() {
  const host = document.querySelector('.pbar');
  if (!host) return;
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0, dpr = 1, bricks = [], sand = null;
  let laidTarget = 0;          // how many bricks the scroll position asks for
  let queueAt = 0;             // when the next brick in the queue may drop
  let raf = 0;

  const DROP = 260;            // ms for one brick to fall and settle
  const LIFT = 140;            // ms to lift one back out when scrolling up

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';

    // Two courses in running bond: 2:1 bricks, every other course offset by
    // half a brick, the edge brick of that course cut in half like on site.
    const course = H / 2, len = course * 2;
    const rnd = seeded(1873);
    const old = bricks;
    bricks = [];
    for (let row = 0; row < 2; row++) {
      let x = row ? -len / 2 : 0;
      while (x < W) {
        bricks.push({ x, y: row * course, w: len, h: course, row,
          c: pickBlend(rnd), j: 0.94 + rnd() * 0.12, tilt: (rnd() - 0.5) * 0.5,
          s: 0, t0: 0, dir: 0 });
        x += len;
      }
    }
    // Lay order follows a crew working along the strip: by the brick's
    // leading edge, top course first when two start together.
    bricks.sort((a, b) => (Math.max(a.x, 0) - Math.max(b.x, 0)) || (a.row - b.row));
    // keep what was already laid when the window is resized
    const keep = Math.min(old.filter((b) => b.s === 1).length, bricks.length);
    for (let i = 0; i < keep; i++) bricks[i].s = 1;

    // compacted sand bed, speckled
    sand = document.createElement('canvas');
    sand.width = canvas.width; sand.height = canvas.height;
    const sc = sand.getContext('2d');
    sc.fillStyle = '#cdb994'; sc.fillRect(0, 0, sand.width, sand.height);
    const sr = seeded(77);
    const dots = Math.round(sand.width * sand.height / 9);
    for (let i = 0; i < dots; i++) {
      const v = sr();
      sc.fillStyle = v < 0.5 ? 'rgba(120,98,66,.28)' : 'rgba(255,248,230,.35)';
      sc.fillRect(sr() * sand.width, sr() * sand.height, dpr * (0.6 + sr() * 0.8), dpr * (0.6 + sr() * 0.8));
    }
    sc.fillStyle = 'rgba(70,56,36,.35)';
    sc.fillRect(0, sand.height - dpr, sand.width, dpr);
  }

  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  }

  const easeOutBack = (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function drawBrick(b, k, lift) {
    const gap = Math.max(1, dpr) / dpr;               // 1 device-pixel sand joint
    const x = (b.x + gap / 2) * dpr, w = (b.w - gap) * dpr;
    const h = (b.h - gap) * dpr;
    const y = (b.y + gap / 2 - lift) * dpr;
    ctx.globalAlpha = k;
    ctx.fillStyle = shade(b.c, b.j);
    ctx.fillRect(x, y, w, h);
    // tumbled-edge light: lit top edge, shaded lower edge and right end
    const e = Math.max(1, Math.round(dpr * 0.75));
    ctx.fillStyle = 'rgba(255,246,228,.28)'; ctx.fillRect(x, y, w, e);
    ctx.fillStyle = 'rgba(40,28,18,.30)'; ctx.fillRect(x, y + h - e, w, e);
    ctx.fillStyle = 'rgba(40,28,18,.16)'; ctx.fillRect(x + w - e, y, e, h);
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    raf = 0;
    let busy = false;
    // hand out drops one at a time; a fast scroll shortens the spacing so the
    // crew keeps up instead of lagging seconds behind
    let pendingUp = 0, pendingDown = 0;
    for (let i = 0; i < bricks.length; i++) {
      const b = bricks[i];
      if (i < laidTarget && b.s === 0 && b.dir !== 1) pendingUp++;
      if (i >= laidTarget && b.s === 1 && b.dir !== -1) pendingDown++;
    }
    const spacing = Math.max(4, Math.min(38, 420 / Math.max(1, pendingUp + pendingDown)));
    for (let i = 0; i < bricks.length && now >= queueAt; i++) {
      const b = bricks[i];
      if (i < laidTarget && b.s === 0 && b.dir !== 1) { b.dir = 1; b.t0 = now; queueAt = now + spacing; }
    }
    for (let i = bricks.length - 1; i >= 0 && now >= queueAt; i--) {
      const b = bricks[i];
      if (i >= laidTarget && b.s === 1 && b.dir !== -1) { b.dir = -1; b.t0 = now; queueAt = now + spacing * 0.6; }
    }

    ctx.drawImage(sand, 0, 0);
    for (const b of bricks) {
      if (b.dir === 1) {
        const t = Math.min(1, (now - b.t0) / DROP);
        const lift = (1 - easeOutBack(t)) * b.h * 1.4;  // falls in, dips a hair, settles
        drawBrick(b, Math.min(1, t * 2.4), lift);
        if (t >= 1) { b.dir = 0; b.s = 1; } else busy = true;
      } else if (b.dir === -1) {
        const t = Math.min(1, (now - b.t0) / LIFT);
        drawBrick(b, 1 - t, t * b.h * 0.8);
        if (t >= 1) { b.dir = 0; b.s = 0; } else busy = true;
      } else if (b.s === 1) {
        drawBrick(b, 1, 0);
      }
    }
    if (busy || pendingUp || pendingDown) raf = requestAnimationFrame(frame);
  }

  function update() {
    laidTarget = Math.round(progress() * bricks.length);
    if (!raf) raf = requestAnimationFrame(frame);
  }

  layout();
  if (REDUCE) {
    // a still, fully laid strip; no motion at all
    bricks.forEach((b) => { b.s = 1; });
    ctx.drawImage(sand, 0, 0);
    bricks.forEach((b) => drawBrick(b, 1, 0));
    addEventListener('resize', () => { layout(); bricks.forEach((b) => { b.s = 1; }); ctx.drawImage(sand, 0, 0); bricks.forEach((b) => drawBrick(b, 1, 0)); });
    return;
  }
  // a page opened part-way down starts with its bricks already in place
  laidTarget = Math.round(progress() * bricks.length);
  for (let i = 0; i < laidTarget; i++) bricks[i].s = 1;
  update();
  addEventListener('scroll', update, { passive: true });
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); update(); }, 120); });
}

// after the first paint, so the bar never delays the hero (its sand strip is
// plain CSS until then)
requestAnimationFrame(() => requestAnimationFrame(paverBar));

/* ------------------------------------------------------------------ */
/* 3D paver stack                                                      */
/* ------------------------------------------------------------------ */

const spot = document.querySelector('.paver3d');
const STILL_ROT = -0.62;     // the pose in the still photo (radians)

function whenIdle(fn) {
  if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2500 });
  else setTimeout(fn, 300);
}

// The still render only downloads when it is about to be needed: for
// reduced motion when the spot nears the screen, otherwise at the same moment
// three.js starts loading (it covers the gap while the 3D arrives).
function showStill() {
  const im = spot && spot.querySelector('img.paver3d-still[data-src]');
  if (im && !im.getAttribute('src')) im.src = im.dataset.src;
}

if (spot && REDUCE) {
  const io = new IntersectionObserver((ents) => {
    if (ents.some((e) => e.isIntersecting)) { io.disconnect(); showStill(); }
  }, { rootMargin: '400px 0px' });
  io.observe(spot);
}

if (spot && !REDUCE) {
  const arm = () => whenIdle(() => {
    const io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) { io.disconnect(); showStill(); boot().catch(() => {}); }
    }, { rootMargin: '0px 0px 200px 0px' });   // only once it is about to scroll into view
    io.observe(spot);
  });
  if (document.readyState === 'complete') arm();
  else addEventListener('load', arm, { once: true });
}

// --- tiny value-noise for chipped edges ---------------------------------
function makeNoise(seed) {
  const rnd = seeded(seed);
  const P = new Uint8Array(512), V = new Float32Array(256);
  for (let i = 0; i < 256; i++) { P[i] = i; V[i] = rnd(); }
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [P[i], P[j]] = [P[j], P[i]]; }
  for (let i = 0; i < 256; i++) P[i + 256] = P[i];
  const f = (t) => t * t * (3 - 2 * t);
  const h = (x, y, z) => V[P[P[P[x & 255] + (y & 255)] + (z & 255)]];
  const n3 = (x, y, z) => {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    const u = f(x - X), v = f(y - Y), w = f(z - Z);
    const l = (a, b, t) => a + (b - a) * t;
    return l(l(l(h(X, Y, Z), h(X + 1, Y, Z), u), l(h(X, Y + 1, Z), h(X + 1, Y + 1, Z), u), v),
      l(l(h(X, Y, Z + 1), h(X + 1, Y, Z + 1), u), l(h(X, Y + 1, Z + 1), h(X + 1, Y + 1, Z + 1), u), v), w);
  };
  return (x, y, z) => n3(x, y, z) * 0.6 + n3(x * 2.3 + 17, y * 2.3, z * 2.3) * 0.28 + n3(x * 5.1, y * 5.1 + 9, z * 5.1) * 0.12;
}

async function boot() {
  const [T, { RoomEnvironment }] = await Promise.all([
    import('./vendor/three-0.160.0.module.min.js'),
    import('./vendor/RoomEnvironment-0.160.0.js'),
  ]);

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return; }            // no WebGL: the still photo stays
  spot.appendChild(canvas);

  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new T.PerspectiveCamera(22, 1, 0.1, 10);

  // light: warm late-afternoon sun from upper left, cool sky fill
  const sun = new T.DirectionalLight(0xffedd6, 3.6);
  sun.position.set(-0.55, 1.6, 0.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -0.42; sc.right = 0.42; sc.top = 0.42; sc.bottom = -0.42; sc.near = 0.4; sc.far = 3.4;
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.0025; sun.shadow.radius = 5; sun.shadow.blurSamples = 12;
  scene.add(sun);
  scene.add(new T.HemisphereLight(0xeef2f6, 0x8c7a62, 0.35));

  // --- textures (CC0 ambientCG Concrete040, recompressed; see img/paver3d/SOURCE.txt)
  const loader = new T.TextureLoader();
  const load = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));
  const [albedo, normal, orm] = await Promise.all([
    load(spot.dataset.albedo), load(spot.dataset.normal), load(spot.dataset.orm)]);
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  for (const t of [albedo, normal, orm]) { t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = aniso; }
  albedo.colorSpace = T.SRGBColorSpace;

  // --- one tumbled paver: subdivided box, edges rounded and chipped -------
  const TEX_M = 0.42;          // metres of surface one texture tile covers
  function paver(L, H, Wd, seed) {
    const g = new T.BoxGeometry(L, H, Wd, Math.round(L / 0.0045), Math.round(H / 0.0045), Math.round(Wd / 0.0045));
    const pos = g.attributes.position, nrm = g.attributes.normal, uv = g.attributes.uv;
    const noise = makeNoise(seed), rnd = seeded(seed * 7 + 3);
    const r = 0.0058;
    const bx = L / 2 - r, by = H / 2 - r, bz = Wd / 2 - r;
    const ou = rnd() * 4, ov = rnd() * 4;
    const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const p = new T.Vector3(), q = new T.Vector3(), d = new T.Vector3();
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i);
      const fx = nrm.getX(i), fy = nrm.getY(i), fz = nrm.getZ(i);
      // texture: planar per face, in real-world units so every face has the
      // same grain size, offset per paver so no two look stamped alike
      let u, v;
      if (Math.abs(fy) > 0.5) { u = p.x; v = p.z; } else if (Math.abs(fx) > 0.5) { u = p.z; v = p.y; } else { u = p.x; v = p.y; }
      uv.setXY(i, u / TEX_M + ou, v / TEX_M + ov);

      q.set(Math.max(-bx, Math.min(bx, p.x)), Math.max(-by, Math.min(by, p.y)), Math.max(-bz, Math.min(bz, p.z)));
      d.subVectors(p, q);
      const len = d.length();
      if (len < 1e-7) continue;
      d.divideScalar(len);
      // how "edge-like" this point is (near two faces at once)
      const ex = ss(bx - 0.012, L / 2, Math.abs(p.x)), ey = ss(by - 0.012, H / 2, Math.abs(p.y)), ez = ss(bz - 0.012, Wd / 2, Math.abs(p.z));
      const edge = Math.max(ex * ey, ex * ez, ey * ez);
      const n1 = noise(p.x * 55 + seed, p.y * 55, p.z * 55);
      const n2 = noise(p.x * 160, p.y * 160 + seed, p.z * 160);
      // tumbling knocks chips out of the arrises: occasional deep bites,
      // constant small crumble, a touch of unevenness everywhere
      const chip = Math.pow(Math.max(0, n1 - 0.3) / 0.7, 1.5) * 0.0095 + n2 * 0.0016;
      const rr = r * (0.7 + n1 * 0.8);
      p.copy(q).addScaledVector(d, rr - edge * chip);
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    g.computeVertexNormals();
    return g;
  }

  function material(hex) {
    const m = new T.MeshStandardMaterial({
      map: albedo, normalMap: normal, normalScale: new T.Vector2(1.7, 1.7),
      roughnessMap: orm, aoMap: orm, aoMapIntensity: 0.9,
      roughness: 1, metalness: 0, envMapIntensity: 0.38,
    });
    m.color.set(hex).multiplyScalar(1 / 0.6);  // the detail map averages ~0.6 linear
    return m;
  }

  // the same dark blend as the bar: charcoal, deep charcoal, brown-grey,
  // a little warm tan, dark brown-grey
  const mats = ['#585654', '#454341', '#655a51', '#8a7660', '#55514d'].map(material);
  // which colour each paver gets: one warm tan among ten, the rest dark
  const STACK_MATS = [0, 4, 1, 2, 4, 0, 2, 1];

  const group = new T.Group();
  scene.add(group);
  const L = 0.2, H = 0.06, Wd = 0.1, J = 0.0025;
  const rnd = seeded(4242);
  const jitter = (a) => (rnd() - 0.5) * 2 * a;
  let seed = 11;
  const pieces = [];
  const LAYERS = 4;
  for (let layer = 0; layer < LAYERS; layer++) {
    for (let k = 0; k < 2; k++) {
      const mesh = new T.Mesh(paver(L, H, Wd, seed++), mats[STACK_MATS[layer * 2 + k]]);
      const off = (k ? 1 : -1) * (Wd / 2 + J / 2);
      if (layer % 2 === 0) { mesh.position.set(jitter(0.003), 0, off + jitter(0.0015)); }
      else { mesh.rotation.y = Math.PI / 2; mesh.position.set(off + jitter(0.0015), 0, jitter(0.003)); }
      mesh.position.y = H / 2 + layer * (H + 0.0004);
      mesh.rotation.y += jitter(0.022);
      pieces.push(mesh);
    }
  }
  // two loose ones on the ground, the way a pallet gets picked from
  const loose = [
    { x: 0.205, z: 0.085, ry: 0.42, m: 3 },
    { x: -0.06, z: 0.205, ry: -0.18, m: 2 },
  ];
  for (const l of loose) {
    const mesh = new T.Mesh(paver(L, H, Wd, seed++), mats[l.m]);
    mesh.position.set(l.x, H / 2, l.z); mesh.rotation.y = l.ry;
    pieces.push(mesh);
  }
  for (const m of pieces) { m.castShadow = true; m.receiveShadow = true; group.add(m); }

  // centre the composition on the stack, slightly toward the loose pavers
  const pivot = new T.Vector3(0.05, 0, 0.06);
  group.children.forEach((c) => c.position.sub(pivot));

  // ground: shadow catcher + soft contact darkening under each grounded paver
  const ground = new T.Mesh(new T.PlaneGeometry(4, 4), new T.ShadowMaterial({ color: 0x2b2418, opacity: 0.24 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);

  // soft rounded-box falloff, computed per pixel (no canvas filters: Safari)
  const blobTex = (() => {
    const N = 128, c = document.createElement('canvas'); c.width = c.height = N;
    const x = c.getContext('2d'), img = x.createImageData(N, N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const dx = Math.max(0, Math.abs(i + 0.5 - N / 2) - N * 0.2), dy = Math.max(0, Math.abs(j + 0.5 - N / 2) - N * 0.2);
      const d = Math.hypot(dx, dy) / (N * 0.3);
      const a = Math.max(0, 1 - d); const v = Math.round(255 * a * a * (3 - 2 * a));
      const o = (j * N + i) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = v; img.data[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    return new T.CanvasTexture(c);
  })();
  const blobMat = new T.MeshBasicMaterial({ color: 0x1a1d16, alphaMap: blobTex, transparent: true, opacity: 0.5, depthWrite: false });
  for (const m of pieces) {
    if (m.position.y > H) continue;
    const b = new T.Mesh(new T.PlaneGeometry(L * 1.7, Wd * 2.0), blobMat);
    b.rotation.x = -Math.PI / 2; b.rotation.z = m.rotation.y;
    b.position.set(m.position.x, 0.0006, m.position.z);
    b.renderOrder = -1;
    group.add(b);
  }

  // --- sizing -------------------------------------------------------------
  let vw = 0, vh = 0;
  function resize() {
    const w = spot.clientWidth, h = spot.clientHeight;
    if (!w || !h || (w === vw && h === vh)) return;
    vw = w; vh = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole composition in frame whatever the box shape
    const fitH = 0.55, fitW = 0.62;
    const distH = fitH / 2 / Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    const distW = fitW / 2 / Math.tan(T.MathUtils.degToRad(camera.fov / 2)) / camera.aspect;
    dist = Math.max(distH, distW);
    camera.updateProjectionMatrix();
    kick();
  }
  let dist = 1.4;

  // --- scroll-linked turn -------------------------------------------------
  const track = spot.closest('section') || spot;
  function scrollTarget() {
    const r = track.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    return p;
  }
  let cur = { rot: STILL_ROT, el: 0.36 };
  let tgt = { rot: STILL_ROT, el: 0.36 };
  function setTarget() {
    const p = scrollTarget();
    tgt.rot = STILL_ROT + (p - 0.45) * Math.PI * 2 * 0.85;   // ~0.85 turn across the section
    tgt.el = 0.44 - p * 0.2;                                 // camera drops from 25 to 14 degrees
  }

  let raf = 0, last = 0, visible = true;
  function place() {
    camera.position.set(0, Math.sin(cur.el) * dist + 0.1, Math.cos(cur.el) * dist);
    camera.lookAt(0, 0.1, 0);
    group.rotation.y = cur.rot;
  }
  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    const k = 1 - Math.exp(-dt * 5.5);
    cur.rot += (tgt.rot - cur.rot) * k;
    cur.el += (tgt.el - cur.el) * k;
    place();
    renderer.render(scene, camera);
    if (Math.abs(tgt.rot - cur.rot) > 0.0004 || Math.abs(tgt.el - cur.el) > 0.0004) kick();
    else last = 0;
  }
  function kick() { if (!raf && visible) raf = requestAnimationFrame(tick); }

  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) { setTarget(); kick(); } }).observe(spot);
  addEventListener('scroll', () => { setTarget(); kick(); }, { passive: true });
  new ResizeObserver(resize).observe(spot);
  resize();
  setTarget();
  place();
  renderer.render(scene, camera);
  spot.classList.add('is-live');
  kick();

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); spot.classList.remove('is-live'); });

  // for screenshots / the still photo: ?p3dstill renders the rest pose
  window.__p3d = { ready: true };
  if (/[?&]p3dstill\b/.test(location.search)) {
    window.__p3d.still = () => {
      cur.rot = tgt.rot = STILL_ROT; cur.el = tgt.el = 0.36; place();
      renderer.render(scene, camera);
      return canvas.toDataURL('image/png');
    };
  }
}
