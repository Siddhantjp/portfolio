import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { skills, skillLinks, projects, experience, education, profile } from './data.js';
import { runPreloader } from './preloader.js';
import { initField } from './field.js';

gsap.registerPlugin(ScrollTrigger);

/* every load starts fresh at the top: the preloader measures the hero, so it must not be scrolled */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('pagehide', () => window.scrollTo(0, 0));
document.documentElement.classList.add('js');

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── render content from data ───────── */

function renderStack() {
  const host = $('#stackList');
  host.innerHTML = skills
    .map(
      (g) => `<div class="stack__row" data-reveal>
        <div class="stack__group">${g.group}</div>
        <div class="stack__items">${g.items
          .map((s) => `<span class="term" data-term="${s}" tabindex="0">${s}${skillLinks[s] ? `<sup>${skillLinks[s].length}</sup>` : ''}</span>`)
          .join('')}</div>
      </div>`,
    )
    .join('');

  const terms = $$('.term', host);
  const related = (a, b) => a === b || (skillLinks[a] || []).includes(b) || (skillLinks[b] || []).includes(a);
  const focus = (name) => {
    host.classList.add('has-focus');
    terms.forEach((t) => {
      t.classList.toggle('on', related(name, t.dataset.term));
      t.classList.toggle('me', t.dataset.term === name);
    });
  };
  const blur = () => {
    host.classList.remove('has-focus');
    terms.forEach((t) => t.classList.remove('on', 'me'));
  };
  terms.forEach((t) => {
    t.addEventListener('pointerenter', () => focus(t.dataset.term));
    t.addEventListener('pointerleave', blur);
    t.addEventListener('focus', () => focus(t.dataset.term));
    t.addEventListener('blur', blur);
  });
}

function renderWork() {
  const host = $('#workList');
  host.innerHTML = projects
    .map(
      (p) => `<li class="proj" data-reveal>
        <button class="proj__head" type="button" aria-expanded="false">
          <span class="proj__id">№${p.id}</span>
          <span class="proj__title">${p.title}</span>
          <span class="proj__kicker">${p.kicker}</span>
          <span class="proj__plus" aria-hidden="true"></span>
        </button>
        <div class="proj__body" role="region">
          <div class="proj__inner">
            <ul class="proj__points">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
            <div class="proj__side">
              ${p.stat ? `<div class="proj__stat"><b>${p.stat.value}</b><span>${p.stat.label}</span></div>` : ''}
              <div class="tags">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div>
            </div>
          </div>
        </div>
      </li>`,
    )
    .join('');

  const items = $$('.proj', host);
  const toggle = (item, open) => {
    const body = $('.proj__body', item);
    item.classList.toggle('open', open);
    $('.proj__head', item).setAttribute('aria-expanded', String(open));
    gsap.to(body, {
      height: open ? 'auto' : 0,
      duration: reduce ? 0 : 0.7,
      ease: 'expo.out',
      onComplete: () => ScrollTrigger.refresh(),
    });
  };
  items.forEach((item) => {
    $('.proj__head', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      items.forEach((o) => o !== item && o.classList.contains('open') && toggle(o, false));
      toggle(item, willOpen);
    });
  });
  toggle(items[2], true); // TriageFlow — open by default, it has the strongest result
}

function renderPath() {
  $('#expList').innerHTML = experience
    .map((e) => `<div class="item" data-reveal><h4 class="item__role">${e.role}</h4><div class="item__org">${e.org}</div><p>${e.text}</p></div>`)
    .join('');
  $('#eduList').innerHTML = education
    .map(
      (e) => `<div class="item edu" data-reveal>
        <div><h4 class="item__role">${e.school}</h4><div class="edu__meta">${e.detail} · ${e.years}</div></div>
        <div class="edu__score"><b>${e.score}</b><span>${e.unit}</span></div>
      </div>`,
    )
    .join('');
}

renderStack();
renderWork();
renderPath();

/* ───────── smooth scroll ───────── */

const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduce });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop(); // released once the preloader is done

$$('[data-nav]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    lenis.scrollTo(id === '#top' ? 0 : id, { offset: id === '#top' ? 0 : -40, duration: 1.6 });
  }),
);
$('#toTop').addEventListener('click', () => lenis.scrollTo(0, { duration: 1.8 }));

/* ───────── scroll choreography ───────── */

function setupScroll() {
  // generic reveals
  $$('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: reduce ? 0 : 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // manifesto: words resolve as you read
  const m = $('#manifesto');
  const words = m.textContent.trim().split(/\s+/);
  m.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  if (!reduce) {
    gsap.to($$('.w', m), {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: m, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
    });
  }

  // count-up figures
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () =>
        gsap.to(o, { v: end, duration: reduce ? 0 : 1.8, ease: 'expo.out', onUpdate: () => (el.textContent = o.v.toFixed(dec)) }),
    });
  });

  // nav active state
  $$('main section[id]').forEach((sec) => {
    const link = $(`.nav__links a[href="#${sec.id}"]`);
    if (!link) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => link.classList.toggle('act', s.isActive),
    });
  });

  // hero name drifts and fades slightly as you leave it
  if (!reduce) {
    gsap.to('.hero__inner', {
      yPercent: -8, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* ───────── small things ───────── */

function clock() {
  const el = $('#clock');
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    el.textContent = `IST ${t}`;
  };
  tick();
  setInterval(tick, 30000);
}
clock();

$('#copyMail').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText(profile.email);
    btn.textContent = 'Copied ✓';
  } catch {
    btn.textContent = profile.email;
  }
  btn.classList.add('done');
  setTimeout(() => { btn.textContent = 'Copy email'; btn.classList.remove('done'); }, 2000);
});

/* ───────── boot ───────── */

(async function boot() {
  await runPreloader();
  setupScroll();
  initField($('#field'));
  lenis.start();
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .to('#nav', { opacity: 1, duration: 1 }, 0)
    .fromTo('[data-hero]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.1)
    .fromTo('#field', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
  ScrollTrigger.refresh();
})();
