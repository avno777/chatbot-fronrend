import { v4 as uuid } from "uuid";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

const SESSION_KEY = "sessions";
const MESSAGE_KEY = "messages";

// 🟢 Lấy danh sách các phiên chat của 1 user
export const getSessions = (userId: string) => {
  const allSessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  return Object.values(allSessions[userId] || {});
};

// 🟢 Tạo phiên chat mới
export const createSession = (userId: string, name: string) => {
  const id = uuid();
  const allSessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  if (!allSessions[userId]) allSessions[userId] = {};
  allSessions[userId][id] = { id, name };

  localStorage.setItem(SESSION_KEY, JSON.stringify(allSessions));
  return allSessions[userId][id];
};

// 🟢 Xóa 1 phiên chat
export const deleteSession = (sessionId: string) => {
  const allSessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  const allMessages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "{}");

  for (const userId in allSessions) {
    if (allSessions[userId][sessionId]) {
      delete allSessions[userId][sessionId];
    }
  }

  delete allMessages[sessionId];

  localStorage.setItem(SESSION_KEY, JSON.stringify(allSessions));
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(allMessages));
};

// 🟢 Lấy tin nhắn của 1 phiên
export const getMessages = (sessionId: string): Message[] => {
  const allMessages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "{}");
  return allMessages[sessionId] || [];
};

// 🟢 Thêm tin nhắn vào phiên
export const addMessage = (
  sessionId: string,
  role: "user" | "bot",
  content: string
): Message => {
  const allMessages = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "{}");
  if (!allMessages[sessionId]) allMessages[sessionId] = [];

  const msg: Message = {
    id: uuid(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  allMessages[sessionId].push(msg);
  localStorage.setItem(MESSAGE_KEY, JSON.stringify(allMessages));
  return msg;
};
