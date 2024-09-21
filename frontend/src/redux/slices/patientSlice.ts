import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IPatient } from '../../utils';
import PatientsService from '../services/patientServices';

interface patientState {
    patients: IPatient[];
    isLoading: boolean;
    patient: IPatient | undefined;
    hasError: boolean;
    error: string;
    isCreated: boolean;
}

const initialState: patientState = {
    patients: [],
    isLoading: false,
    patient: undefined,
    hasError: false,
    error: '',
    isCreated: false,
};

export const createPatient = createAsyncThunk(
    'patient/createPatient',
    async (patient: IPatient, thunkAPI) => {
        try {
            return await PatientsService.createPatient(patient);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

export const findAllPatients = createAsyncThunk(
    'patient/findAllPatients',
    async (searchTerm?: string) => {
        try {
            return await PatientsService.findAllPatients(searchTerm);
        } catch (error) {
            return [];
        }
    },
);

export const findPatient = createAsyncThunk(
    'patient/findPatient',
    async (patientId: string) => {
        try {
            return await PatientsService.findPatient(patientId);
        } catch (error) {
            return undefined;
        }
    },
);

export const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createPatient.fulfilled, (state) => {
                state.isLoading = false;
                state.hasError = false;
                state.isCreated = true;
            })
            .addCase(createPatient.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.isCreated = false;
            })
            .addCase(
                createPatient.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.hasError = true;
                    state.isCreated = false;
                    state.error = action.payload as string;
                },
            )
            .addCase(findAllPatients.fulfilled, (state, action) => {
                state.patients = action.payload;
                state.isLoading = false;
            })
            .addCase(findAllPatients.pending, (state) => {
                state.patients = [];
                state.isLoading = true;
            })
            .addCase(findPatient.fulfilled, (state, action) => {
                state.patient = action.payload;
                state.isLoading = false;
            })
            .addCase(findPatient.pending, (state) => {
                state.patient = undefined;
                state.isLoading = true;
            });
    },
});

export default patientSlice.reducer;
