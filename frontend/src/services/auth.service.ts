import axiosApi from '../api/axios';
import type {
    AuthResponse,
    CurrentUserResponse,
    LoginData,
    RegisterData,
} from '../types/auth.types';





export const authService = {
    async register(data: RegisterData): Promise<void> {
        const response = await axiosApi.post('/auth/register', data);

        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await axiosApi.post<AuthResponse>(
            '/auth/login',
            data,
        );

        return response.data;
    },

    async getCurrentUser(): Promise<CurrentUserResponse> {
        const response = await axiosApi.get<CurrentUserResponse>('/auth/me');
        return response.data;
    },

    async logout(): Promise<void> {
        const response = await axiosApi.post('/auth/logout');
        return response.data;
    },  
};