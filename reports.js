/* ============================================================= */
/* reports.js — interações das páginas VPS/MCP e relatórios       */
/* (carregado apenas em vps-mcp.html e nas páginas de relatório)  */
/* ============================================================= */

/* ---- Menu mobile (hambúrguer) ---- */
(function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.topnav');
  if (!toggle || !nav) return;
  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---- Expandir / Recolher todos os dropdowns ---- */
const expandBtn = document.querySelector('[data-action="expand-all"]');
const collapseBtn = document.querySelector('[data-action="collapse-all"]');
const sections = () => document.querySelectorAll('.rpt-section');

if (expandBtn) {
  expandBtn.addEventListener('click', () => {
    sections().forEach(s => s.open = true);
  });
}
if (collapseBtn) {
  collapseBtn.addEventListener('click', () => {
    sections().forEach(s => s.open = false);
  });
}

/* ---- Índice (chips) → abre a seção e rola até ela ---- */
function goToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.open = true;
  // pequeno atraso garante que o layout pós-abertura esteja calculado
  requestAnimationFrame(() => {
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

document.querySelectorAll('.rpt-chip').forEach(chip => {
  chip.addEventListener('click', () => goToSection(chip.dataset.target));
});

/* ---- Referências cruzadas no texto (ex.: "seção 5") abrem o alvo ---- */
document.querySelectorAll('a.rpt-xref').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      goToSection(href.slice(1));
    }
  });
});

/* ---- Suporte a deep-link via hash (#sec-3) ---- */
if (location.hash && location.hash.length > 1) {
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.classList.contains('rpt-section')) {
    setTimeout(() => goToSection(location.hash.slice(1)), 120);
  }
}

/* ---- Salvar como PDF / imprimir ---- */
function expandAllForPrint() {
  document.querySelectorAll('.rpt-section, .rpt-detail').forEach(s => { s.open = true; });
}
const printBtn = document.querySelector('[data-action="print"]');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    expandAllForPrint();
    // dá um instante para o layout reabrir antes de abrir o diálogo de impressão
    setTimeout(() => window.print(), 180);
  });
}
// também cobre o atalho do navegador (Ctrl/Cmd + P)
window.addEventListener('beforeprint', expandAllForPrint);

/* ---- Botão flutuante "voltar ao topo" ---- */
const toTop = document.querySelector('.to-top');
if (toTop) {
  const toggleToTop = () => {
    if (window.scrollY > 600) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggleToTop();
}
