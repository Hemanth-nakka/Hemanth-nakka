import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { GenesysConversationEvent, GenesysTranscriptEvent } from '../types/genesys.types';

export class GenesysWebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    private readonly channelUrl: string,
    private readonly accessToken: string
  ) {
    super();
  }

  connect(): void {
    if (!this.channelUrl) return;

    this.ws = new WebSocket(this.channelUrl, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    this.ws.on('open', () => {
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.startHeartbeat();
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const event = JSON.parse(data.toString());
        const topic: string = event.topicName || '';

        if (topic.includes('v2.conversations.') && topic.endsWith('.transcription')) {
          this.emit('transcript', event as GenesysTranscriptEvent);
        } else if (topic.includes('v2.conversations.')) {
          this.emit('conversation', event as GenesysConversationEvent);
        }
      } catch {
        // ignore malformed messages
      }
    });

    this.ws.on('close', () => {
      this.stopHeartbeat();
      this.emit('disconnected');
      this.scheduleReconnect();
    });

    this.ws.on('error', (err) => {
      this.emit('error', err);
    });
  }

  disconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.stopHeartbeat();
    this.ws?.close();
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 30_000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30_000);
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => this.connect(), delay);
  }
}
