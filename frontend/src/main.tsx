import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';

import router from './router';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline />
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>,
);
