import EventSource from 'react-native-sse';
import { API_BASE } from '../constants/api';
import type { LoadingPhase } from '../types/chat';

export type SSEHandlers = {
  onSession: (sessionId: string) => void;
  onStatus: (phase: LoadingPhase) => void;
  onText: (text: string) => void;
  onData: (data: {
    sql: string;
    records: Record<string, unknown>[];
    columns: string[];
  }) => void;
  onChart: (html: string) => void;
  onError: (error: string) => void;
  onDone: () => void;
};

export function connectChat(
  message: string,
  sessionId: string | undefined,
  handlers: SSEHandlers,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const es: any = new EventSource(`${API_BASE}/api/chat`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  });

  es.addEventListener('session', (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      handlers.onSession(data.sessionId);
    }
  });

  es.addEventListener('status', (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      handlers.onStatus(data.phase as LoadingPhase);
    }
  });

  es.addEventListener('text', (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      handlers.onText(data.text);
    }
  });

  es.addEventListener('data', (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      handlers.onData({
        sql: data.sql || '',
        records: data.records || [],
        columns: data.columns || [],
      });
    }
  });

  es.addEventListener('chart', (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      handlers.onChart(data.html);
    }
  });

  es.addEventListener('error', (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      handlers.onError(data.error || 'Unknown error');
    }
    es.close();
  });

  es.addEventListener('done', () => {
    handlers.onDone();
    es.close();
  });

  return es;
}
