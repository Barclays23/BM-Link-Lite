import api from '../api/axios';
import type {
  AuthUser,
  LoginData,
  LoginResponse,
  RegisterData,
} from '../types/auth.types';





export const authService = {
    async register(data: RegisterData): Promise<void> {
        const response = await api.post('/auth/register', data);

        return response.data;
    },

    async login(data: LoginData): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            '/auth/login',
            data,
        );

        return response.data;
    },

    async getCurrentUser(): Promise<AuthUser> {
        const response = await api.get<AuthUser>('/auth/me');
        return response.data;
    },

    async logout(): Promise<void> {
        const response = await api.post('/auth/logout');
        return response.data;
    },
};