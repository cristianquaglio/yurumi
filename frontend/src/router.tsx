import { createBrowserRouter } from 'react-router-dom';

import {
    ChangePasswordPage,
    CreateDependencePage,
    DependencePage,
    EmailActivationPage,
    HomePage,
    ListDependencesPage,
    LoginPage,
    PrivateRoutes,
    PublicRoutes,
    RecoverAccountPage,
    SignUpPage,
    UpdateDependencePage,
} from './pages';

const router = createBrowserRouter([
    {
        element: <PublicRoutes />,
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
        element: <PrivateRoutes />,
        children: [
            {
                path: '/change-password',
                element: <ChangePasswordPage />,
            },
            {
                path: 'dependences',
                element: <ListDependencesPage />,
            },
            {
                path: 'dependences/create',
                element: <CreateDependencePage />,
            },
            {
                path: 'dependences/:dependenceId',
                element: <DependencePage />,
            },
            {
                path: 'dependences/update/:dependenceId',
                element: <UpdateDependencePage />,
            },
            {
                path: '/',
                element: <HomePage />,
            },
        ],
    },
]);

export default router;
