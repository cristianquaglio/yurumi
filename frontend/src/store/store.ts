import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '../redux/slices/authSlice';
import { dependenceSlice } from '../redux/slices/dependenceSlice';
import { userSlice } from '../redux/slices/userSlice';
import { healthcareSlice } from '../redux/slices/healthcareSlice';
import { patientSlice } from '../redux/slices/patientSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        dependence: dependenceSlice.reducer,
        healthcare: healthcareSlice.reducer,
        patient: patientSlice.reducer,
        user: userSlice.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
