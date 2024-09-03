import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from '../store/store';

export const PublicRoutes: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (user?.firstName) {
        return <Navigate replace to='/' />;
    }

    return <Outlet />;
};
