import Redis from 'ioredis';
import { NormalizedEvent } from '../types/genesys.types';

export class EventPublisher {
  constructor(private readonly redis: Redis) {}

  async publish(event: NormalizedEvent): Promise<void> {
    const payload = JSON.stringify(event);
    const channel = `agent-assist:transcript`;

    await Promise.all([
      this.redis.publish(channel, payload),
      this.redis.lpush(`agent-assist:history:${event.conversationId}`, payload),
      this.redis.ltrim(`agent-assist:history:${event.conversationId}`, 0, 99),
      this.redis.expire(`agent-assist:history:${event.conversationId}`, 7200),
    ]);

    if (event.type === 'conversation_start') {
      await this.redis.publish('agent-assist:conversation', payload);
    }
  }
}
