import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IHealthcareSystems } from '../../utils';
import HealthcareSystemsService from '../services/healthcareServices';

interface healthcareState {
    healthcare: IHealthcareSystems | undefined;
    isLoading: boolean;
    hasError: boolean;
    error: string;
    isCreated: boolean;
}

const initialState: healthcareState = {
    healthcare: undefined,
    isLoading: false,
    hasError: false,
    error: '',
    isCreated: false,
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

export const healthcareSlice = createSlice({
    name: 'healthcare',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createHealthcareSystem.fulfilled, (state) => {
                state.isCreated = true;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(createHealthcareSystem.pending, (state) => {
                state.isCreated = false;
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(
                createHealthcareSystem.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isCreated = false;
                    state.isLoading = false;
                    state.hasError = true;
                    state.error = action.payload as string;
                },
            );
    },
});

export default healthcareSlice.reducer;
