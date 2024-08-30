import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRoutesProps {
    isAuthenticated: boolean;
}

export const PublicRoutes: React.FC<PublicRoutesProps> = ({
    isAuthenticated,
}) => {
    if (isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
};
