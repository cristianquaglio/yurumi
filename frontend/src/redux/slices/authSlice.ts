import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import AuthService from '../services/authServices';
import { IUser } from '../../utils';

interface authState {
    user: IUser | undefined;
    isRegistered: boolean;
    isLoading: boolean;
    hasError: boolean;
    isRecovered: boolean;
    isEmailConfirmed: boolean;
    isPasswordChanged: boolean;
}

const initialState: authState = {
    user: Cookies.get('user')
        ? JSON.parse(Cookies.get('user') as string)
        : undefined,
    hasError: false,
    isEmailConfirmed: false,
    isLoading: false,
    isRecovered: false,
    isRegistered: false,
    isPasswordChanged: false,
};

export const signup = createAsyncThunk(
    'auth/signup',
    async (user: IUser, thunkAPI) => {
        try {
            return await AuthService.signup(user);
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

export const login = createAsyncThunk(
    'auth/login',
    async (
        { email, password }: { email: string; password: string },
        thunkAPI,
    ) => {
        try {
            const { token, refreshToken, user } = await AuthService.login(
                email,
                password,
            );
            Cookies.set('token', token, { secure: true, sameSite: 'None' });
            Cookies.set('refresh-token', refreshToken, {
                secure: true,
                sameSite: 'None',
            });
            Cookies.set('user', JSON.stringify(user), {
                secure: true,
                sameSite: 'None',
            });
            return { user };
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

export const confirmEmail = createAsyncThunk(
    'auth/confirm-email',
    async ({ token }: { token: string }, thunkAPI) => {
        try {
            return await AuthService.confirmEmail(token);
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

export const recoverAccount = createAsyncThunk(
    'auth/recover',
    async ({ email }: { email: string }) => {
        try {
            await AuthService.recoverAccount(email);
        } catch (error) {
            return;
        }
    },
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (password: string, thunkAPI) => {
        try {
            return await AuthService.changePassword(password);
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

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await AuthService.logout();
        Cookies.remove('user');
        Cookies.remove('token');
        Cookies.remove('refresh-token');
    } catch (error) {
        return error;
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.hasError = false;
                state.user = action.payload.user;
                state.isLoading = false;
            })
            .addCase(login.pending, (state) => {
                state.hasError = false;
                state.user = undefined;
                state.isLoading = true;
            })
            .addCase(login.rejected, (state) => {
                state.hasError = true;
                state.user = undefined;
                state.isLoading = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = undefined;
                state.hasError = false;
                state.isLoading = false;
            })
            .addCase(recoverAccount.fulfilled, (state) => {
                state.isRecovered = true;
                state.isLoading = false;
            })
            .addCase(recoverAccount.pending, (state) => {
                state.isRecovered = false;
                state.isLoading = true;
            })
            .addCase(recoverAccount.rejected, (state) => {
                state.isRecovered = true;
                state.isLoading = false;
            })
            .addCase(confirmEmail.fulfilled, (state) => {
                state.hasError = false;
                state.isEmailConfirmed = true;
                state.isLoading = false;
            })
            .addCase(confirmEmail.pending, (state) => {
                state.hasError = false;
                state.isEmailConfirmed = false;
                state.isLoading = true;
            })
            .addCase(confirmEmail.rejected, (state) => {
                state.hasError = true;
                state.isEmailConfirmed = false;
                state.isLoading = false;
            })
            .addCase(signup.fulfilled, (state) => {
                state.hasError = false;
                state.isRegistered = true;
                state.isLoading = false;
            })
            .addCase(signup.pending, (state) => {
                state.hasError = false;
                state.isRegistered = false;
                state.isLoading = true;
            })
            .addCase(signup.rejected, (state) => {
                state.hasError = true;
                state.isRegistered = false;
                state.isLoading = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isPasswordChanged = true;
                state.hasError = false;
                state.isLoading = false;
            })
            .addCase(changePassword.pending, (state) => {
                state.isPasswordChanged = false;
                state.hasError = false;
                state.isLoading = true;
            })
            .addCase(changePassword.rejected, (state) => {
                state.isPasswordChanged = false;
                state.hasError = true;
                state.isLoading = false;
            });
    },
});

export default authSlice.reducer;
