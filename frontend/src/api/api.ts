import axios, { InternalAxiosRequestConfig } from 'axios';

import { IApiResponse } from '../utils';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URI,
    withCredentials: true, // let to use cookies
});

// Add a request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        // you can add settings here
        return config;
    },
    (error) => Promise.reject(error),
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await api.get<IApiResponse>(
                    `${import.meta.env.VITE_BACKEND_API_URI}/auth/refresh`,
                );
                if (data.statusCode === 200) return api(originalRequest);
            } catch (error) {
                return error;
            }
        }

        return Promise.reject(error);
    },
);
