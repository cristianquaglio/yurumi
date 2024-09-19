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

const HealthcareSystemsService = { createHealthcare };

export default HealthcareSystemsService;
