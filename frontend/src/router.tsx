import { createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ChangePassword from './pages/auth/ChangePassword';
import EmailActivation from './pages/auth/EmailActivation';
import LoginPage from './pages/auth/LoginPage';
import RecoverAccount from './pages/auth/RecoverAccount';
import SignUpPage from './pages/auth/SignUpPage';
import PrivateRoutes from './pages/PrivateRoutes';
import PublicRoutes from './pages/PublicRoutes';

const isAuthenticated = false;

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
                element: <EmailActivation />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/recover-account',
                element: <RecoverAccount />,
            },
        ],
    },
    {
        element: <PrivateRoutes isAuthenticated={isAuthenticated} />,
        children: [
            {
                path: '/change-password',
                element: <ChangePassword />,
            },
            {
                path: '/',
                element: <HomePage />,
            },
        ],
    },
]);

export default router;
