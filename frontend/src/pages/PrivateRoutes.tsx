import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRoutesProps {
    isAuthenticated: boolean;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
