import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from '../store/store';

export const PrivateRoutes: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user?.firstName) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
};
