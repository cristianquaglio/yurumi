import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import AuthService from '../services/authServices';
import { ILoginPayload, IUser } from '../../utils';

interface authState {
    user: ILoginPayload | undefined;
    isRegistered: boolean;
    isLoading: boolean;
    hasError: boolean;
    isRecovered: boolean;
    isEmailActivated: boolean;
    isPasswordChanged: boolean;
}

const initialState: authState = {
    user: Cookies.get('user')
        ? JSON.parse(Cookies.get('user') as string)
        : undefined,
    hasError: false,
    isEmailActivated: false,
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
            const user = await AuthService.login(email, password);
            Cookies.set('user', JSON.stringify(user), {
                secure: true,
                sameSite: 'None',
            });
            console.log({ user });
            return { user };
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            console.log({ message });
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const emailActivation = createAsyncThunk(
    'auth/email-activation',
    async ({ token }: { token: string }, thunkAPI) => {
        try {
            return await AuthService.emailActivation(token);
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
                state.user = action.payload.user;
                state.hasError = false;
                state.isLoading = false;
            })
            .addCase(login.pending, (state) => {
                state.user = undefined;
                state.hasError = false;
                state.isLoading = true;
            })
            .addCase(login.rejected, (state) => {
                state.user = undefined;
                state.hasError = true;
                state.isLoading = false;
            })
            .addCase(logout.fulfilled, (state) => {
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
            .addCase(emailActivation.fulfilled, (state) => {
                state.hasError = false;
                state.isEmailActivated = true;
                state.isLoading = false;
            })
            .addCase(emailActivation.pending, (state) => {
                state.hasError = false;
                state.isEmailActivated = false;
                state.isLoading = true;
            })
            .addCase(emailActivation.rejected, (state) => {
                state.hasError = true;
                state.isEmailActivated = false;
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
