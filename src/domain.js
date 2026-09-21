/** Regras de negócio puras: testáveis sem navegador ou armazenamento. */
export const STATUSES = ['open', 'in_progress', 'resolved'];
export const PRIORITIES = ['low', 'medium', 'high'];
export const STATUS_LABELS = { open: 'Aberto', in_progress: 'Em andamento', resolved: 'Resolvido' };
export const PRIORITY_LABELS = { low: 'Baixa', medium: 'Média', high: 'Alta' };

export function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function validateRegistration({ name = '', email = '', password = '', confirmation = '' }) {
  const errors = {};
  const fullName = String(name).trim();
  if (fullName.length < 2 || fullName.length > 60) errors.name = 'Informe um nome entre 2 e 60 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))) errors.email = 'Informe um e-mail válido.';
  if (String(password).length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) errors.password = 'Use no mínimo 8 caracteres, com letras e números.';
  if (confirmation !== password) errors.confirmation = 'As senhas não coincidem.';
  return errors;
}

export function validateLogin({ email = '', password = '' }) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))) errors.email = 'Informe um e-mail válido.';
  if (!password) errors.password = 'Informe sua senha.';
  return errors;
}

export function validateTicket({ title = '', description = '', priority = '' }) {
  const errors = {};
  if (String(title).trim().length < 5 || String(title).trim().length > 80) errors.title = 'O título deve ter entre 5 e 80 caracteres.';
  if (String(description).trim().length < 10 || String(description).trim().length > 500) errors.description = 'Descreva o problema em 10 a 500 caracteres.';
  if (!PRIORITIES.includes(priority)) errors.priority = 'Selecione uma prioridade válida.';
  return errors;
}

export function makeTicket(values, id, now = new Date()) {
  if (Object.keys(validateTicket(values)).length) throw new Error('Chamado inválido');
  return { id, title: values.title.trim(), description: values.description.trim(), priority: values.priority, status: 'open', createdAt: now.toISOString() };
}

export function changeStatus(ticket, status) {
  if (!STATUSES.includes(status)) throw new Error('Status inválido');
  return { ...ticket, status };
}

export function filterTickets(tickets, { query = '', status = 'all' } = {}) {
  const needle = String(query).trim().toLocaleLowerCase('pt-BR');
  return tickets.filter(ticket => {
    const matchesStatus = status === 'all' || ticket.status === status;
    const haystack = `${ticket.title} ${ticket.description} ${ticket.id}`.toLocaleLowerCase('pt-BR');
    return matchesStatus && haystack.includes(needle);
  });
}

export function ticketStats(tickets) {
  return {
    total: tickets.length,
    open: tickets.filter(ticket => ticket.status === 'open').length,
    in_progress: tickets.filter(ticket => ticket.status === 'in_progress').length,
    resolved: tickets.filter(ticket => ticket.status === 'resolved').length
  };
}
