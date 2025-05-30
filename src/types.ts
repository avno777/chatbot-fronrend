export interface Session {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  avatar?: string;
}
