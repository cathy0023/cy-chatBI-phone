import React, { createContext, useContext, type ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../types/chat';

type ChatContextValue = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  loadSessionMessages: (sessionId: string) => Promise<void>;
  sessionId: string | undefined;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return ctx;
}
