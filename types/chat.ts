export type LoadingPhase =
  | 'generating_sql'
  | 'executing'
  | 'analyzing'
  | 'generating_chart'
  | 'done'
  | 'error';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  phase?: LoadingPhase;
  sql?: string;
  records?: Record<string, unknown>[];
  columns?: string[];
  chartHtml?: string;
};

export type SessionInfo = {
  id: string;
  title: string | null;
  created_at: string;
  message_count: number;
};

export type SessionMessage = {
  id: string;
  role: string;
  content: string;
  chartHtml?: string | null;
  records?: Record<string, unknown>[] | null;
  columns?: string[] | null;
  sql?: string | null;
  createdAt?: string;
};

export const PHASE_LABELS: Record<LoadingPhase, string> = {
  generating_sql: '正在理解您的问题...',
  executing: '正在查询数据...',
  analyzing: '正在分析数据...',
  generating_chart: '正在生成图表...',
  done: '',
  error: '',
};

export function getPhaseLabel(phase?: LoadingPhase): string {
  if (!phase || phase === 'done' || phase === 'error') return '';
  return PHASE_LABELS[phase];
}
