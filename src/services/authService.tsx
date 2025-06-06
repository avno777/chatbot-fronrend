import axios from "axios";
import { getConfig } from "./configService";

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${getConfig().apiBaseUrl}/auth/login`, {
    email,
    password,
  });
  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await axios.post(`${getConfig().apiBaseUrl}/auth/register`, {
    email,
    password,
  });
  return res.data;
};
