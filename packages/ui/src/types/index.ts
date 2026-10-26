export type UiLanguage = 'tl-PH' | 'en-PH' | 'en';
export type ChannelType = 'voice' | 'chat' | 'sms' | 'email';

export interface Agent {
  agentId: string;
  name: string;
  role: 'agent' | 'supervisor' | 'admin';
}

export interface Suggestion {
  id: string;
  category: string;
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

export interface ComplianceAlert {
  ruleId: string;
  regulation: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  agentCue: string;
  agentCueTl: string;
  autoEscalate: boolean;
  triggeredText: string;
  conversationId: string;
  timestamp: string;
}

export interface KBArticle {
  id: string;
  title: string;
  titleTl: string;
  category: string;
  tags: string[];
  content: string;
  contentTl: string;
}

export interface PostCallSummary {
  conversationId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  commitmentsMade: string[];
  followUpActions: string[];
  complianceFlags: string[];
  summary: string;
  summaryTl: string;
  timestamp: string;
}

export interface ConversationContext {
  conversationId: string;
  channelType: ChannelType;
  customerId: string;
  accountNumber?: string;
  productType?: string;
  dpd?: number;
  balance?: number;
}

export const DISPOSITION_CODES = [
  { code: 'PTP', label: 'Promise to Pay', labelTl: 'Pangako na Magbabayad', requiresDate: true, requiresAmount: true },
  { code: 'PPA', label: 'Partial Payment Arrangement', labelTl: 'Bahagyang Ayos ng Pagbabayad', requiresDate: true, requiresAmount: true },
  { code: 'RTP', label: 'Refused to Pay', labelTl: 'Tumanggi na Magbayad', requiresDate: false, requiresAmount: false },
  { code: 'DISP', label: 'Dispute Raised', labelTl: 'Dispute na Itinataas', requiresDate: false, requiresAmount: false },
  { code: 'HARD', label: 'Hardship Identified', labelTl: 'Nahiwatig na Kahirapan', requiresDate: false, requiresAmount: false },
  { code: 'NC', label: 'No Contact', labelTl: 'Walang Kontak', requiresDate: false, requiresAmount: false },
  { code: 'CB', label: 'Call Back', labelTl: 'Tumawag Muli', requiresDate: true, requiresAmount: false },
  { code: 'LEGAL', label: 'Escalate to Legal', labelTl: 'I-escalate sa Legal', requiresDate: false, requiresAmount: false },
  { code: 'PM', label: 'Payment Made', labelTl: 'Nagbayad na', requiresDate: false, requiresAmount: true },
] as const;
