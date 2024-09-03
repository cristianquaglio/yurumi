import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { MultipleCheck } from '../../components/ui';
import { Roles, userRolesList, validators } from '../../utils';
import { AppDispatch, RootState } from '../../store/store';
import { findAllDependences } from '../../redux/slices/dependenceSlice';
import { checkAdmin } from '../../redux/slices/userSlice';
import { signup } from '../../redux/slices/authSlice';

type formData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    dependence: string;
    roles: string[];
};

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const { dependences } = useSelector((state: RootState) => state.dependence);
    const { hasAdmin } = useSelector((state: RootState) => state.user);

    const { isLoading, hasError, isRegistered } = useSelector(
        (state: RootState) => state.auth,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>();

    const [selectedRoles, setSelectedRoles] = useState<string[]>([Roles.USER]);
    const [dependence, setDependence] = useState('');

    const handleSelectRole = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedRoles.includes(evt.target.value)) {
            setSelectedRoles(
                [...selectedRoles].filter((role) => role !== evt.target.value),
            );
        } else {
            setSelectedRoles([...selectedRoles, evt.target.value]);
        }
    };

    useEffect(() => {
        dispatch(findAllDependences());
    }, []);

    useEffect(() => {
        dispatch(checkAdmin(dependence));
        setSelectedRoles([Roles.USER]);
    }, [dependence]);

    useEffect(() => {
        if (isRegistered) navigate('/login');
    }, [isRegistered]);

    const onChangeDependences = (event: ChangeEvent<HTMLInputElement>) => {
        setDependence(event.target.value);
    };

    const onSignUp = (data: formData) => {
        if (selectedRoles) {
            data.roles = selectedRoles;
        } else {
            data.roles = [Roles.USER];
        }
        dispatch(signup(data));
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onSignUp)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h4' component='h4'>
                                Crea tu usuario
                            </Typography>
                            <Chip
                                label='Registro existente'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: hasError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Nombre'
                                variant='filled'
                                fullWidth
                                {...register('firstName', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Apellido'
                                variant='filled'
                                fullWidth
                                {...register('lastName', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Alias'
                                variant='filled'
                                fullWidth
                                {...register('username', {})}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
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
                            <TextField
                                select
                                label='Dependencia'
                                key=''
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                {...register('dependence', {
                                    required: 'Este campo es requerido',
                                })}
                                onChange={onChangeDependences}
                                error={!!errors.dependence}
                                helperText={errors.dependence?.message}
                            >
                                {dependences.map(({ _id, shortName }: any) => (
                                    <MenuItem key={_id} value={_id}>
                                        {shortName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {hasAdmin && (
                            <Grid item xs={12}>
                                <FormControl
                                    variant='filled'
                                    fullWidth
                                    component='fieldset'
                                    {...register('roles', {})}
                                    error={!!errors.roles}
                                >
                                    <FormLabel component='legend'>
                                        Roles
                                    </FormLabel>
                                    <FormGroup>
                                        <Grid sx={{ display: 'flex' }}>
                                            <MultipleCheck
                                                data={userRolesList()}
                                                handleSelect={handleSelectRole}
                                            />
                                        </Grid>
                                    </FormGroup>
                                    <FormHelperText>
                                        Seleccione al menos un valor. Tenga
                                        presente que el rol otorgará permisos de
                                        acceso al sistema.
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Box display='flex' justifyContent='space-between'>
                                <Button
                                    type='submit'
                                    // variant='outlined'
                                    color='success'
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircularProgress />
                                    ) : (
                                        'Registrar usuario'
                                    )}
                                </Button>
                                <Button
                                    type='button'
                                    // variant='outlined'
                                    href='/login'
                                    color='warning'
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircularProgress />
                                    ) : (
                                        'Ya tiene una cuenta?'
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};
