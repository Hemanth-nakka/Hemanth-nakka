import express from 'express';
import Redis from 'ioredis';
import { ComplianceDetector } from './detector/compliance-detector';
import { COMPLIANCE_RULES } from './rules/compliance-rules';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const detector = new ComplianceDetector();

subscriber.subscribe('agent-assist:transcript', () => {
  console.log('compliance-engine subscribed');
});

subscriber.on('message', async (_ch, message) => {
  try {
    const event = JSON.parse(message);
    const { conversationId, text, speaker } = event;
    if (!text) return;

    const alerts = detector.check(conversationId, text, speaker);
    for (const alert of alerts) {
      await redis.publish(
        `agent-assist:compliance:${conversationId}`,
        JSON.stringify({ type: 'compliance_alert', alert })
      );
    }
  } catch (err) {
    console.error('compliance-engine error:', err);
  }
});

app.post('/check', (req, res) => {
  const { conversationId, text, speaker } = req.body;
  if (!conversationId || !text) return res.status(400).json({ error: 'conversationId and text required' });
  const alerts = detector.check(conversationId, text, speaker || 'agent');
  res.json({ alerts });
});

app.get('/rules', (_req, res) => {
  res.json({
    rules: COMPLIANCE_RULES.map((r) => ({
      id: r.id,
      regulation: r.regulation,
      category: r.category,
      severity: r.severity,
    })),
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'compliance-engine' }));

const PORT = parseInt(process.env.PORT || '4003');
app.listen(PORT, () => console.log(`compliance-engine listening on :${PORT}`));
