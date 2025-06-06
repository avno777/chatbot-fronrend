export interface Session {
  id: string;
  userId: string;
  name: string;
}

export interface Message {
  id?: string;
  userId: string;
  agentId: string;
  sessionId: string;
  role: "user" | "bot";
  content: string;
  rate?: number;
  feedback?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}
