import axios from 'axios';

import { api } from '../../api';
import { IUser } from '../../utils';

const signup = async (user: IUser) => {
    try {
        const { data } = await api.post(
            `/auth/signup?dependence=${user.dependence}`,
            user,
        );
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const login = async (email: string, password: string) => {
    const { data } = await api.post(`/auth/login`, {
        email,
        password,
    });
    const { tokens, user } = data;
    const { token, refreshToken } = tokens;
    return { token, refreshToken, user };
};

const confirmEmail = async (token: string) => {
    return await api.get(`/auth/confirm-email?token=${token}`);
};

const recoverAccount = async (email: string) => {
    await api.post(`/auth/recover`, {
        email,
    });
};

const changePassword = async (password: string) => {
    try {
        const { data } = await api.post(`/auth/change-password`, { password });
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const logout = async () => {
    return await api.get(`/auth/logout`);
};

const AuthService = {
    signup,
    login,
    confirmEmail,
    recoverAccount,
    changePassword,
    logout,
};

export default AuthService;
