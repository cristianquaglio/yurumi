import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { CircleOutlined, ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { validators } from '../../utils';
import { AppDispatch, RootState } from '../../store/store';
import { login } from '../../redux/slices/authSlice';

type formData = {
    email: string;
    password: string;
};

export const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, hasError, isLogged } = useSelector(
        (state: RootState) => state.auth,
    );

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>();

    useEffect(() => {
        if (isLogged) navigate('/');
    }, [isLogged]);

    const onLoginUser = ({ email, password }: formData) => {
        dispatch(login({ email, password }));
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box
                    sx={{
                        width: 350,
                        padding: '10px 20px',
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h6'>
                                Bienvenido a Yurumi
                            </Typography>
                            {hasError && (
                                <Chip
                                    label='Credenciales no válidas'
                                    color='error'
                                    icon={<ErrorOutline />}
                                    className='fadeIn'
                                    sx={{ display: 'flex' }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Correo electrónico'
                                type='email'
                                variant='filled'
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validators.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Clave'
                                type='password'
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 8,
                                        message: 'Mínimo 8 caracteres',
                                    },
                                    validate: validators.isPassword,
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                disabled={isLoading}
                                type='submit'
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                {isLoading ? (
                                    <CircleOutlined />
                                ) : (
                                    'Iniciar sesión'
                                )}
                            </Button>
                        </Grid>
                        <Divider sx={{ width: '100%', mb: 2, mt: 2 }} />
                        <Grid item xs={12} margin='none'>
                            <Box display='flex' justifyContent='space-between'>
                                <Link href='/signup' underline='none'>
                                    <Button color='success'>
                                        Crear cuenta
                                    </Button>
                                </Link>
                                <Link href='/recover-account' underline='none'>
                                    <Button color='error'>
                                        Olvidó su clave?
                                    </Button>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};
