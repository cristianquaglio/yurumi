import axios, { InternalAxiosRequestConfig } from 'axios';

import { IApiResponse } from '../utils';

// Create axios instances for different microservices
export const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_AUTH_URI,
    withCredentials: true, // for authentication
});

export const patientsApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_PATIENTS_URI,
    withCredentials: true,
});

// Add a request interceptor
const addInterceptors = (apiInstance: any) => {
    apiInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig<any>) => {
            // You can add global settings here (e.g., auth headers)
            return config;
        },
        (error: any) => Promise.reject(error),
    );

    apiInstance.interceptors.response.use(
        (response: any) => response,
        async (error: { config: any; response: { status: number } }) => {
            const originalRequest = error.config;
            if (
                (error.response?.status === 401 ||
                    error.response?.status === 403) &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                try {
                    const { data } = await authApi.get<IApiResponse>(
                        `${import.meta.env.VITE_BACKEND_AUTH_URI}/auth/refresh`,
                    );
                    if (data.statusCode === 200)
                        return apiInstance(originalRequest);
                } catch (error) {
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        },
    );
};

// Add interceptors to each API instance
addInterceptors(authApi);
addInterceptors(patientsApi);
