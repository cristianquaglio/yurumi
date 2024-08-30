import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
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

import { AppDispatch, RootState } from '../../store/store';
import {
    findDependence,
    updateDependence,
} from '../../redux/slices/dependenceSlice';

type formData = {
    type: string;
    tributaryType: string;
    tributaryId: string;
    fullName: string;
    shortName: string;
    status: string;
};

const UpdateDependencePage = () => {
    const navigate = useNavigate();

    const params = useParams();
    const dependenceId = params.dependenceId ? params.dependenceId : '';

    const dispatch = useDispatch<AppDispatch>();
    const { dependence, isLoading, hasError, isUpdated, isUpdating } =
        useSelector((state: RootState) => state.dependence);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<formData>();

    useEffect(() => {
        if (isUpdated) navigate('/dependences');
    }, [isUpdated]);

    useEffect(() => {
        dispatch(findDependence(dependenceId ? dependenceId : ''));
    }, []);

    useEffect(() => {
        reset(dependence);
    }, [dependence]);

    const onUpdateDependence = (data: formData) => {
        dispatch(updateDependence({ dependenceId, dependence: data }));
    };

    return (
        <MainLayout>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit(onUpdateDependence)} noValidate>
                    <Box sx={{ width: 350, padding: '10px 20px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h4' component='h4'>
                                    Actualizar datos
                                </Typography>
                                <Chip
                                    label='Error actualizando los datos'
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
                                    defaultValue={dependence?.type || ''}
                                    fullWidth
                                    {...register('type', {
                                        required: 'Este campo es requerido',
                                    })}
                                    error={!!errors.type}
                                    helperText={errors.type?.message}
                                >
                                    {[
                                        { id: '', value: '--SELECCIONE--' },
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
                                    label='Nombre reducido'
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
                                    label='Tipo de documento'
                                    key=''
                                    variant='filled'
                                    defaultValue={
                                        dependence?.tributaryType || ''
                                    }
                                    fullWidth
                                    {...register('tributaryType', {
                                        required: 'Este campo es requerido',
                                    })}
                                    error={!!errors.tributaryType}
                                    helperText={errors.tributaryType?.message}
                                >
                                    {[
                                        { id: '', value: '--SELECCIONE--' },
                                        { id: 'CUIT', value: 'CUIT' },
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
                                    label='Doc. fiscal'
                                    variant='filled'
                                    fullWidth
                                    defaultValue=''
                                    {...register('tributaryId', {
                                        required: 'Este campo es requerido',
                                    })}
                                    error={!!errors.tributaryId}
                                    helperText={errors.tributaryId?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label='Estado'
                                    key=''
                                    variant='filled'
                                    fullWidth
                                    defaultValue={dependence?.status || ''}
                                    {...register('status', {
                                        required: 'Este campo es requerido',
                                    })}
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    {[
                                        { id: '', value: '--SELECCIONE--' },
                                        { id: 'ACTIVE', value: 'ACTIVO' },
                                        { id: 'INACTIVE', value: 'INACTIVO' },
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
                                <Button
                                    type='submit'
                                    variant='outlined'
                                    color='success'
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <CircularProgress />
                                    ) : (
                                        'Actualizar datos'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            )}
        </MainLayout>
    );
};

export default UpdateDependencePage;
