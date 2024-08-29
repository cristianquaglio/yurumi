import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { MainLayout } from '../../components/layouts';
// import { companyDocumentTypesList, companyTypesList } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createDependence } from '../../redux/slices/dependenceSlice';

type formData = {
    type: string;

    shortName: string;

    fullName: string;

    tributaryType: string;

    tributaryId: string;
};

export const CreateDependencePage = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, hasError, isCreated } = useSelector(
        (state: RootState) => state.dependence,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>();

    useEffect(() => {
        if (isCreated) navigate('/dependences');
    }, [isCreated]);

    const onCreateDependence = (data: formData) => {
        dispatch(createDependence(data));
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit(onCreateDependence)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h4' component='h4'>
                                Crear dependencia
                            </Typography>
                            <Chip
                                label='Error creando la dependencia'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: hasError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label='Tipo'
                                key=''
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                // SelectProps={{ ...SelectProps, multiple: true }}
                                {...register('type', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.type}
                                helperText={errors.type?.message}
                            >
                                {[
                                    { id: 'PUBLIC', value: 'Publico' },
                                    { id: 'PRIVATE', value: 'Privado' },
                                    { id: 'MIXT', value: 'Mixto' },
                                ].map(
                                    ({
                                        id,
                                        value,
                                    }: {
                                        id: string;
                                        value: string;
                                    }) => (
                                        <MenuItem key={id} value={id}>
                                            {value}
                                        </MenuItem>
                                    ),
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Nombre completo'
                                variant='filled'
                                fullWidth
                                {...register('fullName', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Nombre corto'
                                variant='filled'
                                fullWidth
                                {...register('shortName', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.shortName}
                                helperText={errors.shortName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label='Tipo de documento fiscal'
                                key=''
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                {...register('tributaryType', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.tributaryType}
                                helperText={errors.tributaryType?.message}
                            >
                                {[{ id: 'CUIT', value: 'CUIT' }].map(
                                    ({
                                        id,
                                        value,
                                    }: {
                                        id: string;
                                        value: string;
                                    }) => (
                                        <MenuItem key={id} value={id}>
                                            {value}
                                        </MenuItem>
                                    ),
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Documento fiscal'
                                variant='filled'
                                fullWidth
                                {...register('tributaryId', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.tributaryId}
                                helperText={errors.tributaryId?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                variant='outlined'
                                color='success'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress />
                                ) : (
                                    'Crear dependencia'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </MainLayout>
    );
};
