import { Alert, AlertTitle, Stack } from '@mui/material';

export const NotFoundPage = () => {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity='warning'>
                <AlertTitle>Error</AlertTitle>
                Registro inexistente
            </Alert>
        </Stack>
    );
};
