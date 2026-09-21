import { normalizeEmail, validateRegistration, validateLogin, validateTicket, makeTicket, changeStatus, filterTickets, ticketStats, STATUSES, STATUS_LABELS, PRIORITY_LABELS } from './domain.js';
import { seedDemo, registerUser, authenticate, getSession, setSession, clearSession, getTickets, saveTickets } from './storage.js';

const root = document.querySelector('#app');
const state = { view: 'login', user: null, query: '', status: 'all', notice: '' };
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const icon = (name, size = 20) => {
  const paths = {
    pulse: '<path d="M2 12h5l3-7 4 14 3-7h5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    shield: '<path d="m12 22 7-4V6l-7-4-7 4v12z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};
const brand = () => `<span class="brand-mark">${icon('pulse', 24)}</span><span>pulse<span class="brand-light">desk</span><small>QA LAB / PORTFÓLIO</small></span>`;
const field = ({ label, name, type = 'text', placeholder = '', autocomplete = 'off', help = '' }) => `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${placeholder}" autocomplete="${autocomplete}" aria-describedby="${name}-error${help ? ` ${name}-help` : ''}" />${help ? `<span id="${name}-help" class="field-help">${help}</span>` : ''}<span class="field-error" id="${name}-error" data-error-for="${name}" aria-live="polite"></span></div>`;
const globalNotice = () => state.notice ? `<div class="notice" role="status">${escapeHtml(state.notice)}</div>` : '';

function renderAuth() {
  const registering = state.view === 'register';
  root.innerHTML = `<div class="auth-shell">
    <aside class="auth-aside"><div class="brand brand-inverse">${brand()}</div><div class="aside-content"><div class="eyebrow">LABORATÓRIO DE QUALIDADE <span class="dot"></span> v1.0</div><h1>Qualidade começa<br/>com <em>curiosidade.</em></h1><p>Um ambiente realista para praticar testes funcionais, automação E2E e rastreabilidade de defeitos.</p><div class="aside-preview"><div class="preview-header"><span class="window-dots"><i></i><i></i><i></i></span><span>quality / overview</span><span class="preview-live">● Sistema ativo</span></div><div class="preview-body"><div class="preview-stats"><span>TESTES MANUAIS<strong>Documentados</strong></span><span>AUTOMAÇÃO<strong>Playwright</strong></span></div><div class="preview-bars"><span></span><span></span><span></span><span></span><span></span></div><div class="preview-footer">${icon('shield', 16)} Cenários · Evidências · Qualidade</div></div></div></div><div class="aside-bottom">PROJETO EDUCACIONAL <span>© QA Lab</span></div></aside>
    <main class="auth-main"><div class="auth-top"><div class="brand brand-mobile">${brand()}</div><span class="project-chip">AMBIENTE DE DEMONSTRAÇÃO</span></div><div class="auth-content"><span class="kicker">${registering ? 'COMECE SEU TESTE' : 'BEM-VINDO DE VOLTA'}</span><h2>${registering ? 'Crie sua conta.' : 'Entre no seu espaço.'}</h2><p class="auth-description">${registering ? 'Cadastre um usuário fictício para explorar a aplicação e seus cenários de QA.' : 'Acesse seu painel de chamados e explore os fluxos de teste.'}</p>
      <div class="auth-tabs" aria-label="Escolher formulário"><button type="button" data-view="login" aria-pressed="${!registering}">Entrar</button><button type="button" data-view="register" aria-pressed="${registering}">Criar conta</button></div>${globalNotice()}
      <form id="auth-form" novalidate>${registering ? field({ label: 'Nome completo', name: 'name', placeholder: 'Seu nome de demonstração', autocomplete: 'name' }) : ''}
        ${field({ label: 'E-mail', name: 'email', type: 'email', placeholder: 'voce@exemplo.com', autocomplete: 'email' })}
        ${field({ label: 'Senha', name: 'password', type: 'password', placeholder: 'Digite sua senha', autocomplete: registering ? 'new-password' : 'current-password', help: registering ? 'Mínimo de 8 caracteres, com letras e números.' : '' })}
        ${registering ? field({ label: 'Confirmar senha', name: 'confirmation', type: 'password', placeholder: 'Repita sua senha', autocomplete: 'new-password' }) : ''}
        <p id="form-error" class="form-error" role="alert" aria-live="assertive"></p><button type="submit" class="primary-btn">${registering ? 'Criar conta' : 'Entrar no painel'} ${icon('arrow', 19)}</button>
      </form>
      ${!registering ? `<div class="demo-card"><span class="demo-icon">${icon('layers', 20)}</span><div><strong>Quer explorar rapidamente?</strong><p>Use os dados fictícios de demonstração:</p><code>demo@pulsedesk.dev</code><code>Demo@12345</code></div><button type="button" id="fill-demo" class="text-btn">Preencher</button></div>` : ''}
      <p class="privacy-note">${icon('shield', 16)} Protótipo educacional: não utilize senhas ou dados pessoais reais.</p>
    </div><footer class="auth-footer">Feito para aprender, testar e documentar. <span>QA LAB · 2026</span></footer></main></div>`;
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    state.view = button.dataset.view;
    state.notice = '';
    renderAuth();
  }));
  document.querySelector('#auth-form').addEventListener('submit', handleAuth);
  document.querySelector('#fill-demo')?.addEventListener('click', () => {
    document.querySelector('#email').value = 'demo@pulsedesk.dev';
    document.querySelector('#password').value = 'Demo@12345';
    document.querySelector('#email').focus();
  });
}

function showErrors(errors) {
  document.querySelectorAll('[data-error-for]').forEach(element => {
    element.textContent = errors[element.dataset.errorFor] || '';
    document.getElementById(element.dataset.errorFor)?.setAttribute('aria-invalid', String(Boolean(errors[element.dataset.errorFor])));
  });
  if (Object.keys(errors).length) document.getElementById(Object.keys(errors)[0])?.focus();
}

async function handleAuth(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  const registering = state.view === 'register';
  const errors = registering ? validateRegistration(data) : validateLogin(data);
  showErrors(errors);
  const summary = document.querySelector('#form-error');
  summary.textContent = '';
  if (Object.keys(errors).length) return;
  submit.disabled = true;
  try {
    if (registering) {
      await registerUser(data);
      state.view = 'login';
      state.notice = 'Conta criada! Entre com seu e-mail e senha.';
      renderAuth();
      document.querySelector('#email').value = normalizeEmail(data.email);
      document.querySelector('#password').focus();
    } else {
      const user = await authenticate(data.email, data.password);
      if (!user) {
        summary.textContent = 'E-mail ou senha incorretos.';
        document.querySelector('#password').focus();
        return;
      }
      setSession(user);
      state.user = user;
      state.query = '';
      state.status = 'all';
      state.notice = '';
      renderDashboard();
    }
  } catch (error) {
    summary.textContent = error.message === 'Este e-mail já está cadastrado.' ? error.message : 'Não foi possível concluir a operação. Tente novamente.';
    if (registering && error.message === 'Este e-mail já está cadastrado.') document.querySelector('#email').focus();
  } finally { submit.disabled = false; }
}

function ticketCard(ticket) {
  const date = new Date(ticket.createdAt).toLocaleDateString('pt-BR');
  const code = escapeHtml(ticket.id);
  return `<article class="ticket-card" data-ticket="${code}"><div class="ticket-top"><span class="ticket-code">${code}</span><span class="priority priority-${ticket.priority}"><i></i>${PRIORITY_LABELS[ticket.priority] || 'N/D'}</span></div><h4>${escapeHtml(ticket.title)}</h4><p class="ticket-description">${escapeHtml(ticket.description)}</p><div class="ticket-bottom"><span class="ticket-date">${icon('clock', 14)} ${date}</span><label class="status-control" for="status-${code}"><span class="sr-only">Alterar status do chamado ${code}</span><select id="status-${code}" data-status-id="${code}" aria-label="Alterar status do chamado ${code}">${STATUSES.map(status => `<option value="${status}" ${status === ticket.status ? 'selected' : ''}>${STATUS_LABELS[status]}</option>`).join('')}</select></label></div></article>`;
}
function renderTickets() {
  const filtered = filterTickets(getTickets(state.user.id), { query: state.query, status: state.status });
  const list = document.querySelector('#tickets-list');
  list.innerHTML = filtered.length ? filtered.map(ticketCard).join('') : `<div class="empty-state">${icon('search', 34)}<strong>Nenhum chamado encontrado</strong><p>Crie um novo chamado ou ajuste os filtros para visualizar outros resultados.</p></div>`;
  document.querySelector('#list-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'chamado' : 'chamados'}`;
  list.querySelectorAll('[data-status-id]').forEach(select => select.addEventListener('change', () => {
    const tickets = getTickets(state.user.id).map(ticket => ticket.id === select.dataset.statusId ? changeStatus(ticket, select.value) : ticket);
    saveTickets(state.user.id, tickets);
    state.notice = `Status do chamado ${select.dataset.statusId} atualizado.`;
    renderDashboard();
  }));
}

function renderDashboard() {
  const user = state.user;
  const tickets = getTickets(user.id);
  const stats = ticketStats(tickets);
  const firstName = escapeHtml(user.name.split(' ')[0]);
  root.innerHTML = `<div class="dashboard-shell"><aside class="sidebar"><div class="brand brand-inverse">${brand()}</div><div class="sidebar-label">WORKSPACE</div><nav aria-label="Navegação principal"><span class="nav-link nav-active">${icon('grid', 19)} Visão geral</span><span class="nav-link nav-static">${icon('layers', 19)} Chamados <span>${stats.total}</span></span></nav><div class="sidebar-bottom"><div class="sidebar-learning">${icon('shield', 22)}<strong>Ambiente QA Lab</strong><p>Dados locais e fictícios para exploração de testes.</p></div><button id="logout" class="logout-btn">${icon('logout', 18)} Sair da conta</button></div></aside>
    <main class="dashboard-main"><header class="dash-top"><span>WORKSPACE <span class="breadcrumb">/ VISÃO GERAL</span></span><div class="avatar" aria-label="Usuário ${escapeHtml(user.name)}">${escapeHtml(user.name.charAt(0).toUpperCase())}</div></header><div class="dashboard-content"><div class="welcome"><div><span class="kicker">PAINEL DE CONTROLE</span><h1>Olá, ${firstName} <span aria-hidden="true">✳</span></h1><p>Organize, investigue e acompanhe os chamados do seu laboratório.</p></div><span class="edition">DEMO / v1.0</span></div>${globalNotice()}
      <section class="stats-grid" aria-label="Resumo dos chamados"><div class="stat"><div class="stat-symbol all">${icon('layers', 20)}</div><span>Total de chamados</span><strong data-testid="stat-total">${stats.total}</strong><small>Registrados no ambiente</small></div><div class="stat"><div class="stat-symbol opened">${icon('plus', 20)}</div><span>Em aberto</span><strong data-testid="stat-open">${stats.open}</strong><small>Aguardando análise</small></div><div class="stat"><div class="stat-symbol ongoing">${icon('clock', 20)}</div><span>Em andamento</span><strong data-testid="stat-in-progress">${stats.in_progress}</strong><small>Em investigação</small></div><div class="stat"><div class="stat-symbol solved">${icon('check', 20)}</div><span>Resolvidos</span><strong data-testid="stat-resolved">${stats.resolved}</strong><small>Validados e encerrados</small></div></section>
      <div class="workspace-grid"><section class="panel ticket-panel"><div class="section-heading"><div><span class="kicker">GERENCIAMENTO</span><h2>Seus chamados</h2><p>Acompanhe o ciclo de cada ocorrência.</p></div><span class="count-pill" id="list-count"></span></div><div class="filters"><label class="search-field" for="ticket-query">${icon('search', 18)}<span class="sr-only">Buscar chamados</span><input type="search" id="ticket-query" placeholder="Buscar chamados..." value="${escapeHtml(state.query)}" /></label><label class="filter-field" for="ticket-status"><span class="sr-only">Filtrar por status</span><select id="ticket-status"><option value="all">Todos os status</option>${STATUSES.map(status => `<option value="${status}" ${state.status === status ? 'selected' : ''}>${STATUS_LABELS[status]}</option>`).join('')}</select></label></div><div id="tickets-list" class="ticket-list" aria-live="polite"></div></section>
      <section class="panel create-panel"><div class="section-heading"><div><span class="kicker">NOVO REGISTRO</span><h2>Abrir chamado</h2><p>Documente o problema para investigação.</p></div><span class="create-icon">${icon('plus', 22)}</span></div><form id="ticket-form" novalidate>${field({ label: 'Título do chamado', name: 'title', placeholder: 'Ex.: Erro ao confirmar cadastro' })}<div class="field"><label for="description">Descrição</label><textarea id="description" name="description" rows="5" placeholder="Descreva o comportamento observado, contexto e detalhes relevantes..." aria-describedby="description-error"></textarea><span class="field-error" id="description-error" data-error-for="description" aria-live="polite"></span></div><div class="field"><label for="priority">Prioridade</label><select id="priority" name="priority" aria-describedby="priority-error"><option value="">Selecione...</option><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select><span class="field-error" id="priority-error" data-error-for="priority" aria-live="polite"></span></div><button type="submit" class="primary-btn">${icon('plus', 19)} Criar chamado</button></form><div class="form-tip">${icon('shield', 17)} Use apenas informações fictícias neste laboratório.</div></section></div></div><footer class="dash-footer">PulseDesk · Aplicação demonstrativa de portfólio QA <span>Sem backend ou autenticação de produção</span></footer></main></div>`;
  document.querySelector('#logout').addEventListener('click', () => { clearSession(); state.user = null; state.view = 'login'; state.notice = 'Sessão encerrada com sucesso.'; renderAuth(); });
  document.querySelector('#ticket-query').addEventListener('input', event => { state.query = event.target.value; renderTickets(); });
  document.querySelector('#ticket-status').addEventListener('change', event => { state.status = event.target.value; renderTickets(); });
  document.querySelector('#ticket-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const errors = validateTicket(data);
    showErrors(errors);
    if (Object.keys(errors).length) return;
    const current = getTickets(user.id);
    const ticket = makeTicket(data, `PD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
    saveTickets(user.id, [ticket, ...current]);
    state.query = '';
    state.status = 'all';
    state.notice = `Chamado ${ticket.id} criado com sucesso.`;
    renderDashboard();
  });
  renderTickets();
}

async function boot() {
  try {
    await seedDemo();
    state.user = getSession();
    state.user ? renderDashboard() : renderAuth();
  } catch (error) {
    console.error('Inicialização do laboratório falhou:', error);
    root.innerHTML = '<main class="boot-message" role="alert">Não foi possível iniciar o laboratório. Verifique se o armazenamento local está disponível e atualize a página.</main>';
  }
}
boot();
