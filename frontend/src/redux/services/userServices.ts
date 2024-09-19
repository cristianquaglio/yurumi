import axios from 'axios';

import { authApi } from '../../api';
import { IUser } from '../../utils';

const findAllAdminUsers = async () => {
    try {
        const { data } = await authApi.get(`/users/admin`);
        return data;
    } catch (error) {
        return;
    }
};

const findOneAdminUser = async (userId: string) => {
    try {
        const { data } = await authApi.get(`/users/admin/${userId}`);
        return data;
    } catch (error) {
        return;
    }
};

const updateAdminUser = async (userId: string, user: IUser) => {
    try {
        const { data } = await authApi.patch(`/users/admin/${userId}`, user);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const deleteAdminUser = async (userId: string) => {
    try {
        const { data } = await authApi.delete(`/users/admin/${userId}`);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const findAllUsers = async () => {
    try {
        const { data } = await authApi.get(`/users`);
        return data;
    } catch (error) {
        return;
    }
};

const findOneUser = async (userId: string) => {
    try {
        const { data } = await authApi.get(`/users/${userId}`);
        return data;
    } catch (error) {
        return;
    }
};

const updateUser = async (userId: string, user: IUser) => {
    try {
        const { data } = await authApi.patch(`/users/${userId}`, user);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const deleteUser = async (userId: string) => {
    try {
        const { data } = await authApi.delete(`/users/${userId}`);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const checkAdmin = async (dependence: string) => {
    try {
        const { data } = await authApi.get(
            `/users/check-admin?dependence=${dependence}`,
        );
        return data;
    } catch (error) {
        return;
    }
};

const UserService = {
    findAllAdminUsers,
    findOneAdminUser,
    updateAdminUser,
    deleteAdminUser,
    findAllUsers,
    findOneUser,
    updateUser,
    deleteUser,
    checkAdmin,
};

export default UserService;
