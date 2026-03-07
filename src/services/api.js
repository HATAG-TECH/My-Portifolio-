import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchProjects(params = {}) {
  const { data } = await api.get('/projects', { params });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function fetchProjectById(id) {
  const { data } = await api.get(`/projects/${id}`);
  return data?.data || null;
}

export async function sendContactMessage(payload) {
  const { data } = await api.post('/contact', payload);
  if (data && data.success === false) {
    const error = new Error(data.message || 'Message could not be processed.');
    error.response = { data };
    throw error;
  }
  return data;
}

export async function sendChatMessage(message, sessionId = '') {
  const { data } = await api.post('/chat', { message, sessionId });
  return data;
}

export async function fetchStats() {
  const { data } = await api.get('/stats');
  return data?.data || null;
}

export async function fetchVisitorSnapshot() {
  const { data } = await api.get('/visitor');
  return data?.data || null;
}
