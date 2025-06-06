import axios from "axios";
import { getConfig } from "./configService";
import type { Message } from "../types";

export const getMessages = async (sessionId: string) => {
  try {
    const response = await axios.get<Message[]>(
      `${getConfig().apiBaseUrl}/chat/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
};

export const saveMessages = async ({
  userId,
  agentId,
  sessionId,
  role,
  message,
}: {
  userId: string;
  agentId: string;
  sessionId: string;
  role: string;
  message: string;
}) => {
  try {
    const response = await axios.post<Message>(
      `${getConfig().apiBaseUrl}/chat`,
      { userId, agentId, sessionId, role, message }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};
export const sendMessage = async ({
  user_id,
  agent_id,
  session_id,
  role,
  message,
  timestamp,
}: {
  user_id: string;
  agent_id: string;
  session_id: string;
  role: "user" | "bot";
  message: string;
  timestamp: string;
}) => {
  const res = await axios.post(`${getConfig().apiBaseUrl}/chat`, {
    user_id,
    agent_id,
    session_id,
    role,
    message,
    response: "", // server sẽ phản hồi lại
    rate: 0,
    feedback: "",
    timestamp,
  });
  return res.data; // { message: "response text" }
};

export const getMessageById = async (sessionId: string) => {
  const res = await axios.get(`${getConfig().apiBaseUrl}/chat/${sessionId}`);
  return res.data; // { id, role, content }
};
