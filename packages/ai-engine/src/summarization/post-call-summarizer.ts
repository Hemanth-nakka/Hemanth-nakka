import Anthropic from '@anthropic-ai/sdk';
import { PostCallSummary } from '../types/ai.types';

const client = new Anthropic();

export async function generatePostCallSummary(
  conversationId: string,
  transcript: Array<{ speaker: string; text: string }>,
  agentId?: string
): Promise<PostCallSummary> {
  const transcriptText = transcript.map((u) => `${u.speaker}: ${u.text}`).join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Summarize this collections call transcript. Respond in JSON only.

Transcript:
${transcriptText}

JSON format:
{
  "sentiment": "positive|neutral|negative",
  "keyTopics": ["topic1", "topic2"],
  "commitmentsMade": ["commitment1"],
  "followUpActions": ["action1"],
  "complianceFlags": ["flag if any BSP/NPC violation detected"],
  "summary": "2-3 sentence EN summary",
  "summaryTl": "2-3 pangungusap na Tagalog na buod"
}`,
      },
    ],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

  return {
    conversationId,
    agentId,
    sentiment: parsed.sentiment || 'neutral',
    keyTopics: parsed.keyTopics || [],
    commitmentsMade: parsed.commitmentsMade || [],
    followUpActions: parsed.followUpActions || [],
    complianceFlags: parsed.complianceFlags || [],
    summary: parsed.summary || '',
    summaryTl: parsed.summaryTl || '',
    timestamp: new Date().toISOString(),
  };
}
