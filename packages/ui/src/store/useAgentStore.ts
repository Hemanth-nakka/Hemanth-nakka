import { create } from 'zustand';
import {
  Agent, UiLanguage, Suggestion, ComplianceAlert,
  KBArticle, PostCallSummary, ConversationContext,
} from '../types';

interface AgentStore {
  token: string | null;
  agent: Agent | null;
  uiLanguage: UiLanguage;
  conversation: ConversationContext | null;
  suggestions: Suggestion[];
  complianceAlerts: ComplianceAlert[];
  kbSearchResults: KBArticle[];
  selectedArticle: KBArticle | null;
  disposition: { code: string; date?: string; amount?: string } | null;
  postCallSummary: PostCallSummary | null;
  wsConnected: boolean;

  setAuth: (token: string, agent: Agent) => void;
  logout: () => void;
  setLanguage: (lang: UiLanguage) => void;
  setConversation: (ctx: ConversationContext) => void;
  addSuggestions: (s: Suggestion[]) => void;
  addComplianceAlert: (a: ComplianceAlert) => void;
  clearAlerts: () => void;
  setKbResults: (r: KBArticle[]) => void;
  setSelectedArticle: (a: KBArticle | null) => void;
  setDisposition: (d: AgentStore['disposition']) => void;
  setPostCallSummary: (s: PostCallSummary) => void;
  setWsConnected: (v: boolean) => void;
  endConversation: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  token: null,
  agent: null,
  uiLanguage: 'en-PH',
  conversation: null,
  suggestions: [],
  complianceAlerts: [],
  kbSearchResults: [],
  selectedArticle: null,
  disposition: null,
  postCallSummary: null,
  wsConnected: false,

  setAuth: (token, agent) => set({ token, agent }),
  logout: () => set({ token: null, agent: null, conversation: null }),
  setLanguage: (uiLanguage) => set({ uiLanguage }),
  setConversation: (conversation) => set({ conversation, suggestions: [], complianceAlerts: [], disposition: null, postCallSummary: null }),
  addSuggestions: (s) => set((st) => ({ suggestions: [...s, ...st.suggestions].slice(0, 10) })),
  addComplianceAlert: (a) => set((st) => ({ complianceAlerts: [a, ...st.complianceAlerts].slice(0, 20) })),
  clearAlerts: () => set({ complianceAlerts: [] }),
  setKbResults: (kbSearchResults) => set({ kbSearchResults }),
  setSelectedArticle: (selectedArticle) => set({ selectedArticle }),
  setDisposition: (disposition) => set({ disposition }),
  setPostCallSummary: (postCallSummary) => set({ postCallSummary }),
  setWsConnected: (wsConnected) => set({ wsConnected }),
  endConversation: () => set({ conversation: null, suggestions: [], complianceAlerts: [], disposition: null, postCallSummary: null }),
}));
