import { v4 as uuid } from "uuid";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

const SESSION_KEY = "sessions";
const MESSAGE_KEY = "messages";

export const getSessions = (userId: string) => {
  const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  return Object.values(sessions[userId] || {});
};

export const createSession = (userId: string, name: string) => {
  const id = uuid();
  const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  if (!sessions[userId]) sessions[userId] = {};
  sessions[userId][id] = { id, name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  return sessions[userId][id];
};

export const deleteSession = (sessionId: string) => {
  const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  const messages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "{}");

  for (const userId in sessions) {
    if (sessions[userId][sessionId]) {
      delete sessions[userId][sessionId];
      break;
    }
  }

  delete messages[sessionId];
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
};

export const getMessages = (sessionId: string): Message[] => {
  const messages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "{}");
  return messages[sessionId] || [];
};

export const addMessage = (
  sessionId: string,
  role: "user" | "bot",
  content: string
): Message => {
  const messages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "{}");
  if (!messages[sessionId]) messages[sessionId] = [];

  const newMessage: Message = {
    id: uuid(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  messages[sessionId].push(newMessage);
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
  return newMessage;
};
