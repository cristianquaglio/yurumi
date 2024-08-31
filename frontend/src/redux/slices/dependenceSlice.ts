import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IDependence } from '../../utils/interfaces';
import DependenceService from '../services/dependenceServices';

interface dependenceState {
    dependences: IDependence[];
    isLoading: boolean;
    dependence: IDependence | undefined;
    hasError: boolean;
    error: string;
    isCreated: boolean;
    isUpdated: boolean;
    isUpdating: boolean;
    isDeleted: boolean;
}

const initialState: dependenceState = {
    dependences: [],
    isLoading: false,
    dependence: undefined,
    hasError: false,
    error: '',
    isCreated: false,
    isUpdated: false,
    isUpdating: false,
    isDeleted: false,
};

export const findAllDependences = createAsyncThunk(
    'dependence/findAllDependences',
    async () => {
        try {
            return await DependenceService.findAllDependences();
        } catch (error) {
            return [];
        }
    },
);

export const findDependence = createAsyncThunk(
    'dependence/findDependence',
    async (dependenceId: string) => {
        try {
            return await DependenceService.findDependence(dependenceId);
        } catch (error) {
            return undefined;
        }
    },
);

export const createDependence = createAsyncThunk(
    'dependence/createDependence',
    async (dependence: IDependence, thunkAPI) => {
        try {
            return await DependenceService.createDependence(dependence);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

export const updateDependence = createAsyncThunk(
    'dependence/updateDependence',
    async (
        {
            dependenceId,
            dependence,
        }: { dependenceId: string; dependence: IDependence },
        thunkAPI,
    ) => {
        try {
            return await DependenceService.updateDependence(
                dependenceId,
                dependence,
            );
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const deleteDependence = createAsyncThunk(
    'dependence/deleteDependence',
    async (dependenceId: string, thunkAPI) => {
        try {
            return await DependenceService.deleteDependence(dependenceId);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const dependenceSlice = createSlice({
    name: 'dependence',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(findAllDependences.fulfilled, (state, action) => {
                state.dependences = action.payload;
                state.isLoading = false;
            })
            .addCase(findAllDependences.pending, (state) => {
                state.dependences = [];
                state.isLoading = true;
            })
            .addCase(findDependence.fulfilled, (state, action) => {
                state.dependence = action.payload;
                state.isLoading = false;
            })
            .addCase(findDependence.pending, (state) => {
                state.dependence = undefined;
                state.isLoading = true;
            })
            .addCase(createDependence.fulfilled, (state) => {
                state.isLoading = false;
                state.hasError = false;
                state.isCreated = true;
            })
            .addCase(createDependence.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.isCreated = false;
            })
            .addCase(
                createDependence.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.hasError = true;
                    state.isCreated = false;
                    state.error = action.payload as string;
                },
            )
            .addCase(updateDependence.fulfilled, (state) => {
                state.hasError = false;
                state.isUpdated = true;
                state.isUpdating = false;
            })
            .addCase(updateDependence.pending, (state) => {
                state.hasError = false;
                state.isUpdated = false;
                state.isUpdating = true;
            })
            .addCase(
                updateDependence.rejected,
                (state, action: PayloadAction<any>) => {
                    state.hasError = true;
                    state.isUpdated = false;
                    state.isUpdating = false;
                    state.error = action.payload as string;
                },
            )
            .addCase(deleteDependence.fulfilled, (state) => {
                state.isDeleted = true;
            });
    },
});

export default dependenceSlice.reducer;
