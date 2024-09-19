import { createBrowserRouter } from 'react-router-dom';

import {
    ChangePasswordPage,
    CreateDependencePage,
    DependencePage,
    EmailActivationPage,
    HomePage,
    ListDependencesPage,
    LoginPage,
    SignUpPage,
    RecoverAccountPage,
    UpdateDependencePage,
    PublicRoutes,
    PrivateRoutes,
    DependencesRoute,
    HealthcareRoute,
    CreateHealthcarePage,
    PatientsRoute,
    CreatePatientPage,
    PatientPage,
    ListPatientsPage,
} from './pages';

export const router = createBrowserRouter([
    {
        element: <PublicRoutes />,
        children: [
            { path: '/signup', element: <SignUpPage /> },
            { path: '/email-activation', element: <EmailActivationPage /> },
            { path: '/login', element: <LoginPage /> },
            { path: '/recover-account', element: <RecoverAccountPage /> },
        ],
    },
    {
        element: <PrivateRoutes />,
        children: [
            { path: '/change-password', element: <ChangePasswordPage /> },
            {
                path: 'dependences',
                element: <DependencesRoute />,
                children: [
                    {
                        path: 'create',
                        element: <CreateDependencePage />,
                    },
                    {
                        path: ':dependenceId',
                        element: <DependencePage />,
                    },
                    {
                        path: 'update/:dependenceId',
                        element: <UpdateDependencePage />,
                    },
                    { path: '', element: <ListDependencesPage /> },
                ],
            },
            {
                path: 'healthcare',
                element: <HealthcareRoute />,
                children: [
                    {
                        path: 'create',
                        element: <CreateHealthcarePage />,
                    },
                    // TODO: other healthcare pages
                ],
            },
            {
                path: 'patients',
                element: <PatientsRoute />,
                children: [
                    {
                        path: 'create',
                        element: <CreatePatientPage />,
                    },
                    {
                        path: ':patientId',
                        element: <PatientPage />,
                    },
                    {
                        path: '',
                        element: <ListPatientsPage />,
                    },
                ],
            },
            { path: '/', element: <HomePage /> },
        ],
    },
]);
