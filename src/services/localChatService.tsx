import type { Message, Session } from "../types";

const SESSION_KEY = "chat_sessions";
const MESSAGE_PREFIX = "chat_messages_";

export const getSessions = (userId: string): Session[] => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return [];
  return JSON.parse(raw).filter((s: Session) => s.userId === userId);
};

export const createSession = (userId: string, name: string): Session => {
  const sessions = getAllSessions();
  const newSession: Session = {
    id: Date.now().toString(),
    userId,
    name,
  };
  const updated = [...sessions, newSession];
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return newSession;
};

export const deleteSession = (sessionId: string) => {
  const sessions = getAllSessions().filter((s) => s.id !== sessionId);
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  localStorage.removeItem(`${MESSAGE_PREFIX}${sessionId}`);
};

export const getMessages = (sessionId: string): Message[] => {
  const raw = localStorage.getItem(`${MESSAGE_PREFIX}${sessionId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveMessages = (sessionId: string, messages: Message[]) => {
  localStorage.setItem(
    `${MESSAGE_PREFIX}${sessionId}`,
    JSON.stringify(messages)
  );
};

// internal helper
const getAllSessions = (): Session[] => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : [];
};
