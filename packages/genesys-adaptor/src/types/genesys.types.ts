export type ChannelType = 'voice' | 'chat' | 'sms' | 'email' | 'messaging';

export interface GenesysConversationEvent {
  topicName: string;
  eventBody: {
    id: string;
    participants?: Array<{
      id: string;
      purpose: string;
      state: string;
      userId?: string;
      name?: string;
    }>;
  };
}

export interface GenesysTranscriptEvent {
  topicName: string;
  eventBody: {
    conversationId: string;
    sessionId: string;
    transcripts: Array<{
      channel: 'EXTERNAL' | 'INTERNAL';
      alternatives: Array<{
        transcript: string;
        confidence: number;
      }>;
    }>;
  };
}

export interface NormalizedEvent {
  type: 'transcript' | 'conversation_start' | 'conversation_end' | 'digital_message';
  conversationId: string;
  sessionId?: string;
  agentId?: string;
  customerId?: string;
  channelType: ChannelType;
  speaker: 'agent' | 'customer';
  text: string;
  language: 'tl-PH' | 'en-PH' | 'en';
  confidence?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationContext {
  conversationId: string;
  agentId: string;
  customerId: string;
  channelType: ChannelType;
  startTime: string;
  accountNumber?: string;
  productType?: string;
  dpd?: number;
  balance?: number;
}
