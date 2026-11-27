/* Ana sayfa hero slider'ı — 3 slayt, otomatik ilerleme, sekme/ok ile manuel geçiş. */
export const SLIDE_MS = 6500; // prototipteki interval ve ilerleme çizgisi süresi (kvProg 6.5s)

export function initSlider() {
  const root = document.querySelector<HTMLElement>('[data-slider]');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-slide-to]'));
  const no = root.querySelector<HTMLElement>('[data-slide-no]');
  const n = slides.length;
  let cur = 0;
  let timer: number | undefined;
  let paused = false;

  const show = (i: number) => {
    cur = (i + n) % n;
    slides.forEach((s, k) => {
      const on = k === cur;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', String(!on));
      s.toggleAttribute('inert', !on);
    });
    tabs.forEach((t, k) => {
      const on = k === cur;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
      const track = t.querySelector<HTMLElement>('[data-prog]');
      if (track) track.innerHTML = on ? `<span class="prog-fill" style="animation-duration:${SLIDE_MS}ms;animation-play-state:${paused ? 'paused' : 'running'}"></span>` : '';
    });
    root.dataset.cur = String(cur);
    if (no) no.textContent = '0' + (cur + 1);
  };
  const start = () => {
    clearInterval(timer);
    timer = window.setInterval(() => { if (!paused) show(cur + 1); }, SLIDE_MS);
  };
  const go = (i: number) => { show(i); start(); };

  tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  root.querySelector('[data-slide-prev]')?.addEventListener('click', () => go(cur - 1));
  root.querySelector('[data-slide-next]')?.addEventListener('click', () => go(cur + 1));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(cur - 1);
    if (e.key === 'ArrowRight') go(cur + 1);
  });
  // Sekme görünür değilken ilerlemeyi durdur
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    const f = root.querySelector<HTMLElement>('.prog-fill');
    if (f) f.style.animationPlayState = paused ? 'paused' : 'running';
    if (!paused) go(cur);
  });

  // İlk açılış: slayt 0'ın giriş animasyonu 150 ms sonra başlar
  slides.forEach((s, k) => { if (k) s.setAttribute('inert', ''); });
  setTimeout(() => { root.classList.add('is-ready'); show(0); start(); }, 150);
}
