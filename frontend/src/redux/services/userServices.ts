import axios from 'axios';
import { api } from '../../api';
import { IUser } from '../../utils';

const findAllAdminUsers = async () => {
    try {
        const { data } = await api.get(`/users/admin`);
        return data;
    } catch (error) {
        return;
    }
};

const findOneAdminUser = async (userId: string) => {
    try {
        const { data } = await api.get(`/users/admin/${userId}`);
        return data;
    } catch (error) {
        return;
    }
};

const updateAdminUser = async (userId: string, user: IUser) => {
    try {
        const { data } = await api.patch(`/users/admin/${userId}`, user);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const deleteAdminUser = async (userId: string) => {
    try {
        const { data } = await api.delete(`/users/admin/${userId}`);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const findAllUsers = async () => {
    try {
        const { data } = await api.get(`/users`);
        return data;
    } catch (error) {
        return;
    }
};

const findOneUser = async (userId: string) => {
    try {
        const { data } = await api.get(`/users/${userId}`);
        return data;
    } catch (error) {
        return;
    }
};

const updateUser = async (userId: string, user: IUser) => {
    try {
        const { data } = await api.patch(`/users/${userId}`, user);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const deleteUser = async (userId: string) => {
    try {
        const { data } = await api.delete(`/users/${userId}`);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
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
};

export default UserService;
