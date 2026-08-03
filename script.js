/* Interações progressivas: o conteúdo permanece funcional sem JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('.menu');
  const themeButton = document.querySelector('.theme-button');
  const backTop = document.querySelector('.back-top');
  const loader = document.querySelector('.loader');

  /* Tema persistente. */
  const applyTheme = theme => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light', isLight);
    themeButton.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
  };
  const savedTheme = localStorage.getItem('arthur-theme');
  applyTheme(savedTheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  themeButton.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('arthur-theme', nextTheme);
    applyTheme(nextTheme);
  });

  /* Menu responsivo acessível. */
  const closeMenu = () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = '+';
  };
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.querySelector('span').textContent = isOpen ? '×' : '+';
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });

  /* Cabeçalho, retorno ao topo e item ativo. */
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 18);
    backTop.classList.toggle('show', scrollY > 650);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const navLinks = [...menu.querySelectorAll('a')];
  const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.toggleAttribute('aria-current', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-42% 0px -50% 0px' });
  sections.forEach(section => navObserver.observe(section));

  /* Reveal e contadores respeitam a preferência de redução de movimento. */
  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

    const results = document.querySelector('.results');
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(node => {
        const target = Number(node.dataset.count);
        const prefix = node.dataset.prefix || '';
        const suffix = node.dataset.suffix || '';
        const start = performance.now();
        const update = now => {
          const progress = Math.min((now - start) / 1000, 1);
          node.textContent = `${prefix}${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
      counterObserver.unobserve(entry.target);
    }), { threshold: .5 });
    if (results) counterObserver.observe(results);
  }

  /* Encerramento do carregamento visual. */
  addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 180), { once: true });
});
