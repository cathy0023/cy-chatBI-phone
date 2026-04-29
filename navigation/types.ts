import type { ChatMessage } from '../types/chat';

export type StackParamList = {
  Chat: undefined;
  SessionList: undefined;
  ChartDetail: {
    chartHtml: string;
    title?: string;
    records?: Record<string, unknown>[];
    columns?: string[];
  };
};
