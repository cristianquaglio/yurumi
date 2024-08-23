import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRoutesProps {
    isAuthenticated: boolean;
}

const PublicRoutes: React.FC<PublicRoutesProps> = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
};

export default PublicRoutes;
