export interface ShortUrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}



export interface CreateUrlData {
  originalUrl: string;
}