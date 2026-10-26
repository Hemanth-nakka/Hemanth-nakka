import { GenesysTranscriptEvent, NormalizedEvent, ChannelType } from '../types/genesys.types';

const TAGALOG_MARKERS = [
  'po', 'ho', 'nga', 'naman', 'kasi', 'yung', 'yun', 'yan', 'ito', 'dito',
  'doon', 'saan', 'sino', 'ano', 'bakit', 'paano', 'pwede', 'puwede', 'hindi',
  'oo', 'hindi', 'salamat', 'magkano', 'bayad', 'utang', 'pautang', 'hulog',
  'kaya', 'lang', 'talaga', 'sige', 'wala', 'mahal', 'mura', 'bago', 'luma',
];

export function detectLanguage(text: string): 'tl-PH' | 'en-PH' | 'en' {
  const words = text.toLowerCase().split(/\s+/);
  const tagalogCount = words.filter((w) => TAGALOG_MARKERS.includes(w)).length;
  const ratio = tagalogCount / words.length;
  if (ratio > 0.15) return 'tl-PH';
  if (ratio > 0.05) return 'en-PH';
  return 'en';
}

export function transformTranscriptEvent(
  event: GenesysTranscriptEvent,
  channelType: ChannelType = 'voice'
): NormalizedEvent | null {
  const transcript = event.eventBody.transcripts?.[0];
  if (!transcript) return null;

  const best = transcript.alternatives?.[0];
  if (!best?.transcript) return null;

  const speaker = transcript.channel === 'INTERNAL' ? 'agent' : 'customer';

  return {
    type: 'transcript',
    conversationId: event.eventBody.conversationId,
    sessionId: event.eventBody.sessionId,
    channelType,
    speaker,
    text: best.transcript,
    confidence: best.confidence,
    language: detectLanguage(best.transcript),
    timestamp: new Date().toISOString(),
  };
}

export function buildDigitalEvent(body: {
  conversationId: string;
  agentId?: string;
  customerId?: string;
  channelType: ChannelType;
  message: string;
  language?: string;
}): NormalizedEvent {
  return {
    type: 'digital_message',
    conversationId: body.conversationId,
    agentId: body.agentId,
    customerId: body.customerId,
    channelType: body.channelType,
    speaker: 'customer',
    text: body.message,
    language: (body.language as NormalizedEvent['language']) || detectLanguage(body.message),
    timestamp: new Date().toISOString(),
  };
}
