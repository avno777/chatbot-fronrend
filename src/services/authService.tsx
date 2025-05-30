import axios from "axios";

const API_BASE = "https://your-backend.com/api"; // thay bằng URL backend thật

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/register`, { email, password });
  return res.data;
};
