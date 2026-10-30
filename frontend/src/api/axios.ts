import axios, { type InternalAxiosRequestConfig } from 'axios';


const API_URL = import.meta.env.VITE_API_URL;



const axiosApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}


const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';
export const AUTH_SESSION_EXPIRED_EVENT = 'auth-session-expired';

export const saveAuthSession = (
  accessToken: string,
  user: unknown,
) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};


export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};


let refreshPromise: Promise<string> | null = null;



axiosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});



axiosApi.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config as RetryConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/logout')
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axios
                .post(
                    `${API_URL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                    },
                )
                .then((response) => {
                    const { accessToken, user } = response.data;

                    saveAuthSession(accessToken, user);

                    return accessToken as string;
                })
                .finally(() => {
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return axiosApi(originalRequest);

        } catch (refreshError) {
            clearAuthSession();

            window.dispatchEvent(
                new Event(AUTH_SESSION_EXPIRED_EVENT),
            );

            return Promise.reject(refreshError);
        }
    },
);



export default axiosApi;