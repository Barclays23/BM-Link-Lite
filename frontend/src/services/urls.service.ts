import api from '../api/axios';
import type { CreateUrlData, ShortUrlData } from '../types/url.types';





export const urlsService = {
    async create(data: CreateUrlData): Promise<ShortUrlData> {
        const response = await api.post<ShortUrlData>('/urls', data);
        return response.data;
    },

    
    async getMyUrls(): Promise<ShortUrlData[]> {
        const response = await api.get<ShortUrlData[]>('/urls');
        return response.data;
    },
};