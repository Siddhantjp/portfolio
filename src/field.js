/* A quiet lattice of points behind the hero that bends around the cursor, like a latent space being pushed. */
export function initField(canvas) {
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, pts = [], raf = 0, visible = true;
  const mouse = { x: -9999, y: -9999, active: false };
  const GAP = () => (w < 700 ? 34 : 44);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = GAP();
    pts = [];
    for (let y = g / 2; y < h; y += g) for (let x = g / 2; x < w; x += g) pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
    if (reduce) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const R = 150;
    for (const p of pts) {
      const wave = Math.sin(p.ox * 0.008 + t * 0.0004) * Math.cos(p.oy * 0.01 + t * 0.0003) * 3;
      let tx = p.ox, ty = p.oy + wave;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      let heat = 0;
      if (mouse.active && d < R) {
        const f = (1 - d / R) ** 2;
        tx += (dx / (d || 1)) * f * 38;
        ty += (dy / (d || 1)) * f * 38;
        heat = f;
      }
      p.vx = (p.vx + (tx - p.x) * 0.09) * 0.78;
      p.vy = (p.vy + (ty - p.y) * 0.09) * 0.78;
      p.x += p.vx; p.y += p.vy;
      const a = 0.22 + heat * 0.7;
      ctx.fillStyle = heat > 0.05 ? `rgba(255,74,28,${a})` : `rgba(15,14,12,${a})`;
      const s = 1.1 + heat * 2.2;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
  }

  function loop(t) {
    if (visible) draw(t);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  const hero = canvas.parentElement;
  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  hero.addEventListener('pointerleave', () => { mouse.active = false; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  resize();
  if (!reduce) raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}
