import axios from "axios";

const API_URL = "https://your-backend.com/api/chat"; // Đổi URL thành backend thực tế

export const getSessions = async () => {
  const res = await axios.get(`${API_URL}/sessions`);
  return res.data; // [{ id, name }]
};

export const getMessages = async (sessionId: string) => {
  const res = await axios.get(`${API_URL}/sessions/${sessionId}/messages`);
  return res.data; // [{ id, role, content }]
};

export const sendMessage = async (sessionId: string, content: string) => {
  const res = await axios.post(`${API_URL}/sessions/${sessionId}/messages`, { content });
  return res.data; // { id, role, content }
};

export const createSession = async (name: string) => {
  const res = await axios.post(`${API_URL}/sessions`, { name });
  return res.data; // { id, name }
};

export const deleteSession = async (sessionId: string) => {
  const res = await axios.delete(`${API_URL}/sessions/${sessionId}`);
  return res.data;
};

export const sendFeedback = async (
  messageId: string,
  rating: number,
  feedback: string
) => {
  const res = await axios.post(`/api/chat/messages/${messageId}/feedback`, {
    rating,
    feedback,
  });
  return res.data;
};