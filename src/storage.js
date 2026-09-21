import { normalizeEmail, makeTicket } from './domain.js';

// Demo local sem backend. Nunca utilize senha real.
const USERS_KEY = 'pulsedesk:v1:users';
const SESSION_KEY = 'pulsedesk:v1:session';
const ticketsKey = id => `pulsedesk:v1:tickets:${id}`;
const readJson = (storage, key, fallback) => {
  try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const toHex = data => [...new Uint8Array(data)].map(byte => byte.toString(16).padStart(2, '0')).join('');
const fromHex = hex => Uint8Array.from(hex.match(/.{2}/g) || [], byte => parseInt(byte, 16));

async function derivePassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(salt), iterations: 100_000 }, key, 256));
}

export function getUsers() {
  const users = readJson(localStorage, USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export async function registerUser({ name, email, password }) {
  const normalized = normalizeEmail(email);
  if (getUsers().some(user => user.email === normalized)) throw new Error('Este e-mail já está cadastrado.');
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const user = { id: crypto.randomUUID(), name: name.trim(), email: normalized, salt, hash: await derivePassword(password, salt) };
  localStorage.setItem(USERS_KEY, JSON.stringify([...getUsers(), user]));
  localStorage.setItem(ticketsKey(user.id), JSON.stringify([]));
  return { id: user.id, name: user.name, email: user.email };
}

export async function authenticate(email, password) {
  const user = getUsers().find(item => item.email === normalizeEmail(email));
  if (!user || (await derivePassword(password, user.salt)) !== user.hash) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export function getSession() {
  const id = sessionStorage.getItem(SESSION_KEY);
  const user = getUsers().find(item => item.id === id);
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}
export function setSession(user) { sessionStorage.setItem(SESSION_KEY, user.id); }
export function clearSession() { sessionStorage.removeItem(SESSION_KEY); }
export function getTickets(userId) {
  const tickets = readJson(localStorage, ticketsKey(userId), []);
  return Array.isArray(tickets) ? tickets : [];
}
export function saveTickets(userId, tickets) { localStorage.setItem(ticketsKey(userId), JSON.stringify(tickets)); }

export async function seedDemo() {
  if (getUsers().some(user => user.email === 'demo@pulsedesk.dev')) return;
  const demo = await registerUser({ name: 'Alex Demo', email: 'demo@pulsedesk.dev', password: 'Demo@12345' });
  const samples = [
    ['Falha intermitente no login', 'Usuário recebe uma mensagem de erro ao autenticar em condições específicas.', 'high', 'open'],
    ['Filtro não atualiza a listagem', 'Ao selecionar uma opção, a lista não reflete o filtro esperado.', 'medium', 'in_progress'],
    ['Ajustar mensagem de confirmação', 'Revisar o texto exibido ao concluir uma solicitação.', 'low', 'resolved']
  ];
  saveTickets(demo.id, samples.map(([title, description, priority, status], index) => ({
    ...makeTicket({ title, description, priority }, `PD-${String(index + 1).padStart(3, '0')}`), status
  })));
}
