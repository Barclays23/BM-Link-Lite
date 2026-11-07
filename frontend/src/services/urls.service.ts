import axiosApi from '../api/axios';
import type { CreateUrlData, PaginatedUrlsResponse, ShortUrlData } from '../types/url.types';





export const urlsService = {
    async createURL(data: CreateUrlData): Promise<ShortUrlData> {
        const response = await axiosApi.post<ShortUrlData>('/urls', data);
        return response.data;
    },


    async deleteURL(urlId: string) {
        const response = await axiosApi.delete(`/urls/${urlId}`);
        return response.data;
    },



    async getMyUrls(page = 1, limit = 5, search = ''): Promise<PaginatedUrlsResponse> {
        const response = await axiosApi.get('/urls', {
            params: {
                page,
                limit,
                search,
            },
        });

        return response.data;
    },
};