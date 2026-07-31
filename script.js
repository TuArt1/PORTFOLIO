/* Progressive enhancement: all content remains accessible without JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('.menu');
  const themeButton = document.querySelector('.theme-button');
  const backTop = document.querySelector('.back-top');
  const loader = document.querySelector('.loader');

  const applyTheme = theme => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light', isLight);
    themeButton.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
    themeButton.title = isLight ? 'Ativar tema escuro' : 'Ativar tema claro';
  };
  const saved = localStorage.getItem('arthur-theme');
  applyTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  themeButton.addEventListener('click', () => { const next = document.body.classList.contains('light') ? 'dark' : 'light'; localStorage.setItem('arthur-theme', next); applyTheme(next); });

  const closeMenu = () => { menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.lastChild.textContent = '+'; };
  menuButton.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.lastChild.textContent = open ? '×' : '+'; });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menuButton.focus(); } });

  let queued = false;
  const onScroll = () => { if (queued) return; queued = true; requestAnimationFrame(() => { const y = scrollY; header.classList.toggle('scrolled', y > 20); backTop.classList.toggle('show', y > 650); queued = false; }); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const navItems = [...menu.querySelectorAll('a')];
  const sections = navItems.map(link => document.querySelector(link.hash)).filter(Boolean);
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) navItems.forEach(link => link.toggleAttribute('aria-current', link.hash === `#${entry.target.id}`)); }), { rootMargin: '-42% 0px -52% 0px' });
  sections.forEach(section => navObserver.observe(section));

  if (!reduceMotion) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.classList.add('visible'); entry.target.querySelectorAll('[data-width]').forEach(bar => { bar.style.width = `${bar.dataset.width}%`; }); reveal.unobserve(entry.target); }), { threshold: .13 });
    document.querySelectorAll('.reveal').forEach(item => reveal.observe(item));
    const stats = document.querySelector('.stats');
    const counter = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.querySelectorAll('[data-count]').forEach(node => { const target = Number(node.dataset.count), suffix = node.dataset.suffix || '', start = performance.now(); const tick = now => { const p = Math.min((now - start) / 950, 1); node.textContent = `${Math.round(target * (1 - Math.pow(1 - p, 3)))}${suffix}`; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }); counter.unobserve(entry.target); }), { threshold: .5 });
    if (stats) counter.observe(stats);
    const words = ['Analista de Sistemas', 'ERP', 'TOTVS RM', 'SQL Server', 'Python', 'Automação'];
    const typed = document.querySelector('#typed'); let index = 0, length = 0, removing = false;
    const type = () => { const word = words[index]; typed.textContent = removing ? word.slice(0, --length) : word.slice(0, ++length); let delay = removing ? 32 : 65; if (!removing && length === word.length) { removing = true; delay = 1500; } else if (removing && length === 0) { removing = false; index = (index + 1) % words.length; delay = 240; } setTimeout(type, delay); }; type();
  } else document.querySelectorAll('[data-width]').forEach(bar => { bar.style.width = `${bar.dataset.width}%`; });

  document.querySelector('.form').addEventListener('submit', event => { event.preventDefault(); event.currentTarget.querySelector('.form-status').textContent = 'Mensagem pronta! Configure um serviço de e-mail para receber os envios.'; event.currentTarget.reset(); });
  addEventListener('load', () => setTimeout(() => loader.classList.add('done'), reduceMotion ? 0 : 220), { once: true });
});
