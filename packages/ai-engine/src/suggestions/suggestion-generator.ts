import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { Suggestion } from '../types/ai.types';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert collections agent coach for Philippine contact centers.
Generate real-time suggestions for agents during live calls. Always respond in JSON only.
Rules:
- Suggestions must comply with BSP Circular 1048 (no threats, no harassment, no misrepresentation)
- Comply with RA 10173 (Data Privacy Act) — never suggest disclosing data to third parties
- All suggestions must have English AND Taglish versions
- Taglish = professional Filipino-English mix used in PH call centers
- Keep scripts concise (2-4 sentences max)
- Tone: firm but empathetic, professional, solution-focused`;

interface TranscriptContext {
  conversationId: string;
  recentUtterances: Array<{ speaker: string; text: string }>;
  signals: string[];
  phase: string;
  customerContext?: Record<string, unknown>;
}

export async function generateSuggestions(context: TranscriptContext): Promise<Suggestion[]> {
  const prompt = `Conversation context:
Phase: ${context.phase}
Signals detected: ${context.signals.join(', ') || 'none'}
Recent exchange:
${context.recentUtterances.slice(-4).map((u) => `${u.speaker}: ${u.text}`).join('\n')}
${context.customerContext ? `Customer: ${JSON.stringify(context.customerContext)}` : ''}

Generate 2-3 actionable agent suggestions as JSON array:
[{
  "category": "negotiation|compliance|empathy|payment|escalation|closing",
  "title": "Short EN title",
  "titleTl": "Maikling Tagalog na pamagat",
  "body": "What to do and why (EN)",
  "bodyTl": "Ano ang gagawin at bakit (Tagalog)",
  "script": "Exact script to read (EN)",
  "scriptTl": "Eksaktong script na babasahin (Taglish)",
  "confidence": 0.0-1.0
}]`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.map((s: Omit<Suggestion, 'id' | 'conversationId' | 'timestamp'>) => ({
    ...s,
    id: uuidv4(),
    conversationId: context.conversationId,
    timestamp: new Date().toISOString(),
  }));
}
