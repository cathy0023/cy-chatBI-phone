import { API_BASE } from '../constants/api';
import type { SessionInfo, SessionMessage } from '../types/chat';

export async function getSessions(): Promise<SessionInfo[]> {
  const res = await fetch(`${API_BASE}/api/sessions`);
  if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
  const data = await res.json();
  return data.sessions || [];
}

export async function createSession(title?: string): Promise<SessionInfo> {
  const res = await fetch(`${API_BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title || null }),
  });
  if (!res.ok) throw new Error(`Failed to create session: ${res.status}`);
  return res.json();
}

export async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/sessions?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete session: ${res.status}`);
}

export async function getSessionMessages(
  sessionId: string,
): Promise<SessionMessage[]> {
  const res = await fetch(
    `${API_BASE}/api/sessions/${sessionId}/messages`,
  );
  if (!res.ok) throw new Error(`Failed to load messages: ${res.status}`);
  const data = await res.json();
  return data.messages || [];
}
