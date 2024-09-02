import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Link, Typography } from '@mui/material';

import { AppDispatch, RootState } from '../../store/store';
import { emailActivation } from '../../redux/slices/authSlice';
import { AuthLayout } from '../../components/layouts';

export const EmailActivationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, isEmailActivated, hasError } = useSelector(
        (state: RootState) => state.auth,
    );
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    useEffect(() => {
        if (token) dispatch(emailActivation({ token }));
        return;
    }, [token, dispatch]);

    return (
        <AuthLayout>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
                {isLoading && <CircularProgress />}
                {hasError && (
                    <>
                        <Typography
                            variant='h1'
                            component='h1'
                            fontSize={80}
                            fontWeight={200}
                        >
                            Ups! |
                        </Typography>
                        <Typography marginLeft={2}>
                            el token suministrado ya no es válido.
                        </Typography>
                    </>
                )}
                {isEmailActivated && (
                    <>
                        <Typography
                            variant='h1'
                            component='h1'
                            fontSize={80}
                            fontWeight={200}
                        >
                            OK |
                        </Typography>
                        <Typography marginLeft={2}>
                            Su cuenta de correo ha sido confirmada{' '}
                            <Link href='/login' underline='none'>
                                Puede iniciar sesión.
                            </Link>
                        </Typography>
                    </>
                )}
            </Box>
        </AuthLayout>
    );
};
