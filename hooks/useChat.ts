import { useState, useCallback, useRef } from 'react';
import { EventSource } from 'react-native-sse';
import { connectChat } from '../services/sse-client';
import { getSessionMessages } from '../services/api';
import type { ChatMessage, LoadingPhase } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          phase: 'generating_sql' as LoadingPhase,
        },
      ]);

      try {
        const es = connectChat(content.trim(), sessionId, {
          onSession: (id) => setSessionId(id),
          onStatus: (phase) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, phase } : m,
              ),
            );
          },
          onText: (text) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: text } : m,
              ),
            );
          },
          onData: (data) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      sql: data.sql,
                      records: data.records,
                      columns: data.columns,
                    }
                  : m,
              ),
            );
          },
          onChart: (html) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, chartHtml: html } : m,
              ),
            );
          },
          onError: (errMsg) => {
            setError(errMsg);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: `处理出错: ${errMsg}`,
                      phase: 'error' as LoadingPhase,
                    }
                  : m,
              ),
            );
          },
          onDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, phase: 'done' as LoadingPhase }
                  : m,
              ),
            );
          },
        });

        eventSourceRef.current = es;
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errMsg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `请求失败: ${errMsg}`,
                  phase: 'error' as LoadingPhase,
                }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
        eventSourceRef.current = null;
      }
    },
    [isLoading, sessionId],
  );

  const clearMessages = useCallback(() => {
    eventSourceRef.current?.close();
    setMessages([]);
    setSessionId(undefined);
    setError(null);
  }, []);

  const loadSessionMessages = useCallback(
    async (targetSessionId: string) => {
      eventSourceRef.current?.close();
      setIsLoading(true);
      try {
        const rawMessages = await getSessionMessages(targetSessionId);
        const loaded: ChatMessage[] = rawMessages.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          phase: 'done' as LoadingPhase,
          chartHtml: m.chartHtml ?? undefined,
          records: m.records ?? undefined,
          columns: m.columns ?? undefined,
          sql: m.sql ?? undefined,
        }));
        setMessages(loaded);
        setSessionId(targetSessionId);
        setError(null);
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : 'Failed to load session';
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    loadSessionMessages,
    sessionId,
  };
}
