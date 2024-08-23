import { createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import PrivateRoutes from './pages/PrivateRoutes';
import PublicRoutes from './pages/PublicRoutes';
import EmailActivationPage from './pages/auth/EmailActivationPage';
import RecoverAccountPage from './pages/auth/RecoverAccountPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

const isAuthenticated = true;

const router = createBrowserRouter([
    {
        element: <PublicRoutes isAuthenticated={isAuthenticated} />,
        children: [
            {
                path: '/signup',
                element: <SignUpPage />,
            },
            {
                path: '/email-activation',
                element: <EmailActivationPage />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/recover-account',
                element: <RecoverAccountPage />,
            },
        ],
    },
    {
        element: <PrivateRoutes isAuthenticated={isAuthenticated} />,
        children: [
            {
                path: '/change-password',
                element: <ChangePasswordPage />,
            },
            {
                path: '/',
                element: <HomePage />,
            },
        ],
    },
]);

export default router;
