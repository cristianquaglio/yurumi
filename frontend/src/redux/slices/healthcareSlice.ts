import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IHealthcareSystems } from '../../utils';
import HealthcareSystemsService from '../services/healthcareServices';

interface healthcareState {
    healthcares: IHealthcareSystems[];
    healthcare: IHealthcareSystems | undefined;
    isLoading: boolean;
    hasError: boolean;
    error: string;
}

const initialState: healthcareState = {
    healthcares: [],
    healthcare: undefined,
    isLoading: false,
    hasError: false,
    error: '',
};

export const createHealthcareSystem = createAsyncThunk(
    'healthcare/createHealthcare',
    async (healthcare: IHealthcareSystems, thunkAPI) => {
        try {
            return await HealthcareSystemsService.createHealthcare(healthcare);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

export const findAllHealthcares = createAsyncThunk(
    'healthcare/findAllHealthcares',
    async () => {
        try {
            return await HealthcareSystemsService.findAllHealthcare();
        } catch (error) {
            return [];
        }
    },
);

export const findHealthcare = createAsyncThunk(
    'healthcare/findHealthcare',
    async (healthcareId: string) => {
        try {
            return await HealthcareSystemsService.findHealthcare(healthcareId);
        } catch (error) {
            return undefined;
        }
    },
);

export const healthcareSlice = createSlice({
    name: 'healthcare',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createHealthcareSystem.fulfilled, (state) => {
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(createHealthcareSystem.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(
                createHealthcareSystem.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.hasError = true;
                    state.error = action.payload as string;
                },
            )
            .addCase(findAllHealthcares.fulfilled, (state, action) => {
                state.healthcares = action.payload;
                state.isLoading = false;
            })
            .addCase(findAllHealthcares.pending, (state) => {
                state.healthcares = [];
                state.isLoading = true;
            })
            .addCase(findHealthcare.fulfilled, (state, action) => {
                state.healthcare = action.payload;
                state.isLoading = false;
            })
            .addCase(findHealthcare.pending, (state) => {
                state.healthcare = undefined;
                state.isLoading = true;
            });
    },
});

export default healthcareSlice.reducer;
