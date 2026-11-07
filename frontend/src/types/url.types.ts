export interface ShortUrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}



export interface PaginatedUrlsResponse {
  data: ShortUrlData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface CreateUrlData {
  originalUrl: string;
}