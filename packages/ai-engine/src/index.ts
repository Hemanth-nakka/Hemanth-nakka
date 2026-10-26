import express from 'express';
import Redis from 'ioredis';
import { generateSuggestions } from './suggestions/suggestion-generator';
import { generatePostCallSummary } from './summarization/post-call-summarizer';
import { processUtterance, detectNegotiationPhase } from './nlp/taglish-processor';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const conversationExchanges = new Map<string, number>();

subscriber.subscribe('agent-assist:transcript', () => {
  console.log('ai-engine subscribed to agent-assist:transcript');
});

subscriber.on('message', async (_channel, message) => {
  try {
    const event = JSON.parse(message);
    const { conversationId, text, speaker } = event;

    if (speaker !== 'customer') return;

    const exchanges = (conversationExchanges.get(conversationId) || 0) + 1;
    conversationExchanges.set(conversationId, exchanges);

    const { signals } = processUtterance(text);
    const phase = detectNegotiationPhase(exchanges, signals);

    const history = await redis.lrange(`agent-assist:history:${conversationId}`, 0, 9);
    const recentUtterances = history.reverse().map((h) => {
      const e = JSON.parse(h);
      return { speaker: e.speaker, text: e.text };
    });

    const suggestions = await generateSuggestions({
      conversationId,
      recentUtterances,
      signals,
      phase,
    });

    if (suggestions.length > 0) {
      await redis.publish(
        `agent-assist:suggestions:${conversationId}`,
        JSON.stringify({ type: 'suggestions', suggestions })
      );
    }
  } catch (err) {
    console.error('ai-engine error:', err);
  }
});

app.post('/summarize', async (req, res) => {
  const { conversationId, transcript, agentId } = req.body;
  if (!conversationId || !transcript) {
    return res.status(400).json({ error: 'conversationId and transcript required' });
  }
  const summary = await generatePostCallSummary(conversationId, transcript, agentId);
  res.json(summary);
});

app.post('/suggest', async (req, res) => {
  const suggestions = await generateSuggestions(req.body);
  res.json({ suggestions });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ai-engine' }));

const PORT = parseInt(process.env.PORT || '4002');
app.listen(PORT, () => console.log(`ai-engine listening on :${PORT}`));
