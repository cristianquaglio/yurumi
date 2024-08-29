import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import UserService from '../services/userServices';
import { IUser } from '../../utils';

interface userState {
    users: IUser[];
    user: IUser | undefined;
    isLoading: boolean;
    hasError: boolean;
    isUpdating: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
}

const initialState: userState = {
    users: [],
    user: undefined,
    isLoading: false,
    hasError: false,
    isUpdating: false,
    isUpdated: false,
    isDeleted: false,
};

export const findAllAdminUsers = createAsyncThunk(
    'user/findAllAdminUsers',
    async () => {
        try {
            return await UserService.findAllAdminUsers();
        } catch (error) {
            return [];
        }
    },
);

export const findAdminUser = createAsyncThunk(
    'user/findAdminUser',
    async (userId: string) => {
        try {
            return await UserService.findOneAdminUser(userId);
        } catch (error) {
            return undefined;
        }
    },
);

export const updateAdminUser = createAsyncThunk(
    'user/updateAdminUser',
    async ({ userId, user }: { userId: string; user: IUser }, thunkAPI) => {
        try {
            return await UserService.updateAdminUser(userId, user);
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

export const deleteAdminUser = createAsyncThunk(
    'user/deleteAdminUser',
    async (userId: string, thunkAPI) => {
        try {
            return await UserService.deleteAdminUser(userId);
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

export const findAllUsers = createAsyncThunk('user/findAllUsers', async () => {
    try {
        return await UserService.findAllUsers();
    } catch (error) {
        return [];
    }
});

export const findUser = createAsyncThunk(
    'user/findUser',
    async (userId: string) => {
        try {
            return await UserService.findOneUser(userId);
        } catch (error) {
            return undefined;
        }
    },
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ userId, user }: { userId: string; user: IUser }, thunkAPI) => {
        try {
            return await UserService.updateUser(userId, user);
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

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (userId: string, thunkAPI) => {
        try {
            return await UserService.deleteUser(userId);
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(findAllAdminUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.isLoading = false;
                state.isDeleted = false;
            })
            .addCase(findAllAdminUsers.pending, (state) => {
                state.users = [];
                state.isLoading = true;
            })
            .addCase(findAdminUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(findAdminUser.pending, (state) => {
                state.user = undefined;
                state.isLoading = true;
            })
            .addCase(updateAdminUser.fulfilled, (state) => {
                state.hasError = false;
                state.isUpdated = true;
                state.isUpdating = false;
            })
            .addCase(updateAdminUser.pending, (state) => {
                state.hasError = false;
                state.isUpdated = false;
                state.isUpdating = true;
            })
            .addCase(updateAdminUser.rejected, (state) => {
                state.hasError = true;
                state.isUpdated = false;
                state.isUpdating = false;
            })
            .addCase(deleteAdminUser.fulfilled, (state) => {
                state.isDeleted = true;
            })
            .addCase(findAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.isLoading = false;
                state.isDeleted = false;
            })
            .addCase(findAllUsers.pending, (state) => {
                state.users = [];
                state.isLoading = true;
            })
            .addCase(findUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(findUser.pending, (state) => {
                state.user = undefined;
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.hasError = false;
                state.isUpdated = true;
                state.isUpdating = false;
            })
            .addCase(updateUser.pending, (state) => {
                state.hasError = false;
                state.isUpdated = false;
                state.isUpdating = true;
            })
            .addCase(updateUser.rejected, (state) => {
                state.hasError = true;
                state.isUpdated = false;
                state.isUpdating = false;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.isDeleted = true;
            });
    },
});

export default userSlice.reducer;
