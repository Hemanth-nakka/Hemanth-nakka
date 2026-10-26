export type SuggestionCategory =
  | 'negotiation'
  | 'compliance'
  | 'empathy'
  | 'payment'
  | 'escalation'
  | 'closing';

export interface Suggestion {
  id: string;
  category: SuggestionCategory;
  title: string;
  titleTl: string;
  body: string;
  bodyTl: string;
  script?: string;
  scriptTl?: string;
  confidence: number;
  conversationId: string;
  timestamp: string;
}

export interface PostCallSummary {
  conversationId: string;
  agentId?: string;
  duration?: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  commitmentsMade: string[];
  followUpActions: string[];
  complianceFlags: string[];
  summary: string;
  summaryTl: string;
  timestamp: string;
}

export interface NegotiationInsight {
  phase: 'opening' | 'probing' | 'negotiating' | 'closing' | 'escalating';
  signals: string[];
  riskLevel: 'low' | 'medium' | 'high';
}
