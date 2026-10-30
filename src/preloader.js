import gsap from 'gsap';
import { personal } from './data.js';

/*
 * Q (3×4) × Kᵀ (4×8) = S (3×8)
 * The matrices are seeded with the numbers that matter to me. S is computed for real,
 * and the cells that spell my name are the ones that survive — then fly into the hero.
 */

const NR = 3, D = 4, NC = 8;
const NAME = [
  { r: 0, c0: 0, text: 'SIDDHANT' },
  { r: 2, c0: 1, text: 'PATIL' },
];

const $ = (id) => document.getElementById(id);
const pick = (arr, i) => arr[i % arr.length];

function buildMatrix(host, rows, cols, offset) {
  host.style.setProperty('--cols', cols);
  const cells = [];
  const vals = [];
  for (let r = 0; r < rows; r++) {
    cells.push([]);
    vals.push([]);
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c + offset + r * 3;
      const el = document.createElement('div');
      el.className = 'c';
      el.textContent = pick(personal.tokens, i);
      host.appendChild(el);
      cells[r].push(el);
      vals[r].push(pick(personal.values, i));
    }
  }
  return { cells, vals };
}

export async function runPreloader() {
  const pre = $('pre');
  const fly = $('fly');
  const skipBtn = $('preSkip');
  const status = $('preStatus');
  const bar = $('preBar');

  const finish = () => {
    document.body.classList.remove('is-loading');
    document.querySelectorAll('.hero__name .l').forEach((l) => (l.style.visibility = ''));
    fly.innerHTML = '';
    pre.remove();
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }

  await Promise.all([
    document.fonts.load('1em "Instrument Serif"'),
    document.fonts.load('1em "Geist Mono Variable"'),
  ]).catch(() => {});

  let skipped = false;
  let tl = null;
  skipBtn.addEventListener('click', () => {
    skipped = true;
    tl && tl.timeScale(4);
  });
  const sleep = (ms) => (skipped ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));
  const setBar = (p) => gsap.to(bar, { width: `${p * 100}%`, duration: 0.3, overwrite: true });

  const Q = buildMatrix($('matQ'), NR, D, 0);
  const K = buildMatrix($('matK'), D, NC, 5);
  const sHost = $('matS');
  sHost.style.setProperty('--cols', NC);
  const S = { cells: [], vals: [] };
  for (let r = 0; r < NR; r++) {
    S.cells.push([]);
    S.vals.push([]);
    for (let c = 0; c < NC; c++) {
      const el = document.createElement('div');
      el.className = 'c';
      el.textContent = '·';
      sHost.appendChild(el);
      S.cells[r].push(el);
      let s = 0;
      for (let k = 0; k < D; k++) s += Q.vals[r][k] * K.vals[k][c];
      S.vals[r].push(s / Math.sqrt(D));
    }
  }

  /* 1 ─ load Q and Kᵀ */
  gsap.to('#preFormula', { opacity: 1, duration: 0.8 });
  ['matQ', 'matK', 'matS'].forEach((id) => $(id).classList.add('on'));
  const stagger = (cells, base) =>
    cells.flat().forEach((el, i) => setTimeout(() => el.classList.add('in'), skipped ? 0 : base + i * 22));
  stagger(Q.cells, 150);
  stagger(K.cells, 450);
  stagger(S.cells, 900);
  gsap.to(['#opX', '#opEq'], { opacity: 1, duration: 0.6, delay: 0.7 });
  setBar(0.12);
  await sleep(1500);

  /* 2 ─ the multiply: every S cell is a row·column dot product */
  status.textContent = 'computing scores';
  const total = NR * NC;
  let n = 0;
  for (let r = 0; r < NR; r++) {
    for (let c = 0; c < NC; c++) {
      const hot = [...Q.cells[r], ...K.cells.map((row) => row[c])];
      hot.forEach((e) => e.classList.add('hot'));
      const out = S.cells[r][c];
      out.classList.add('hit');
      out.textContent = S.vals[r][c].toFixed(2);
      await sleep(Math.max(22, 230 * Math.pow(0.84, n)));
      hot.forEach((e) => e.classList.remove('hot'));
      out.classList.remove('hit');
      n++;
      if (n % 3 === 0) setBar(0.12 + (n / total) * 0.6);
    }
  }
  await sleep(300);

  /* 3 ─ most cells fade; the ones that spell the name resolve into letters */
  status.textContent = 'decoding';
  setBar(0.82);
  const nameCells = [];
  const isName = (r, c) => NAME.some((n) => n.r === r && c >= n.c0 && c < n.c0 + n.text.length);
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) if (!isName(r, c)) S.cells[r][c].classList.add('dim');
  gsap.to(['#matQ', '#matK', '#opX', '#opEq', '#preFormula'], { opacity: 0.12, duration: 0.7 });
  NAME.forEach(({ r, c0, text }) => {
    [...text].forEach((ch, i) => nameCells.push({ el: S.cells[r][c0 + i], ch }));
  });
  await Promise.all(
    nameCells.map(
      ({ el, ch }, i) =>
        new Promise((resolve) => {
          const start = skipped ? 0 : i * 70;
          setTimeout(() => {
            let ticks = skipped ? 0 : 7;
            const t = setInterval(() => {
              if (ticks-- > 0) {
                el.textContent = (Math.random() * 2 - 1).toFixed(2);
              } else {
                clearInterval(t);
                el.textContent = ch;
                el.classList.add('is-letter');
                resolve();
              }
            }, 45);
          }, start);
        }),
    ),
  );
  status.textContent = 'siddhant patil';
  setBar(1);
  await sleep(650);

  /* 4 ─ flight: each letter travels from its matrix cell to its place in the hero heading */
  const targets = [...document.querySelectorAll('.hero__name .l')];
  const fontSize = parseFloat(getComputedStyle(targets[0]).fontSize);
  const clones = nameCells.map(({ el, ch }, i) => {
    const from = el.getBoundingClientRect();
    const to = targets[i].getBoundingClientRect();
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.cssText = `left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px;font-size:${fontSize}px`;
    fly.appendChild(s);
    const scale = Math.max(from.height * 0.82, 10) / fontSize;
    gsap.set(s, {
      x: from.left + from.width / 2 - (to.left + to.width / 2),
      y: from.top + from.height / 2 - (to.top + to.height / 2),
      scale,
      transformOrigin: '50% 50%',
    });
    return s;
  });
  $('preStage').style.visibility = 'hidden';
  $('preSkip').style.display = 'none';

  tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
  tl.to(clones, { x: 0, y: 0, scale: 1, duration: 1.5, stagger: { each: 0.045, from: 'start' } }, 0)
    .to(clones, { color: '#0f0e0c', duration: 0.9, ease: 'power2.inOut' }, 0.5)
    .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'expo.inOut' }, 0.55);
  await tl;
  finish();
}
