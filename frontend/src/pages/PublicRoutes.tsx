import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { AppDispatch, RootState } from '../store/store';
import { getCurrentUser } from '../redux/slices/userSlice';

export const PublicRoutes: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, isLoading } = useSelector(
        (state: RootState) => state.user,
    );

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    if (isLoading) return <CircularProgress />;

    return currentUser ? <Navigate replace to='/' /> : <Outlet />;
};
