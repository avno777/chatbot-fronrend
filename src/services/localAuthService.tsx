import { v4 as uuid } from "uuid";

interface User {
  id: string;
  email: string;
  password: string;
}

const USERS_KEY = "users";

export const register = (email: string, password: string): boolean => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  if (users.find((u) => u.email === email)) return false;

  const newUser: User = { id: uuid(), email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const login = (email: string, password: string) => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;

  return {
    token: uuid(),
    user: { id: user.id, email: user.email },
  };
};
