/* ============ TABS — onde o código executa ============ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

/* ============ ÁRVORE DE DECISÃO ============ */
const dtAnswers = {};
const dtRecommendations = [
  // ordem das verificações importa
  {
    test: (a) => a[1] === 'yes' && a[2] === 'yes',
    title: 'Claude Code (Enterprise) + Managed Agents',
    body: 'Você precisa de audit log E lida com dados sensíveis. Hoje, a única combinação defensável é Claude Code no plano Enterprise (com audit logs ativos) ou Claude Managed Agents — que dá logs no Console.',
    points: [
      'Cowork está fora — não tem trilha de auditoria em nenhum plano',
      'Habilite /sandbox e Docker para conter blast radius',
      'Connectors via MCP Gateway, jamais credenciais raw',
      'Code review humano em todas as dependências novas'
    ]
  },
  {
    test: (a) => a[1] === 'yes',
    title: 'Claude Code (Enterprise) — audit log ativo',
    body: 'Auditoria é requisito mas os dados não são sensíveis. Claude Code Enterprise resolve com audit log nativo; sub-agents com modelo correto (Opus orquestrador, Sonnet análise, Haiku busca).',
    points: [
      'Ative audit log no console Enterprise',
      'Para distribuição interna: scripts em repo GitHub privado',
      'Versões pinadas no requirements/package-lock'
    ]
  },
  {
    test: (a) => a[2] === 'yes' && a[3] === 'yes',
    title: 'Claude Code (Desktop) com sandbox + Docker',
    body: 'Dados sensíveis e analista é desenvolvedor. Use Claude Code local com /sandbox ativo (macOS/Linux) ou Docker no Windows. Sub-agents respeitam o modelo escolhido.',
    points: [
      'No Windows nativo: sandbox /sandbox não funciona — use Docker',
      'Pasta de trabalho dedicada e isolada',
      'Connectors via MCP Gateway centralizado'
    ]
  },
  {
    test: (a) => a[2] === 'yes',
    title: 'Claude Code na Web (VM Anthropic descartável)',
    body: 'Dados sensíveis mas o usuário não é dev. Empacote o fluxo no Claude Code na Web — VM isolada, descartada ao terminar a sessão, sem resíduo na máquina do analista.',
    points: [
      'Requer código em repositório GitHub conectado',
      'Timeout de bash: 2 min — não serve para jobs longos',
      'Janela de uso: 5h (compartilhadas com Chat e Cowork)'
    ]
  },
  {
    test: (a) => a[4] === 'yes',
    title: 'Claude Code (CLI ou Desktop)',
    body: 'Multi-agent com modelos específicos só funciona de fato no Claude Code. O bug do Cowork força tudo para Haiku silenciosamente — inviabiliza orquestração Opus/Sonnet.',
    points: [
      'Sub-agents com frontmatter model: opus | sonnet | haiku',
      'CLAUDE_CODE_SUBAGENT_MODEL define padrão',
      'Aninhamento até 5 níveis para tarefas complexas'
    ]
  },
  {
    test: (a) => a[3] === 'no',
    title: 'Cowork — com regras inegociáveis',
    body: 'Analista não-técnico, sem dados sensíveis, sem requisito de audit log. Cowork serve, desde que você aplique as 6 regras do time.',
    points: [
      'Pasta dedicada e VAZIA — nunca Documents/Desktop/Home',
      'Versões pinadas no script distribuído',
      'Computer Use desligado por padrão',
      'Atenção ao bug: sub-agents rodam só em Haiku no Cowork'
    ]
  },
  {
    test: () => true,
    title: 'Claude Code com sandbox',
    body: 'Cenário padrão para desenvolvedor sem requisitos especiais. Claude Code local com /sandbox ativo cobre 90% dos casos.',
    points: [
      'Ative /sandbox antes de iniciar tarefas críticas',
      'Considere Project + Skills se o time for replicar o fluxo'
    ]
  }
];

function dtRender() {
  const result = document.getElementById('dt-result');
  const allAnswered = [1,2,3,4].every(n => dtAnswers[n]);

  if (!allAnswered) {
    const answered = Object.keys(dtAnswers).length;
    result.innerHTML = `<div class="dt-result-empty">Respondidas ${answered} de 4 perguntas.<br />Continue para receber a recomendação.</div>`;
    return;
  }

  const rec = dtRecommendations.find(r => r.test(dtAnswers));
  result.innerHTML = `
    <h3>Recomendação</h3>
    <div class="dt-rec">${rec.title}</div>
    <p>${rec.body}</p>
    <ul>${rec.points.map(p => `<li>${p}</li>`).join('')}</ul>
  `;
}

document.querySelectorAll('.dt-q').forEach(q => {
  const qNum = parseInt(q.dataset.q, 10);
  q.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      q.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      dtAnswers[qNum] = btn.dataset.value;
      dtRender();
    });
  });
});

/* ============ SCROLL SUAVE PARA NAV ============ */
document.querySelectorAll('.topnav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  });
});

/* ============ DESTAQUE DA SEÇÃO ATUAL NO NAV ============ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.topnav a');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;
  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.borderBottomColor = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#0f1f3d';
      link.style.borderBottomColor = '#c9a45c';
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();
