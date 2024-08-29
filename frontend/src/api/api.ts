import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URI,
    // withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        const token = Cookies.get('Authentication');
        if (token) config.headers['Authentication'] = token;
        return config;
    },
    (error) => Promise.reject(error),
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const previousRefreshToken = Cookies.get('RefreshToken');
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URI}/auth/refresh`,
                    {
                        headers: {
                            Authentication: previousRefreshToken,
                        },
                    },
                );
                const { token, refreshToken } = data;
                Cookies.set('token', token, { secure: true, sameSite: 'None' });
                Cookies.set('RefreshToken', refreshToken, {
                    secure: true,
                    sameSite: 'None',
                });
                // Retry the original request with the new token
                originalRequest.headers.Authentication = token;
                return axios(originalRequest);
            } catch (error) {
                // Handle refresh token error or redirect to login
                return error;
            }
        }

        return Promise.reject(error);
    },
);
