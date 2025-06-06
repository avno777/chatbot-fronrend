// src/types/User.ts
export interface User {
  id: string;
  email: string;
  role: string;
  // Thêm các trường khác nếu có (vd: name, avatar, etc.)
}

export interface chatReq {
  user_id: string;
  agent_id: string;
  message: string;
  response: string;
  rate: number;
  feedback: string;
  timestamp: string;
}
