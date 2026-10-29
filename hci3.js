(() => {
'use strict';

/* ================= EDIT ME ================= */
const PROFILE = {
  name: 'Prince P. Cardines',
  email: 'princecardines1@gmail.com',
  facebook: 'https://www.facebook.com/princecardines01',
  github: 'https://github.com/pr1nceee-git'
};
/* =========================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- bind profile ---------- */
$$('[data-name]').forEach(el => el.textContent = PROFILE.name);
$$('[data-email]').forEach(el => { el.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(PROFILE.email) + '&su=' + encodeURIComponent('Hi Prince!'); el.target = '_blank'; el.rel = 'noopener'; });
$$('[data-email-text]').forEach(el => el.textContent = PROFILE.email);
$$('[data-facebook]').forEach(el => el.href = PROFILE.facebook);
$$('[data-github]').forEach(el => el.href = PROFILE.github);
document.title = PROFILE.name + ' · Hoops, Hikes & Camping';
const TITLE = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? 'Come back! The summit is waiting ⛰️' : TITLE;
});

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- typing effect ---------- */
(() => {
  const roles = ['Basketball Lover', 'Trail Explorer', 'Camping Enthusiast', 'Adventure Seeker', 'Curious Traveller'];
  const el = $('#typed');
  let ri = 0, ci = 0, del = false;
  (function type() {
    const w = roles[ri];
    el.textContent = w.slice(0, ci);
    if (!del && ci < w.length) { ci++; setTimeout(type, 70); }
    else if (!del) { del = true; setTimeout(type, 1300); }
    else if (ci > 0) { ci--; setTimeout(type, 35); }
    else { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 250); }
  })();
})();

/* ---------- counters ---------- */
$$('[data-count]').forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1800, t0 = performance.now();
  (function tick(t) {
    const p = clamp((t - t0) / dur, 0, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
});

/* ---------- reveal on scroll + progress bar ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

const progressBar = $('#progressBar');
function onScroll() {
  const h = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- flip cards (touch / keyboard) ---------- */
$$('.flip').forEach(c => {
  c.addEventListener('click', () => c.classList.toggle('flipped'));
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('flipped'); }
  });
});

/* ---------- photo: fallback avatar + 3D tilt ---------- */
(() => {
  const photo = $('#photo');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a3a66"/><stop offset="1" stop-color="#e63946"/></linearGradient></defs>
  <rect width="400" height="500" fill="url(#g)"/>
  <path d="M40 500 Q60 360 200 350 Q340 360 360 500Z" fill="#141b33"/>
  <rect x="165" y="290" width="70" height="80" rx="20" fill="#c98f6c"/>
  <ellipse cx="200" cy="215" rx="88" ry="105" fill="#e0ac8b"/>
  <path d="M108 200 Q100 100 200 95 Q300 100 292 200 Q270 140 200 138 Q130 140 108 200Z" fill="#1a1a1f"/>
  <circle cx="168" cy="215" r="9" fill="#2b1b12"/><circle cx="232" cy="215" r="9" fill="#2b1b12"/>
  <path d="M160 268 Q200 300 240 268" fill="none" stroke="#7a2f2f" stroke-width="7" stroke-linecap="round"/>
  <text x="200" y="470" text-anchor="middle" font-family="Impact,sans-serif" font-size="34" fill="#fff" letter-spacing="3">ADD photo.jpg</text></svg>`;
  photo.addEventListener('error', () => { photo.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg); }, { once: true });
  if (photo.complete && !photo.naturalWidth) photo.dispatchEvent(new Event('error'));

  const card = $('#photoCard');
  card.addEventListener('pointermove', e => {
    if (reduceMotion) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
})();

/* ================= NEW FEATURES ================= */

/* ---------- confetti ---------- */
const confettiCv = document.createElement('canvas');
confettiCv.className = 'confetti';
confettiCv.setAttribute('aria-hidden', 'true');
document.body.appendChild(confettiCv);
let confettiToken = 0;
function confetti() {
  if (reduceMotion) return;
  const c = confettiCv, x = c.getContext('2d'), token = ++confettiToken;
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#e63946', '#ffffff', '#2f6fe0', '#f4c95d'];
  const ps = Array.from({ length: 150 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4,
    s: 5 + Math.random() * 7, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.3,
    col: cols[(Math.random() * cols.length) | 0]
  }));
  const t0 = performance.now();
  (function step(t) {
    if (token !== confettiToken) return;
    x.clearRect(0, 0, c.width, c.height);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.a += p.va;
      x.save(); x.translate(p.x, p.y); x.rotate(p.a);
      x.fillStyle = p.col; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      x.restore();
    }
    if (t - t0 < 4200) requestAnimationFrame(step);
    else x.clearRect(0, 0, c.width, c.height);
  })(t0);
}

/* ---------- theme toggle (dark / light) ---------- */
(() => {
  const btn = $('#themeBtn');
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    btn.textContent = t === 'light' ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', String(t === 'light'));
  }
  let cur = document.documentElement.getAttribute('data-theme') || 'dark';
  apply(cur);
  btn.addEventListener('click', () => {
    cur = cur === 'dark' ? 'light' : 'dark';
    apply(cur);
    try { localStorage.setItem('hc1-theme', cur); } catch (e) { /* storage unavailable */ }
  });
})();

/* ---------- welcome strip ---------- */
(() => {
  const w = $('#welcome');
  $('#welcomeClose').addEventListener('click', () => w.classList.add('hide'));
})();

/* ---------- 45-second countdown badge ---------- */
(() => {
  const box = $('#timer'), num = $('#timerText'), TOTAL = 45, t0 = performance.now();
  const iv = setInterval(() => {
    const left = Math.max(0, TOTAL - Math.floor((performance.now() - t0) / 1000));
    num.textContent = left;
    box.style.setProperty('--p', (left / TOTAL * 100) + '%');
    box.classList.toggle('low', left <= 10);
    if (left === 0) {
      clearInterval(iv);
      box.classList.add('done');
      box.textContent = '🎉 45s! Thank you!';
      confetti();
      toast('🎉 45 seconds! Thanks for staying, keep exploring!');
    }
  }, 250);
})();

/* ---------- secret: click the floating emojis on the first page ---------- */
$$('.float').forEach(btn => btn.addEventListener('click', () => {
  confetti();
  toast('🎉 You found a secret! Basketball, hiking, camping… that is me!');
}));

/* ---------- dress the hiker (hand-built 3D, drag clothes on and off) ---------- */
(() => {
  const cv = $('#dressCv'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const closet = $('#closet'), wornBox = $('#worn'), adviceEl = $('#dAdvice');
  const dFill = $('#dFill'), dCount = $('#dCount');

  const SLOTS = [
    { key: 'jacket', label: 'Windbreaker', icon: '🧥' }, { key: 'hat', label: 'Hat', icon: '🧢' },
    { key: 'shades', label: 'Shades', icon: '🕶️' }, { key: 'pants', label: 'Hiking pants', icon: '👖' },
    { key: 'shoes', label: 'Shoes', icon: '🥾' }, { key: 'bag', label: 'Bag', icon: '🎒' }
  ];
  const ITEMS = {
    jacket: [
      { id: 'orange', name: 'Orange', col: [238, 112, 40], acc: [255, 178, 72] },
      { id: 'blue', name: 'Blue', col: [42, 110, 214], acc: [110, 170, 245] },
      { id: 'green', name: 'Green', col: [38, 148, 92], acc: [120, 205, 150] }
    ],
    hat: [
      { id: 'bucket', name: 'Bucket hat', col: [201, 170, 120], acc: [120, 96, 60] },
      { id: 'cap', name: 'Red cap', col: [214, 52, 64], acc: [150, 30, 40] },
      { id: 'wide', name: 'Wide-brim', col: [158, 146, 92], acc: [70, 62, 40] }
    ],
    shades: [
      { id: 'black', name: 'Black', col: [28, 28, 34] },
      { id: 'amber', name: 'Amber', col: [226, 140, 38] },
      { id: 'mirror', name: 'Blue mirror', col: [64, 124, 224] }
    ],
    pants: [
      { id: 'khaki', name: 'Khaki', col: [180, 152, 100] },
      { id: 'olive', name: 'Olive', col: [94, 110, 64] },
      { id: 'black', name: 'Black', col: [46, 48, 58] }
    ],
    shoes: [
      { id: 'brown', name: 'Brown boots', col: [124, 78, 42], acc: [210, 170, 110], high: true },
      { id: 'grey', name: 'Trail runners', col: [150, 156, 170], acc: [230, 90, 60], high: false },
      { id: 'black', name: 'Black boots', col: [40, 42, 48], acc: [210, 60, 60], high: true }
    ],
    bag: [
      { id: 'red', name: 'Red backpack', col: [214, 60, 56], acc: [150, 36, 36], kind: 'pack' },
      { id: 'blue', name: 'Blue daypack', col: [46, 100, 200], acc: [30, 66, 140], kind: 'day' },
      { id: 'green', name: 'Green waist bag', col: [60, 150, 90], acc: [36, 100, 60], kind: 'waist' }
    ]
  };
  const NEED = { sunny: ['hat', 'shades', 'pants', 'shoes'], rainy: ['jacket', 'pants', 'shoes', 'bag'], windy: ['jacket', 'hat', 'pants', 'shoes'] };
  const WXN = { sunny: '☀️ sunny', rainy: '🌧️ rainy', windy: '🌬️ windy' };
  const worn = {}; SLOTS.forEach(s => { worn[s.key] = null; });
  let wx = 'sunny', lifted = null, dirty = true, scene = [], drawn = [];
  const shown = { sunny: false, rainy: false, windy: false };

  /* ================= tiny 3D geometry kit ================= */
  function quad(p0, p1, p2, p3, col, slot, dbl, hint) {
    const e1 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]], e2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
    let n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const l = Math.hypot(n[0], n[1], n[2]) || 1; n = [n[0] / l, n[1] / l, n[2] / l];
    if (hint && n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) n = [-n[0], -n[1], -n[2]];
    return { v: [...p0, ...p1, ...p2, ...p3], n, c: col, slot, dbl: !!dbl };
  }
  /* rings: [{y, rx, rz, cx, cz}] stacked into a tube; cols: one colour or one per gap */
  function tube(rings, cols, slot, o = {}) {
    const seg = o.seg || 14, a0 = o.a0 != null ? o.a0 : 0, a1 = o.a1 != null ? o.a1 : Math.PI * 2, out = [];
    const pt = (r, a) => [(r.cx || 0) + r.rx * Math.sin(a), r.y, (r.cz || 0) + r.rz * Math.cos(a)];
    const multi = typeof cols[0] !== 'number';
    for (let i = 0; i < rings.length - 1; i++) {
      const col = multi ? cols[Math.min(i, cols.length - 1)] : cols;
      const ax = ((rings[i].cx || 0) + (rings[i + 1].cx || 0)) / 2, az = ((rings[i].cz || 0) + (rings[i + 1].cz || 0)) / 2;
      for (let j = 0; j < seg; j++) {
        const A = a0 + (a1 - a0) * j / seg, B = a0 + (a1 - a0) * (j + 1) / seg;
        const p0 = pt(rings[i], A), p1 = pt(rings[i], B), p2 = pt(rings[i + 1], B), p3 = pt(rings[i + 1], A);
        const hint = o.dbl ? null : [(p0[0] + p2[0]) / 2 - ax, 0, (p0[2] + p2[2]) / 2 - az];
        out.push(quad(p0, p1, p2, p3, col, slot, o.dbl, hint));
      }
    }
    return out;
  }
  function ellipsoid(cx, cy, cz, rx, ry, rz, lat, seg, col, slot, o = {}) {
    const a = o.latMin != null ? o.latMin : -Math.PI / 2, b = o.latMax != null ? o.latMax : Math.PI / 2, rings = [];
    for (let k = 0; k <= lat; k++) {
      const ph = a + (b - a) * k / lat;
      rings.push({ y: cy + ry * Math.sin(ph), rx: rx * Math.cos(ph), rz: rz * Math.cos(ph), cx, cz });
    }
    return tube(rings, col, slot, { seg });
  }
  function box(cx, cy, cz, w, h, d, col, slot, sub = 1) {
    const hw = w / 2, hh = h / 2, hd = d / 2, out = [];
    const F = [
      [[-hw, -hh, hd], [2 * hw, 0, 0], [0, 2 * hh, 0], [0, 0, 1]], [[hw, -hh, -hd], [-2 * hw, 0, 0], [0, 2 * hh, 0], [0, 0, -1]],
      [[hw, -hh, hd], [0, 0, -2 * hd], [0, 2 * hh, 0], [1, 0, 0]], [[-hw, -hh, -hd], [0, 0, 2 * hd], [0, 2 * hh, 0], [-1, 0, 0]],
      [[-hw, hh, hd], [2 * hw, 0, 0], [0, 0, -2 * hd], [0, 1, 0]], [[-hw, -hh, -hd], [2 * hw, 0, 0], [0, 0, 2 * hd], [0, -1, 0]]
    ];
    for (const [o, u, v, n] of F) {
      const P = (i, j) => [cx + o[0] + u[0] * i / sub + v[0] * j / sub, cy + o[1] + u[1] * i / sub + v[1] * j / sub, cz + o[2] + u[2] * i / sub + v[2] * j / sub];
      for (let i = 0; i < sub; i++) for (let j = 0; j < sub; j++) {
        const q = quad(P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1), col, slot, false, n);
        q.n = n.slice(); out.push(q);
      }
    }
    return out;
  }

  /* ================= the mannequin ================= */
  const SK = [226, 172, 138], TEE = [232, 236, 244], SHORT = [72, 82, 110], SOCK = [244, 244, 244], HAIR = [38, 28, 24], DARK = [34, 36, 44];
  const ARM = [[2.46, 0.17], [2.1, 0.15], [1.75, 0.13], [1.4, 0.11]];
  const LEG = [[1.5, 0.24], [1.1, 0.2], [0.75, 0.16], [0.4, 0.13], [0.15, 0.1]];
  const armR = (sx, ex) => ARM.map(([y, r]) => ({ y, rx: r + ex, rz: r + ex, cx: sx * (0.62 + (2.46 - y) * 0.14), cz: 0 }));
  const legR = (sx, ex) => LEG.map(([y, r]) => ({ y, rx: r + ex, rz: r + ex, cx: sx * 0.2, cz: 0 }));
  function buildBody() {
    const q = [];
    q.push(...ellipsoid(0, 3.0, 0, 0.32, 0.38, 0.34, 10, 16, SK, 'body'));
    q.push(...ellipsoid(0, 3.04, -0.01, 0.34, 0.385, 0.355, 8, 16, HAIR, 'body', { latMin: 0.15 }));
    q.push(...ellipsoid(0, 2.98, -0.09, 0.33, 0.36, 0.3, 8, 16, HAIR, 'body', { latMin: -0.35 }));
    for (const sx of [-1, 1]) q.push(...ellipsoid(sx * 0.13, 3.04, 0.31, 0.04, 0.05, 0.03, 5, 8, [30, 22, 18], 'body'));
    q.push(...ellipsoid(0, 2.95, 0.34, 0.04, 0.06, 0.05, 5, 8, [208, 152, 118], 'body'));
    q.push(...ellipsoid(0, 2.84, 0.31, 0.08, 0.014, 0.02, 4, 8, [150, 70, 70], 'body'));
    q.push(...tube([{ y: 2.5, rx: 0.13, rz: 0.12 }, { y: 2.8, rx: 0.12, rz: 0.11 }], SK, 'body'));
    q.push(...tube([{ y: 1.5, rx: 0.44, rz: 0.27 }, { y: 1.75, rx: 0.42, rz: 0.25 }, { y: 2.1, rx: 0.5, rz: 0.27 }, { y: 2.42, rx: 0.58, rz: 0.28 }, { y: 2.56, rx: 0.22, rz: 0.17 }], TEE, 'body', { seg: 16 }));
    q.push(...tube([{ y: 1.62, rx: 0.44, rz: 0.27 }, { y: 1.3, rx: 0.46, rz: 0.28 }], SHORT, 'body', { seg: 16 }));
    for (const sx of [-1, 1]) {
      q.push(...tube(armR(sx, 0), [TEE, SK, SK], 'body', { seg: 12 }));
      q.push(...ellipsoid(sx * 0.78, 1.3, 0, 0.09, 0.12, 0.08, 5, 8, SK, 'body'));
      q.push(...tube(legR(sx, 0), [SHORT, SK, SK, SOCK], 'body', { seg: 12 }));
      q.push(...ellipsoid(sx * 0.2, 0.09, 0.1, 0.1, 0.08, 0.2, 5, 10, SOCK, 'body'));
    }
    return q;
  }
  const bodyQuads = buildBody();

  /* ================= clothes ================= */
  const BUILD = {
    jacket(v) {
      const q = [], m = v.col, a = v.acc;
      q.push(...tube([{ y: 1.4, rx: 0.48, rz: 0.31 }, { y: 1.8, rx: 0.5, rz: 0.32 }, { y: 2.12, rx: 0.57, rz: 0.33 }, { y: 2.44, rx: 0.65, rz: 0.33 }, { y: 2.6, rx: 0.27, rz: 0.2 }, { y: 2.78, rx: 0.21, rz: 0.17 }],
        [m, m, a, m, m], 'jacket', { seg: 16 }));
      for (const sx of [-1, 1]) {
        const r = armR(sx, 0.045); r.push({ y: 1.34, rx: 0.12, rz: 0.12, cx: sx * 0.77, cz: 0 });
        q.push(...tube(r, [m, m, DARK, DARK], 'jacket', { seg: 12 }));
      }
      q.push(...box(0, 1.92, 0.335, 0.035, 0.96, 0.02, DARK, 'jacket'));
      return q;
    },
    hat(v) {
      const q = [], c = v.col, b = v.acc;
      if (v.id === 'cap') {
        q.push(...ellipsoid(0, 3.12, 0, 0.37, 0.34, 0.39, 8, 16, c, 'hat', { latMin: 0 }));
        q.push(...box(0, 3.15, 0.52, 0.46, 0.03, 0.3, b, 'hat', 2));
        q.push(...ellipsoid(0, 3.46, 0, 0.04, 0.03, 0.04, 3, 6, b, 'hat'));
      } else {
        const wide = v.id === 'wide';
        q.push(...tube([{ y: 3.16, rx: 0.37, rz: 0.385 }, { y: 3.28, rx: 0.37, rz: 0.385 }, { y: 3.46, rx: 0.33, rz: 0.345 }, { y: 3.56, rx: 0.29, rz: 0.3 }, { y: 3.6, rx: 0.02, rz: 0.02 }], [b, c, c, c], 'hat', { seg: 16 }));
        q.push(...tube([{ y: 3.18, rx: 0.37, rz: 0.385 }, { y: 3.12, rx: wide ? 0.86 : 0.62, rz: wide ? 0.88 : 0.64 }], c, 'hat', { seg: 20, dbl: true }));
      }
      return q;
    },
    shades(v) {
      const q = [], L = v.col, F = [20, 20, 24];
      const band = (y0, y1, a0, a1, col) => tube([{ y: y0, rx: 0.345, rz: 0.358 }, { y: y1, rx: 0.345, rz: 0.358 }], col, 'shades', { seg: 6, a0, a1 });
      q.push(...band(2.99, 3.085, 0.14, 0.92, L), ...band(2.99, 3.085, -0.92, -0.14, L));
      q.push(...band(3.085, 3.11, -0.92, 0.92, F), ...band(2.98, 2.99, 0.14, 0.92, F), ...band(2.98, 2.99, -0.92, -0.14, F));
      q.push(...band(3.0, 3.1, -0.14, 0.14, F));
      for (const sx of [-1, 1]) q.push(...box(sx * 0.3, 3.05, 0.11, 0.018, 0.028, 0.3, F, 'shades'));
      return q;
    },
    pants(v) {
      const q = [], c = v.col;
      q.push(...tube([{ y: 1.68, rx: 0.455, rz: 0.285 }, { y: 1.6, rx: 0.455, rz: 0.285 }, { y: 1.3, rx: 0.48, rz: 0.3 }], [DARK, c], 'pants', { seg: 16 }));
      for (const sx of [-1, 1]) q.push(...tube(legR(sx, 0.03).slice(0, 5).map((r, i) => i === 0 ? { ...r, y: 1.55 } : r), c, 'pants', { seg: 12 }),
        ...tube([{ y: 0.34, rx: 0.16, rz: 0.16, cx: sx * 0.2 }, { y: 0.3, rx: 0.15, rz: 0.15, cx: sx * 0.2 }], DARK, 'pants', { seg: 12 }));
      return q;
    },
    shoes(v) {
      const q = [], c = v.col, a = v.acc, h = v.high ? 0.54 : 0.34;
      for (const sx of [-1, 1]) {
        q.push(...ellipsoid(sx * 0.2, 0.15, 0.1, 0.135, 0.13, 0.3, 6, 12, c, 'shoes'));
        q.push(...box(sx * 0.2, 0.04, 0.1, 0.3, 0.08, 0.66, DARK, 'shoes', 2));
        q.push(...tube([{ y: 0.14, rx: 0.145, rz: 0.15, cx: sx * 0.2 }, { y: h, rx: 0.155, rz: 0.165, cx: sx * 0.2 }], c, 'shoes', { seg: 12 }));
        q.push(...tube([{ y: h, rx: 0.16, rz: 0.17, cx: sx * 0.2 }, { y: h + 0.035, rx: 0.16, rz: 0.17, cx: sx * 0.2 }], a, 'shoes', { seg: 12 }));
        q.push(...box(sx * 0.2, 0.2, 0.34, 0.16, 0.05, 0.14, a, 'shoes'));
      }
      return q;
    },
    bag(v, env) {
      const q = [], c = v.col, b = v.acc, sz = env.jacket ? 0.355 : 0.295;
      if (v.kind === 'waist') {
        q.push(...tube([{ y: 1.46, rx: 0.5, rz: 0.325 }, { y: 1.55, rx: 0.5, rz: 0.325 }], DARK, 'bag', { seg: 16 }));
        q.push(...box(0, 1.5, 0.37, 0.44, 0.22, 0.14, c, 'bag', 2));
        q.push(...box(0, 1.5, 0.45, 0.14, 0.04, 0.03, b, 'bag'));
        return q;
      }
      const big = v.kind === 'pack', w = big ? 0.68 : 0.5, hgt = big ? 0.98 : 0.7, d = big ? 0.36 : 0.26, cy = big ? 2.0 : 1.95, cz = -(env.jacket ? 0.34 : 0.28) - d / 2;
      q.push(...box(0, cy, cz, w, hgt, d, c, 'bag', 3));
      q.push(...box(0, cy - hgt * 0.22, cz - d / 2 - 0.05, w * 0.7, hgt * 0.4, 0.1, b, 'bag', 2));
      q.push(...box(0, cy + hgt / 2 + 0.03, cz, w * 0.94, 0.08, d * 1.02, b, 'bag', 2));
      for (const sx of [-1, 1]) {
        q.push(...box(sx * 0.25, 2.2, sz, 0.07, 0.62, 0.035, DARK, 'bag', 2));
        q.push(...box(sx * 0.25, 2.53, sz / 2 + cz / 2 - 0.02, 0.07, 0.035, Math.abs(sz - cz) + 0.02, DARK, 'bag', 3));
      }
      if (big) q.push(...box(0, 1.9, sz, 0.5, 0.04, 0.035, DARK, 'bag'));
      return q;
    }
  };
  const cache = {};
  function mesh(slot, id) {
    const env = { jacket: !!worn.jacket };
    const key = slot + ':' + id + (slot === 'bag' ? (env.jacket ? ':j' : ':n') : '');
    if (!cache[key]) cache[key] = BUILD[slot](ITEMS[slot].find(v => v.id === id), env);
    return cache[key];
  }
  function rebuildScene() {
    scene = bodyQuads.slice();
    for (const s of SLOTS) if (worn[s.key] && lifted !== s.key) scene.push(...mesh(s.key, worn[s.key]));
    dirty = false;
  }

  /* ================= camera + rendering ================= */
  let W = 0, H = 0, S = 100, cx = 0, cy = 0, DPR = 1;
  const F = 9, PITCH = 0.12, cp = Math.cos(PITCH), sp = Math.sin(PITCH);
  let yaw = 0, yawT = 0, cs = 1, sn = 0, rx = 0, ry = 0, rz = 0, px = 0, py = 0, pk = 1;
  function R(x, y, z) { const x1 = x * cs + z * sn, z1 = -x * sn + z * cs; rx = x1; ry = y * cp - z1 * sp; rz = y * sp + z1 * cp; }
  function P() { pk = F / (F - rz); px = cx + rx * S * pk; py = cy - (ry - 1.7) * S * pk; }
  function resize() {
    const r = cv.getBoundingClientRect(); DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); S = H * 0.215; cx = W / 2; cy = H * 0.5;
  }
  new ResizeObserver(resize).observe(cv); resize();
  const LX = -0.4, LY = 0.55, LZ = 0.74;
  function render() {
    const items = [];
    for (const q of scene) {
      const v = q.v, pts = []; let d = 0;
      for (let k = 0; k < 4; k++) { R(v[k * 3], v[k * 3 + 1], v[k * 3 + 2]); P(); pts.push(px, py); d += rz; }
      R(q.n[0], q.n[1], q.n[2]);
      let nx = rx, ny = ry, nz = rz;
      if (nz <= 0) { if (!q.dbl) continue; nx = -nx; ny = -ny; nz = -nz; }
      const sh = 0.45 + 0.55 * Math.max(0, nx * LX + ny * LY + nz * LZ);
      items.push({ q, pts, d: d / 4, f: `rgb(${(q.c[0] * sh) | 0},${(q.c[1] * sh) | 0},${(q.c[2] * sh) | 0})` });
    }
    items.sort((a, b) => a.d - b.d);
    ctx.lineJoin = 'round'; ctx.lineWidth = 1;
    for (const it of items) {
      const p = it.pts; ctx.fillStyle = it.f; ctx.strokeStyle = it.f;
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[2], p[3]); ctx.lineTo(p[4], p[5]); ctx.lineTo(p[6], p[7]); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    drawn = items;
  }
  const side = (ax, ay, bx, by, x, y) => (bx - ax) * (y - ay) - (by - ay) * (x - ax);
  function inTri(x, y, ax, ay, bx, by, qx, qy) {
    const d1 = side(ax, ay, bx, by, x, y), d2 = side(bx, by, qx, qy, x, y), d3 = side(qx, qy, ax, ay, x, y);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }
  function hit(x, y) {
    for (let i = drawn.length - 1; i >= 0; i--) {
      const p = drawn[i].pts;
      if (inTri(x, y, p[0], p[1], p[2], p[3], p[4], p[5]) || inTri(x, y, p[0], p[1], p[4], p[5], p[6], p[7])) return drawn[i].q.slot;
    }
    return null;
  }

  /* ================= background by weather ================= */
  const SKYC = { sunny: ['#58aef0', '#e3f4ff'], rainy: ['#46556d', '#97a6ba'], windy: ['#7aa6c8', '#dbe8ef'] };
  const drops = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), v: 0.7 + Math.random() * 0.7 }));
  function drawBg(t, dt) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, SKYC[wx][0]); g.addColorStop(1, SKYC[wx][1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (wx === 'sunny') {
      const gl = ctx.createRadialGradient(W * 0.84, H * 0.15, 0, W * 0.84, H * 0.15, H * 0.3);
      gl.addColorStop(0, 'rgba(255,240,170,.85)'); gl.addColorStop(1, 'rgba(255,240,170,0)');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffe58a'; ctx.beginPath(); ctx.arc(W * 0.84, H * 0.15, H * 0.05, 0, 6.283); ctx.fill();
    } else {
      ctx.fillStyle = wx === 'rainy' ? 'rgba(70,82,104,.9)' : 'rgba(255,255,255,.85)';
      [[0.2, 0.14, 1], [0.55, 0.09, 1.3], [0.82, 0.18, 0.9]].forEach(([fx, fy, s]) => {
        const x = ((fx * W + t * (wx === 'windy' ? 40 : 8)) % (W + 160)) - 80, y = fy * H, r = H * 0.04 * s;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.arc(x + r * 1.2, y - r * 0.4, r * 1.2, 0, 6.283); ctx.arc(x + r * 2.4, y, r, 0, 6.283); ctx.fill();
      });
    }
    ctx.fillStyle = wx === 'rainy' ? '#3d6b52' : '#58a566';
    ctx.beginPath(); ctx.moveTo(0, H * 0.78); ctx.quadraticCurveTo(W * 0.3, H * 0.7, W * 0.55, H * 0.78); ctx.quadraticCurveTo(W * 0.8, H * 0.86, W, H * 0.76); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(cx, cy + 1.7 * S, S * 1.15, S * 0.22, 0, 0, 6.283); ctx.fill();
  }
  function drawFx(t, dt) {
    if (wx === 'rainy') {
      ctx.strokeStyle = 'rgba(210,225,245,.65)'; ctx.lineWidth = 1.3; ctx.beginPath();
      for (const d of drops) {
        d.y += d.v * dt * 1.1; d.x -= dt * 0.08; if (d.y > 1) { d.y = -0.05; d.x = Math.random(); } if (d.x < 0) d.x = 1;
        ctx.moveTo(d.x * W, d.y * H); ctx.lineTo(d.x * W - 4, d.y * H - 16);
      }
      ctx.stroke();
    } else if (wx === 'windy') {
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const y = H * (0.2 + i * 0.09), x = ((t * (140 + i * 25) + i * 120) % (W + 200)) - 100;
        ctx.moveTo(x, y); ctx.bezierCurveTo(x + 30, y - 10, x + 60, y + 10, x + 90, y);
      }
      ctx.stroke();
    }
  }

  /* ================= UI: closet, chips, advice ================= */
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const find = (slot, id) => ITEMS[slot].find(v => v.id === id);
  const rgbs = c => `rgb(${c[0]},${c[1]},${c[2]})`;
  SLOTS.forEach(s => {
    const row = el('div', 'cl-row'); row.append(el('div', 'cl-label', `${s.icon} ${s.label}`));
    const box_ = el('div', 'cl-items');
    ITEMS[s.key].forEach(v => {
      const b = el('button', 'cl-item'); b.type = 'button'; b.dataset.slot = s.key; b.dataset.id = v.id;
      const sw = el('span', 'sw'); sw.style.background = rgbs(v.col);
      b.append(sw, document.createTextNode(v.name));
      b.addEventListener('pointerdown', e => { if (e.button === 0 || e.pointerType !== 'mouse') beginDrag(s.key, v.id, 'closet', e); });
      box_.append(b);
    });
    row.append(box_); closet.append(row);
  });
  function equip(slot, id) { worn[slot] = id; changed(); }
  function removeSlot(slot) { worn[slot] = null; changed(); }
  function changed() { dirty = true; ui(); }
  function ui() {
    $$('.cl-item', closet).forEach(b => b.classList.toggle('on', worn[b.dataset.slot] === b.dataset.id));
    const n = SLOTS.filter(s => worn[s.key]).length;
    dFill.style.width = (n / SLOTS.length * 100) + '%'; dCount.textContent = n + '/' + SLOTS.length;
    wornBox.textContent = '';
    if (!n) wornBox.append(el('span', 'worn-empty', 'Nothing yet. Drag something onto the hiker!'));
    SLOTS.forEach(s => {
      if (!worn[s.key]) return;
      const v = find(s.key, worn[s.key]), chip = el('span', 'w-chip'), x = el('button', 'w-x', '✕');
      x.type = 'button'; x.setAttribute('aria-label', 'Take off ' + v.name); x.addEventListener('click', () => removeSlot(s.key));
      chip.append(document.createTextNode(`${s.icon} ${v.name}`), x); wornBox.append(chip);
    });
    const miss = NEED[wx].filter(k => !worn[k]);
    if (!miss.length) {
      adviceEl.textContent = `✅ Trail ready for a ${WXN[wx]} hike!` + (n === SLOTS.length ? ' 🏆 Fully geared up!' : '');
      adviceEl.classList.add('ok');
      if (!shown[wx]) { shown[wx] = true; confetti(); toast('🥾 Trail ready! Great outfit!'); }
    } else {
      shown[wx] = false; adviceEl.classList.remove('ok');
      adviceEl.textContent = `${WXN[wx]} hike: still need ` + miss.map(k => SLOTS.find(s => s.key === k).label.toLowerCase()).join(', ') + '.';
    }
  }
  $$('[data-wx]', $('.dress-card')).forEach(b => b.addEventListener('click', () => {
    $$('[data-wx]', $('.dress-card')).forEach(x => x.classList.remove('on')); b.classList.add('on'); wx = b.dataset.wx; ui();
  }));
  $('#dLeft').addEventListener('click', () => { yawT -= 0.6; idleAt = performance.now(); });
  $('#dRight').addEventListener('click', () => { yawT += 0.6; idleAt = performance.now(); });
  $('#dSpin').addEventListener('click', () => { yawT += Math.PI * 2; idleAt = performance.now(); });
  $('#dRandom').addEventListener('click', () => { SLOTS.forEach(s => { const a = ITEMS[s.key]; worn[s.key] = a[(Math.random() * a.length) | 0].id; }); changed(); });
  $('#dClear').addEventListener('click', () => { SLOTS.forEach(s => { worn[s.key] = null; }); changed(); });

  /* ================= dragging clothes on and off ================= */
  let drag = null, rot = null, idleAt = 0;
  const cvPos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; };
  function beginDrag(slot, id, from, e) {
    drag = { slot, id, from, started: false, sx: e.clientX, sy: e.clientY, ghost: null };
    addEventListener('pointermove', onMove); addEventListener('pointerup', onUp); addEventListener('pointercancel', onUp);
    e.preventDefault();
  }
  function onMove(e) {
    if (!drag) return;
    if (!drag.started && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) {
      drag.started = true;
      const v = find(drag.slot, drag.id), s = SLOTS.find(k => k.key === drag.slot);
      drag.ghost = el('div', 'ghost', `${s.icon} ${v.name}`); drag.ghost.style.borderColor = rgbs(v.col); document.body.append(drag.ghost);
      if (drag.from === 'worn') { lifted = drag.slot; dirty = true; }
      cv.classList.add('drop');
    }
    if (drag.started) { drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px'; }
  }
  function onUp(e) {
    removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp);
    const d = drag; drag = null; if (!d) return;
    cv.classList.remove('drop'); if (d.ghost) d.ghost.remove();
    const p = cvPos(e);
    if (!d.started) {                                             // a simple click toggles the item
      if (d.from === 'closet') { if (worn[d.slot] === d.id) removeSlot(d.slot); else equip(d.slot, d.id); }
      return;
    }
    if (d.from === 'closet') { if (p.inside) equip(d.slot, d.id); return; }
    lifted = null; dirty = true;
    const over = p.inside ? hit(p.x, p.y) : null;                  // released off the hiker = take it off
    if (over === null) { removeSlot(d.slot); toast('👋 Taken off!'); }
  }
  cv.addEventListener('pointerdown', e => {
    const p = cvPos(e), h = hit(p.x, p.y);
    if (h && h !== 'body' && worn[h]) { beginDrag(h, worn[h], 'worn', e); return; }
    rot = { x: e.clientX }; cv.setPointerCapture(e.pointerId); idleAt = performance.now(); cv.classList.add('grabbing');
  });
  cv.addEventListener('pointermove', e => {
    if (rot) { yawT += (e.clientX - rot.x) * 0.012; rot.x = e.clientX; idleAt = performance.now(); return; }
    if (drag) return;
    const p = cvPos(e), h = hit(p.x, p.y);
    cv.style.cursor = h && h !== 'body' ? 'grab' : 'ew-resize';
  });
  const endRot = () => { rot = null; cv.classList.remove('grabbing'); };
  cv.addEventListener('pointerup', endRot); cv.addEventListener('pointercancel', endRot);
  cv.addEventListener('dblclick', e => { const p = cvPos(e), h = hit(p.x, p.y); if (h && h !== 'body' && worn[h]) removeSlot(h); });
  cv.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') yawT -= 0.3; else if (e.key === 'ArrowRight') yawT += 0.3; else return;
    e.preventDefault(); idleAt = performance.now();
  });

  /* ================= loop ================= */
  let visible = true, last = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);
  function frame(t) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    if (!visible) return;
    if (dirty) rebuildScene();
    yaw += (yawT - yaw) * Math.min(1, dt * 9);
    const sway = (t - idleAt > 2500 && !rot && !drag && !reduceMotion) ? Math.sin(t / 1000 * 0.8) * 0.3 : 0;
    const a = yaw + sway; cs = Math.cos(a); sn = Math.sin(a);
    ctx.clearRect(0, 0, W, H);
    drawBg(t / 1000, dt); render(); drawFx(t / 1000, dt);
  }
  ui(); requestAnimationFrame(frame);
})();

/* ---------- traveller quiz ---------- */
(() => {
  const box = $('#quiz'); if (!box) return;
  const QS = [
    { q: 'Pick your perfect weekend:', a: [['Sunrise on a mountain trail', 'hiker'], ['Island hopping and beaches', 'beach'], ['A food crawl through a new city', 'city']] },
    { q: 'Your travel bag is mostly…', a: [['Boots, water and a headlamp', 'hiker'], ['Sunscreen, shades and a swimsuit', 'beach'], ['Camera, power bank and a map app', 'city']] },
    { q: 'The best souvenir is…', a: [['A summit photo or trail patch', 'hiker'], ['A seashell and a tan', 'beach'], ['Local snacks and postcards', 'city']] }
  ];
  const RES = {
    hiker: ['⛰️ Mountain Hiker', 'You chase summits and sunrises. Next stop: a trail with a view above the clouds.'],
    beach: ['🏝️ Beach Wanderer', 'You love salt air and slow days. Pack light, chase sunsets and say yes to island hopping.'],
    city: ['🏙️ City Explorer', 'You follow the food and the stories. Wander the streets and try everything once.']
  };
  let i = 0, score;
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  function render() {
    box.textContent = '';
    if (i >= QS.length) {
      const top = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
      box.append(el('div', 'q-step', 'Your result'), el('h4', 'q-res', RES[top][0]), el('p', 'q-text', RES[top][1]));
      const again = el('button', 'q-btn', '↻ Try again');
      again.addEventListener('click', start);
      box.append(again);
      confetti();
      return;
    }
    box.append(el('div', 'q-step', `Question ${i + 1} of ${QS.length}`), el('h4', 'q-q', QS[i].q));
    const bar = el('div', 'q-bar'); const fill = el('i'); fill.style.width = (i / QS.length * 100) + '%'; bar.append(fill); box.append(bar);
    QS[i].a.forEach(([label, key]) => {
      const b = el('button', 'q-btn', label);
      b.addEventListener('click', () => { score[key]++; i++; render(); });
      box.append(b);
    });
  }
  function start() { i = 0; score = { hiker: 0, beach: 0, city: 0 }; render(); }
  start();
})();

/* ---------- guess my fact ---------- */
(() => {
  const box = $('#guess'); if (!box) return;
  const btns = $$('.g-btn', box), out = $('#guessOut'), again = $('#guessAgain');
  let done = false;
  btns.forEach(b => b.addEventListener('click', () => {
    if (done) return; done = true;
    btns.forEach(x => x.classList.add(x.dataset.lie ? 'lie' : 'truth'));
    if (b.dataset.lie) { out.textContent = '🎯 Correct! That one is the lie.'; confetti(); }
    else out.textContent = '😅 Nope, that one is true! The lie is highlighted.';
    again.hidden = false;
  }));
  again.addEventListener('click', () => {
    done = false; out.textContent = 'Pick the one you think is the LIE.'; again.hidden = true;
    btns.forEach(x => x.classList.remove('lie', 'truth'));
  });
})();

/* ---------- mountain-climb scroll tracker ---------- */
(() => {
  const box = $('#climb'); if (!box) return;
  const trail = $('#climbTrail'), done = $('#climbDone'), hiker = $('#climbHiker'), bar = $('#climbBar'), minBtn = $('#climbMin');
  const setMin = m => { box.classList.toggle('min', m); minBtn.textContent = m ? '⛰️' : '–'; minBtn.setAttribute('aria-expanded', String(!m));
    minBtn.setAttribute('aria-label', m ? 'Show altitude tracker' : 'Minimize altitude tracker'); try { localStorage.setItem('hc1-climb-min', m ? '1' : '0'); } catch (e) {} };
  minBtn.addEventListener('click', () => setMin(!box.classList.contains('min')));
  try { if (localStorage.getItem('hc1-climb-min') === '1') setMin(true); } catch (e) {}
  const alt = $('#climbAlt'), lab = $('#climbLabel');
  const len = trail.getTotalLength();
  done.setAttribute('d', trail.getAttribute('d'));
  const MAX = 2954; // metres (a nod to Mt. Apo)
  const STAGES = [[0, '⛺ Base camp'], [12, '🥾 Trail head'], [30, '🌲 Forest trail'], [50, '🪨 Rocky ridge'],
                  [70, '☁️ Above the clouds'], [88, '❄️ Almost there'], [97, '🚩 Summit!']];
  let summited = false;
  function update() {
    const h = document.documentElement.scrollHeight - innerHeight;
    const p = h > 0 ? clamp(scrollY / h, 0, 1) : 0;
    const pt = trail.getPointAtLength(len * p);
    hiker.setAttribute('x', pt.x); hiker.setAttribute('y', pt.y + 4);
    done.style.strokeDasharray = (len * p) + ' ' + len;
    alt.textContent = Math.round(p * MAX).toLocaleString('en-US') + ' m';
    let st = STAGES[0][1];
    for (const [t, name] of STAGES) if (p * 100 >= t) st = name;
    lab.textContent = st;
    bar.style.width = (p * 100) + '%';
    box.classList.add('show');
    const ct = $('#contact'); // step aside while the contact buttons are on screen, so nothing is covered
    box.classList.toggle('away', !!ct && innerWidth < 1500 && ct.getBoundingClientRect().top < innerHeight * 0.85);
    if (p >= 0.97 && !summited) { summited = true; confetti(); toast('🚩 Summit reached! You scrolled the whole mountain!'); }
    if (p < 0.85) summited = false;
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();

/* ---------- basketball questions (trivia before hobbies) ---------- */
(() => {
  const box = $('#trivia'); if (!box) return;
  const QS = [
    { t: '🏀 Basketball', q: 'How many points is a shot from behind the three-point line worth?', a: ['2 points', '3 points', '4 points'], c: 1, why: 'Three points. That is why it is called a "three-pointer".' },
    { t: '🏀 Basketball', q: 'How high is a standard basketball rim?', a: ['8 feet', '10 feet', '12 feet'], c: 1, why: '10 feet (about 3.05 m) in the NBA and most competitive leagues.' },
    { t: '🏀 Basketball', q: 'How many players from one team are on the court at the same time?', a: ['4', '5', '6'], c: 1, why: 'Five per team, so ten players on the court in total.' },
    { t: '⛰️ Hiking', q: 'What should you do before starting a hike?', a: ['Check the weather and tell someone your route', 'Leave your water at home to travel light', 'Wear brand-new shoes for the first time'], c: 0, why: 'Weather can change fast, and someone should know where you are.' },
    { t: '⛰️ Hiking', q: 'What does "Leave No Trace" mean?', a: ['Take your trash with you and respect nature', 'Only hike at night', 'Mark trees with paint to find your way'], c: 0, why: 'Pack out what you pack in, and leave the trail as you found it.' },
    { t: '⛰️ Hiking', q: 'What is the highest mountain in the Philippines?', a: ['Mt. Pulag', 'Mt. Apo', 'Mt. Mayon'], c: 1, why: 'Mt. Apo in Mindanao stands at about 2,954 m.' },
    { t: '⛺ Camping', q: 'What should you do before leaving a campsite?', a: ['Make sure the fire is completely out', 'Leave a small fire for the next camper', 'Bury your trash in the ground'], c: 0, why: 'Always put the fire out completely and take your trash with you.' }
  ];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  let i = 0, score = 0;
  function shuffle(arr) { const a = arr.slice(); for (let k = a.length - 1; k > 0; k--) { const j = (Math.random() * (k + 1)) | 0; [a[k], a[j]] = [a[j], a[k]]; } return a; }
  function render() {
    box.textContent = '';
    if (i >= QS.length) {
      const msg = score === QS.length ? '🏆 Perfect! You are ready for the court AND the trail.'
        : score >= 4 ? '🔥 Great job! You know your hoops and your hikes.'
        : '😄 Nice try! Scroll down, my hobbies might teach you a thing or two.';
      box.append(el('div', 'q-step', 'Your score'), el('h4', 'q-res', `${score} / ${QS.length}`), el('p', 'q-text', msg));
      const row = el('div', 't-row');
      const again = el('button', 'q-btn', '↻ Try again');
      again.addEventListener('click', () => { i = 0; score = 0; render(); });
      const go = el('a', 'q-btn', 'See my hobbies ↓'); go.href = '#hobbies';
      row.append(again, go); box.append(row);
      if (score >= 4) confetti();
      return;
    }
    const Q = QS[i];
    box.append(el('div', 'q-step', `${Q.t} · Question ${i + 1} of ${QS.length}`), el('h4', 'q-q', Q.q));
    const bar = el('div', 'q-bar'); const fill = el('i'); fill.style.width = (i / QS.length * 100) + '%'; bar.append(fill); box.append(bar);
    const why = el('p', 't-why'); why.hidden = true;
    const opts = shuffle(Q.a.map((text, idx) => ({ text, ok: idx === Q.c })));
    const btns = [];
    opts.forEach(o => {
      const b = el('button', 'q-btn', o.text);
      b.addEventListener('click', () => {
        btns.forEach(x => { x.disabled = true; });
        btns.forEach((x, k) => { if (opts[k].ok) x.classList.add('right'); });
        if (o.ok) score++; else b.classList.add('wrong');
        why.textContent = (o.ok ? '✅ Correct! ' : '❌ Not quite. ') + Q.why; why.hidden = false;
        const next = el('button', 't-next', i === QS.length - 1 ? 'See my score →' : 'Next question →');
        next.addEventListener('click', () => { i++; render(); });
        box.append(next); next.focus({ preventScroll: true });
      });
      btns.push(b); box.append(b);
    });
    box.append(why);
  }
  render();
})();

/* ---------- basketball shooting game ---------- */
(() => {
  const cv = $('#court'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const hudS = $('#hScore'), hudK = $('#hStreak'), hudN = $('#hShots'), hudB = $('#hBest');
  let W = 0, H = 0, K = 1, G = 1100, R = 15, floorY = 0, maxPull = 100;
  const KV = 12;                                   // launch speed per pixel of pull-back
  const hoop = { x: 0, y: 0, r: 36 };
  const start = { x: 0, y: 0 };
  const ball = { x: 0, y: 0, vx: 0, vy: 0, a: 0, state: 'idle' };
  let score = 0, streak = 0, shots = 0, best = 0;
  let scored = false, touched = false, moveHoop = false;
  let tLaunch = 0, tScore = 0, floorT = 0, tDone = 0, netT = 0, visible = true, hover = false, floaters = [], clock = 0;
  try { best = parseInt(localStorage.getItem('hc1-hoops-best') || '0', 10) || 0; } catch (e) { /* storage unavailable */ }

  function hud() { hudS.textContent = score; hudK.textContent = streak; hudN.textContent = shots; hudB.textContent = best; }
  function placeHoop(random) {
    hoop.x = W * (random ? 0.64 + Math.random() * 0.18 : 0.78);
    hoop.y = H * (random ? 0.28 + Math.random() * 0.17 : 0.36);
  }
  function resetBall() {
    ball.x = start.x; ball.y = start.y; ball.vx = ball.vy = 0; ball.a = 0; ball.state = 'idle';
    if (moveHoop) { placeHoop(true); moveHoop = false; }
  }
  function layout() {
    K = clamp(W / 720, 0.55, 1.15);
    G = 1100 * K; R = 15 * K; maxPull = 100 * K; floorY = H - 48 * K;
    hoop.r = 36 * K;
    start.x = W * 0.2; start.y = floorY - R - 70 * K;
  }
  function resize() {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout(); placeHoop(false); resetBall();
  }
  new ResizeObserver(resize).observe(cv);
  resize(); hud();
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);

  /* ----- input: drag the ball back, release to shoot ----- */
  const ptr = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.addEventListener('pointerdown', e => {
    if (ball.state !== 'idle') return;
    const p = ptr(e);
    if (Math.hypot(p.x - ball.x, p.y - ball.y) > R * 3.2) return;
    ball.state = 'drag'; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; moveBall(p);
  });
  function moveBall(p) {
    let dx = p.x - start.x, dy = p.y - start.y;
    const d = Math.hypot(dx, dy);
    if (d > maxPull) { dx *= maxPull / d; dy *= maxPull / d; }
    ball.x = Math.max(R, start.x + dx);
    ball.y = Math.min(floorY - R, start.y + dy);
  }
  cv.addEventListener('pointermove', e => {
    const p = ptr(e);
    if (ball.state === 'drag') moveBall(p);
    else hover = ball.state === 'idle' && Math.hypot(p.x - ball.x, p.y - ball.y) <= R * 3.2;
    if (ball.state !== 'drag') cv.style.cursor = hover ? 'grab' : 'default';
  });
  function release() {
    if (ball.state !== 'drag') return;
    cv.style.cursor = hover ? 'grab' : 'default';
    const px = start.x - ball.x, py = start.y - ball.y;
    if (Math.hypot(px, py) < 12 * K) { resetBall(); return; }       // tiny pull = cancel
    ball.vx = px * KV; ball.vy = py * KV;
    ball.state = 'fly'; shots++; hud();
    scored = false; touched = false; tLaunch = 0; floorT = 0;
  }
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);
  cv.addEventListener('pointerleave', () => { hover = false; });
  $('#hReset').addEventListener('click', () => { score = streak = shots = 0; moveHoop = true; resetBall(); hud(); toast('🏀 Fresh game! Good luck!'); });

  function say(txt, col) { floaters.push({ t: 0, x: hoop.x, y: hoop.y - 70 * K, txt, col }); }

  /* ----- physics ----- */
  function physics(h) {
    const py = ball.y;
    ball.vy += G * h; ball.x += ball.vx * h; ball.y += ball.vy * h; ball.a += ball.vx * h / R;
    if (scored && ball.y < hoop.y + 70 * K) ball.vx *= 1 - 5 * h;      // net slows the ball
    /* walls */
    if (ball.x < R) { ball.x = R; ball.vx = Math.abs(ball.vx) * 0.6; }
    if (ball.x > W - R) { ball.x = W - R; ball.vx = -Math.abs(ball.vx) * 0.6; }
    /* backboard */
    const bx = hoop.x + hoop.r + 7 * K, top = hoop.y - 85 * K, bot = hoop.y + 14 * K;
    if (ball.vx > 0 && ball.x + R > bx && ball.x - R < bx + 8 * K && ball.y > top && ball.y < bot) {
      ball.x = bx - R; ball.vx = -ball.vx * 0.55; touched = true;
    }
    /* rim ends */
    for (const sx of [-1, 1]) {
      const cx = hoop.x + sx * hoop.r, cy = hoop.y, rr = R + 4 * K;
      const dx = ball.x - cx, dy = ball.y - cy, d = Math.hypot(dx, dy);
      if (d < rr && d > 0) {
        const nx = dx / d, ny = dy / d;
        ball.x = cx + nx * rr; ball.y = cy + ny * rr;
        const vn = ball.vx * nx + ball.vy * ny;
        if (vn < 0) { ball.vx -= 1.55 * vn * nx; ball.vy -= 1.55 * vn * ny; touched = true; }
      }
    }
    /* basket! (must pass downward through the rim line) */
    if (!scored && py < hoop.y && ball.y >= hoop.y && ball.vy > 0 && Math.abs(ball.x - hoop.x) < hoop.r - 2 * K) {
      scored = true; tScore = tLaunch; netT = 0.7;
      const pts = touched ? 2 : 3;
      score += pts; streak++;
      if (score > best) { best = score; try { localStorage.setItem('hc1-hoops-best', String(best)); } catch (e) { /* ignore */ } }
      say(touched ? `Nice! +${pts}` : `SWISH! +${pts}`, '#f4c95d');
      if (streak === 3) toast('🔥 3 in a row!');
      if (streak === 5) { toast('🔥🔥 5 in a row! On fire!'); confetti(); }
      hud();
    }
    /* floor */
    if (ball.y + R > floorY) {
      ball.y = floorY - R;
      if (ball.vy > 150 * K) ball.vy = -ball.vy * 0.55; else ball.vy = 0;
      ball.vx *= 1 - 2 * h;
      floorT += h * 0 + 0;
    }
  }
  function finishShot() {
    ball.state = 'done'; tDone = 0.55;
    if (scored) moveHoop = true;
    else { streak = 0; say('Miss', '#ff6b75'); hud(); }
  }
  function step(dt) {
    netT = Math.max(0, netT - dt);
    floaters = floaters.filter(f => (f.t += dt) < 1.2);
    if (ball.state === 'fly') {
      const n = 4, h = dt / n;
      for (let i = 0; i < n; i++) physics(h);
      tLaunch += dt;
      if (ball.y >= floorY - R - 0.5) floorT += dt;
      if (tLaunch > 5 || floorT > 1.0 || (scored && tLaunch - tScore > 1.3)) finishShot();
    } else if (ball.state === 'done') {
      tDone -= dt; if (tDone <= 0) resetBall();
    }
  }

  /* ----- drawing ----- */
  function drawCourt() {
    let g = ctx.createLinearGradient(0, 0, 0, floorY);
    g.addColorStop(0, '#171c36'); g.addColorStop(1, '#2b3560');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, floorY);
    g = ctx.createLinearGradient(0, floorY, 0, H);
    g.addColorStop(0, '#cf8d45'); g.addColorStop(1, '#8c5a2b');
    ctx.fillStyle = g; ctx.fillRect(0, floorY, W, H - floorY);
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < W; x += 44 * K) { ctx.moveTo(x, floorY); ctx.lineTo(x - 18 * K, H); }
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(0, floorY, W, 2.5 * K);
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    ctx.font = `800 ${16 * K}px Inter, system-ui, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(PROFILE.name.toUpperCase(), W * 0.5, floorY + (H - floorY) * 0.68);
  }
  function drawHoop() {
    const bx = hoop.x + hoop.r + 7 * K;
    ctx.strokeStyle = '#3a4268'; ctx.lineWidth = 7 * K; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx + 22 * K, hoop.y - 60 * K); ctx.lineTo(bx + 22 * K, floorY); ctx.stroke();
    ctx.lineWidth = 5 * K; ctx.beginPath(); ctx.moveTo(bx + 8 * K, hoop.y - 60 * K); ctx.lineTo(bx + 22 * K, hoop.y - 60 * K); ctx.stroke();
    ctx.fillStyle = '#f1f4fb'; ctx.fillRect(bx, hoop.y - 85 * K, 8 * K, 99 * K);
    ctx.fillStyle = '#e63946'; ctx.fillRect(bx, hoop.y - 85 * K, 8 * K, 8 * K);
    ctx.strokeStyle = '#ff6b2c'; ctx.lineWidth = 4 * K;
    ctx.beginPath(); ctx.moveTo(hoop.x + hoop.r, hoop.y); ctx.lineTo(bx, hoop.y); ctx.stroke();
    ctx.lineWidth = 5 * K; ctx.beginPath(); ctx.moveTo(hoop.x - hoop.r, hoop.y); ctx.lineTo(hoop.x + hoop.r, hoop.y); ctx.stroke();
  }
  function drawNet() {
    const amp = (netT / 0.7) * 7 * K * Math.sin((0.7 - netT) * 28);
    const top = [], bot = [];
    for (let i = 0; i <= 5; i++) {
      top.push([hoop.x - hoop.r + i * (2 * hoop.r / 5), hoop.y]);
      bot.push([hoop.x - hoop.r * 0.55 + i * (1.1 * hoop.r / 5) + amp, hoop.y + 44 * K]);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.4 * K; ctx.lineCap = 'butt';
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      ctx.moveTo(top[i][0], top[i][1]); ctx.lineTo(bot[i][0], bot[i][1]);
      if (i < 5) { ctx.moveTo(top[i][0], top[i][1]); ctx.lineTo(bot[i + 1][0], bot[i + 1][1]); ctx.moveTo(top[i + 1][0], top[i + 1][1]); ctx.lineTo(bot[i][0], bot[i][1]); }
    }
    ctx.stroke();
  }
  function drawStand() {
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath(); ctx.ellipse(start.x, floorY + 8 * K, 30 * K, 6 * K, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#4a5580'; ctx.lineWidth = 6 * K; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(start.x, start.y + R + 6 * K); ctx.lineTo(start.x, floorY + 4 * K); ctx.stroke();
    ctx.fillStyle = '#4a5580'; ctx.fillRect(start.x - 15 * K, start.y + R, 30 * K, 6 * K);
  }
  function drawAim() {
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3 * K; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x - 15 * K, start.y + R); ctx.lineTo(ball.x, ball.y);
    ctx.moveTo(start.x + 15 * K, start.y + R); ctx.lineTo(ball.x, ball.y);
    ctx.stroke();
    const vx = (start.x - ball.x) * KV, vy = (start.y - ball.y) * KV;   // short dotted preview of the shot
    for (let i = 1; i <= 10; i++) {
      const t = i * 0.05;
      const x = ball.x + vx * t, y = ball.y + vy * t + 0.5 * G * t * t;
      ctx.fillStyle = `rgba(244,201,93,${1 - i * 0.08})`;
      ctx.beginPath(); ctx.arc(x, y, (4 - i * 0.2) * K, 0, 6.283); ctx.fill();
    }
  }
  function drawBall() {
    ctx.save(); ctx.translate(ball.x, ball.y); ctx.rotate(ball.a);
    const g = ctx.createRadialGradient(-R * 0.35, -R * 0.35, R * 0.1, 0, 0, R);
    g.addColorStop(0, '#ffa857'); g.addColorStop(1, '#d9661c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 1.6 * K;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283);
    ctx.moveTo(-R, 0); ctx.lineTo(R, 0); ctx.moveTo(0, -R); ctx.lineTo(0, R);
    ctx.moveTo(-R * 0.72, -R * 0.7); ctx.quadraticCurveTo(-R * 0.1, 0, -R * 0.72, R * 0.7);
    ctx.moveTo(R * 0.72, -R * 0.7); ctx.quadraticCurveTo(R * 0.1, 0, R * 0.72, R * 0.7);
    ctx.stroke(); ctx.restore();
  }
  function drawText() {
    ctx.textAlign = 'center';
    for (const f of floaters) {
      ctx.globalAlpha = 1 - f.t / 1.2; ctx.fillStyle = f.col;
      ctx.font = `800 ${24 * K}px Inter, system-ui, sans-serif`;
      ctx.fillText(f.txt, f.x, f.y - f.t * 40 * K);
    }
    ctx.globalAlpha = 1;
    if (shots === 0 && ball.state !== 'fly') {
      ctx.fillStyle = '#f4c95d'; ctx.font = `800 ${15 * K + 2}px Inter, system-ui, sans-serif`;
      ctx.fillText('Drag the ball back, then release!', W * 0.5, 34 * K + Math.sin(clock * 3) * 4);
      ctx.strokeStyle = `rgba(244,201,93,${0.35 + 0.3 * Math.sin(clock * 4)})`; ctx.lineWidth = 3 * K;
      ctx.beginPath(); ctx.arc(start.x, start.y, R * 2 + Math.sin(clock * 4) * 3 * K, 0, 6.283); ctx.stroke();
    }
  }

  let last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t;
    if (!visible) return;
    clock += dt; step(dt);
    ctx.clearRect(0, 0, W, H);
    drawCourt(); drawStand(); drawHoop();
    if (ball.state === 'drag') drawAim();
    drawBall(); drawNet(); drawText();
  }
  requestAnimationFrame(frame);
})();

/* ---------- travelling and hiking photo slots (EDIT the names and captions!) ---------- */
(() => {
  const grid = $('#gallery'); if (!grid) return;
  /* Put your photos in the same folder, named place1.jpg ... place5.jpg */
  const PLACES = [
    { name: 'My Favorite Mountain', type: 'hike', file: 'place1.jpg', cap: 'Write where this is and what you remember about it.' },
    { name: 'Trail Adventure', type: 'hike', file: 'place2.jpg', cap: 'The trail with the best view so far.' },
    { name: 'Another Hike', type: 'hike', file: 'place3.jpg', cap: 'Another trail, another great view.' },
    { name: 'Travel Destination', type: 'travel', file: 'place4.jpg', cap: 'Lost in the green, found in Bantayan. 🌿' },
    { name: 'Best View So Far', type: 'travel', file: 'place5.jpg', cap: 'Kitanglad: where clouds meet the trail. ⛰️' }
  ];
  const ICON = { hike: ['⛰️', 'Hike'], camp: ['⛺', 'Camping'], travel: ['🚌', 'Travel'] };
  const COLS = { hike: ['#2f6fe0', '#1f5c4a'], camp: ['#f08a3c', '#6a3c8c'], travel: ['#e63946', '#3a2a7c'] };
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbClose = $('#lbClose');
  let opener = null;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = p => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLS[p.type][0]}"/><stop offset="1" stop-color="${COLS[p.type][1]}"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <path d="M0 300 L110 150 L170 220 L250 110 L400 300Z" fill="rgba(255,255,255,.14)"/>
    <text x="200" y="145" text-anchor="middle" font-size="64">${ICON[p.type][0]}</text>
    <text x="200" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="22" fill="#fff">Add photo: ${esc(p.file)}</text></svg>`);
  PLACES.forEach(p => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'g-card';
    const img = document.createElement('img'); img.alt = p.name; img.loading = 'lazy';
    const swap = () => { img.src = svg(p); };
    img.addEventListener('error', swap, { once: true });
    img.src = p.file;
    if (img.complete && !img.naturalWidth) swap();
    const tag = document.createElement('span'); tag.className = 'g-tag'; tag.textContent = ICON[p.type][0] + ' ' + ICON[p.type][1];
    const info = document.createElement('div'); info.className = 'g-info';
    const b = document.createElement('b'); b.textContent = p.name;
    const sm = document.createElement('small'); sm.textContent = p.cap;
    const media = document.createElement('div'); media.className = 'g-media';
    const bgi = document.createElement('img'); bgi.className = 'g-blur'; bgi.alt = ''; bgi.setAttribute('aria-hidden', 'true'); bgi.loading = 'lazy'; bgi.src = p.file;
    bgi.addEventListener('error', () => bgi.remove(), { once: true });
    media.append(bgi, img, tag);
    info.append(b, sm); card.append(media, info);
    card.addEventListener('click', () => {
      opener = card; lbImg.src = img.src; lbImg.alt = p.name; lbCap.textContent = p.name + ': ' + p.cap;
      lb.hidden = false; lbClose.focus();
    });
    grid.append(card);
  });
  function close() { lb.hidden = true; lbImg.removeAttribute('src'); if (opener) opener.focus(); }
  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
})();

})();
