import axios from 'axios';

import { authApi } from '../../api';
import { IUser } from '../../utils';

const getCurrentUser = async () => {
    try {
        const { data } = await authApi.get(`/auth/current`);
        return data;
    } catch (error) {
        return;
    }
};

const signup = async (user: IUser) => {
    try {
        const { data } = await authApi.post(
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
        const { data } = await authApi.post(`/auth/login`, {
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
    return await authApi.get(`/auth/email-activation?token=${token}`);
};

const recoverAccount = async (email: string) => {
    await authApi.post(`/auth/recover`, {
        email,
    });
};

const changePassword = async (password: string) => {
    try {
        const { data } = await authApi.post(`/auth/change-password`, {
            password,
        });
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const logout = async () => {
    try {
        return await authApi.get(`/auth/logout`);
    } catch (error) {
        throw new Error();
    }
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
