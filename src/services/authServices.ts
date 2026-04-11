import api from "@/api/axios";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.type";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', payload);
    return response.data.data;
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', payload);
    return response.data.data;
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};