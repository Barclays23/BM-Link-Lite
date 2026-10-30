import axiosApi from '../api/axios';
import type { CreateUrlData, ShortUrlData } from '../types/url.types';





export const urlsService = {
    async createURL(data: CreateUrlData): Promise<ShortUrlData> {
        const response = await axiosApi.post<ShortUrlData>('/urls', data);
        return response.data;
    },


    async getMyUrls(): Promise<ShortUrlData[]> {
        const response = await axiosApi.get<ShortUrlData[]>('/urls');
        return response.data;
    },
};