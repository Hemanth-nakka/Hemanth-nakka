import { useEffect, useRef } from 'react';
import { useAgentStore } from '../store/useAgentStore';

const RETRY_DELAYS = [2000, 4000, 8000, 16000, 30000];

export function useWebSocket() {
  const { token, conversation, addSuggestions, addComplianceAlert, setWsConnected } = useAgentStore();
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token || !conversation) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws'}?token=${token}`;

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
        setWsConnected(true);
        ws.send(JSON.stringify({ type: 'subscribe', conversationId: conversation!.conversationId }));
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'suggestions') addSuggestions(msg.suggestions);
          if (msg.type === 'compliance_alert') addComplianceAlert(msg.alert);
        } catch { /* ignore */ }
      };

      ws.onclose = () => {
        setWsConnected(false);
        const delay = RETRY_DELAYS[Math.min(retryRef.current, RETRY_DELAYS.length - 1)];
        retryRef.current++;
        timerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [token, conversation?.conversationId]);
}
