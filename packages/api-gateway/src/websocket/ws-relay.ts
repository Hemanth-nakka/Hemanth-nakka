import { Server as HttpServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import { AgentPayload } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

interface AgentSocket extends WebSocket {
  agent?: AgentPayload;
  conversationIds: Set<string>;
}

export class WebSocketRelay {
  private readonly wss: WebSocketServer;
  private readonly subscriber: Redis;

  constructor(server: HttpServer, redis: Redis) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.subscriber = redis;
    this.setupRedisSubscriber();
    this.setupWebSocketServer();
  }

  private setupRedisSubscriber(): void {
    this.subscriber.psubscribe('agent-assist:suggestions:*', 'agent-assist:compliance:*');

    this.subscriber.on('pmessage', (_pattern, channel, message) => {
      const parts = channel.split(':');
      const conversationId = parts[parts.length - 1];

      this.wss.clients.forEach((rawClient) => {
        const client = rawClient as AgentSocket;
        if (
          client.readyState === WebSocket.OPEN &&
          client.conversationIds?.has(conversationId)
        ) {
          client.send(message);
        }
      });
    });
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (rawWs, req) => {
      const ws = rawWs as AgentSocket;
      ws.conversationIds = new Set();

      const url = new URL(req.url || '', 'http://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(4001, 'Missing token');
        return;
      }

      try {
        ws.agent = jwt.verify(token, JWT_SECRET) as AgentPayload;
      } catch {
        ws.close(4001, 'Invalid token');
        return;
      }

      ws.send(JSON.stringify({ type: 'connected', agent: ws.agent }));

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'subscribe' && msg.conversationId) {
            ws.conversationIds.add(msg.conversationId);
            ws.send(JSON.stringify({ type: 'subscribed', conversationId: msg.conversationId }));
          }
          if (msg.type === 'unsubscribe' && msg.conversationId) {
            ws.conversationIds.delete(msg.conversationId);
          }
        } catch {
          // ignore
        }
      });
    });
  }
}
