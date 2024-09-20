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

const PatientsService = {
    createPatient,
};

export default PatientsService;
