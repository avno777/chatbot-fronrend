import axios from "axios";
import { getConfig } from "./configService";
import type { Session } from "../types";

export const getSessions = async (userId: string) => {
    try {
        const response = await axios.get<Session[]>(`${getConfig().apiBaseUrl}/sessions/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        throw error;
    }
}

export const createSession = async (userId: string, name: string) => {
    try {
        const response = await axios.post<Session>(`${getConfig().apiBaseUrl}/sessions`, { userId, name });
        return response.data;
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }
}

export const deleteSession = async (sessionId: string) => {
    try {
        const response = await axios.delete(`${getConfig().apiBaseUrl}/sessions/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
    }
}