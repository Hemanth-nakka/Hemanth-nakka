import axios from 'axios';
import { useAgentStore } from '../store/useAgentStore';

const BASE = import.meta.env.VITE_API_BASE || '/api/v1';

export function useApi() {
  const token = useAgentStore((s) => s.token);

  const headers = { Authorization: `Bearer ${token}` };

  const searchKnowledge = (query: string, filters?: object) =>
    axios.post(`${BASE}/knowledge/search`, { query, ...filters }, { headers }).then((r) => r.data.results);

  const triggerKnowledge = (utterance: string) =>
    axios.post(`${BASE}/knowledge/trigger`, { utterance }, { headers }).then((r) => r.data.articles);

  const getArticle = (id: string) =>
    axios.get(`${BASE}/knowledge/articles/${id}`, { headers }).then((r) => r.data);

  const generatePostCallSummary = (conversationId: string, transcript: unknown[]) =>
    axios.post(`${BASE}/summarize`, { conversationId, transcript }, { headers }).then((r) => r.data);

  const login = (agentId: string, name: string, role: string, secret: string) =>
    axios.post(`${BASE}/auth/token`, { agentId, name, role, secret }).then((r) => r.data);

  return { searchKnowledge, triggerKnowledge, getArticle, generatePostCallSummary, login };
}
