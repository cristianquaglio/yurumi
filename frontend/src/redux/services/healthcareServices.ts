import axios from 'axios';

import { patientsApi } from '../../api';
import { IHealthcareSystems } from '../../utils';

const createHealthcare = async (healthcareSystem: IHealthcareSystems) => {
    try {
        const { data } = await patientsApi.post(
            `/healthcare-systems`,
            healthcareSystem,
        );
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const findAllHealthcare = async () => {
    try {
        const { data } = await patientsApi.get(`/healthcare-systems`);
        return data;
    } catch (error) {
        return;
    }
};

const findHealthcare = async (healthcareId: string) => {
    try {
        const { data } = await patientsApi.get(
            `/healthcare-systems/${healthcareId}`,
        );
        return data;
    } catch (error) {
        return;
    }
};

const HealthcareSystemsService = {
    createHealthcare,
    findAllHealthcare,
    findHealthcare,
};

export default HealthcareSystemsService;
