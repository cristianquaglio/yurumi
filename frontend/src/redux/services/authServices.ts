import axios from 'axios';

import { api } from '../../api';
import { IUser } from '../../utils';

const getCurrentUser = async () => {
    try {
        const { data } = await api.get(`/auth/current`);
        return data;
    } catch (error) {
        return;
    }
};

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
    try {
        const { data } = await api.post(`/auth/login`, {
            email,
            password,
        });
        if (!data) throw new Error(`Credentials are not valid`);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
        else throw new Error(`Credentials are not valid`);
    }
};

const emailActivation = async (token: string) => {
    return await api.get(`/auth/email-activation?token=${token}`);
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
    getCurrentUser,
    signup,
    login,
    emailActivation,
    recoverAccount,
    changePassword,
    logout,
};

export default AuthService;
