import axios from 'axios';

import { api } from '../../api';
import { IDependence } from '../../utils';

const findAllDependences = async () => {
    try {
        const { data } = await api.get(`/dependences`);
        return data;
    } catch (error) {
        return;
    }
};

const findDependence = async (dependenceId: string) => {
    try {
        const { data } = await api.get(`/dependences/${dependenceId}`);
        return data;
    } catch (error) {
        return;
    }
};

const createDependence = async (dependence: IDependence) => {
    try {
        const { data } = await api.post(`/dependences`, dependence);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const updateDependence = async (
    dependenceId: string,
    dependence: IDependence,
) => {
    try {
        const { data } = await api.patch(
            `/dependences/${dependenceId}`,
            dependence,
        );
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const deleteDependence = async (dependenceId: string) => {
    try {
        const { data } = await api.delete(`/dependences/${dependenceId}`);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const DependenceService = {
    findAllDependences,
    findDependence,
    createDependence,
    updateDependence,
    deleteDependence,
};

export default DependenceService;
