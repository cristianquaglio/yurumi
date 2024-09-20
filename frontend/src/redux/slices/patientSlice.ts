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
            );
    },
});

export default patientSlice.reducer;
