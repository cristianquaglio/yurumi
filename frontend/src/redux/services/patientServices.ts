import axios from 'axios';

import { patientsApi } from '../../api';
import { IPatient } from '../../utils';

const createPatient = async (patient: IPatient) => {
    try {
        const { data } = await patientsApi.post(`/patients`, patient);
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) throw new Error(`Bad Request error`);
    }
};

const findAllPatients = async () => {
    try {
        const { data } = await patientsApi.get(`/patients`);
        return data;
    } catch (error) {
        return;
    }
};

const findPatient = async (patientId: string) => {
    try {
        const { data } = await patientsApi.get(`/patients/${patientId}`);
        return data;
    } catch (error) {
        return;
    }
};

const PatientsService = {
    createPatient,
    findAllPatients,
    findPatient,
};

export default PatientsService;
