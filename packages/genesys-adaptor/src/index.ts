import express from 'express';
import Redis from 'ioredis';
import { GenesysWebSocketClient } from './websocket/genesys-ws-client';
import { EventPublisher } from './events/event-publisher';
import { transformTranscriptEvent, buildDigitalEvent } from './events/event-transformer';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const publisher = new EventPublisher(redis);

// Voice: Genesys WebSocket
const channelUrl = process.env.GENESYS_NOTIFICATION_CHANNEL_URL || '';
const accessToken = process.env.GENESYS_ACCESS_TOKEN || '';

if (channelUrl) {
  const wsClient = new GenesysWebSocketClient(channelUrl, accessToken);
  wsClient.on('transcript', async (event) => {
    const normalized = transformTranscriptEvent(event);
    if (normalized) await publisher.publish(normalized);
  });
  wsClient.connect();
}

// Digital: webhook
app.post('/webhook/digital', async (req, res) => {
  const { conversationId, channelType, agentId, customerId, message, language } = req.body;

  if (!conversationId || !message) {
    return res.status(400).json({ error: 'conversationId and message are required' });
  }

  const event = buildDigitalEvent({ conversationId, channelType, agentId, customerId, message, language });
  await publisher.publish(event);

  res.json({ ok: true, eventId: event.timestamp });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'genesys-adaptor' }));

const PORT = parseInt(process.env.PORT || '4001');
app.listen(PORT, () => console.log(`genesys-adaptor listening on :${PORT}`));
