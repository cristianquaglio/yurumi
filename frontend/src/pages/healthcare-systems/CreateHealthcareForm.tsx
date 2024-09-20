import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { BackButton, PhoneField } from '../../components/ui';
import { isValidEmail } from '../../utils/validators';
import { createHealthcareSystem } from '../../redux/slices/healthcareSlice';

type formData = {
    code: string;
    fullName: string;
    shortName: string;
    address: string;
    phones: string[];
    email: string;
    web: string;
};

interface Props {
    onClose: (newValue?: string) => void;
    mode: 'dialog' | 'page';
}

export const CreateHealthcareForm: FC<Props> = ({ onClose, mode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, hasError, error } = useSelector(
        (state: RootState) => state.healthcare,
    );

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<formData>();

    const onCreateHealthcare = async (data: formData) => {
        const healthcareSystem = {
            code: data.code,
            fullName: data.fullName,
            shortName: data.shortName,
            contactData: {
                email: data?.email || undefined,
                address: data?.address || undefined,
                phones: data?.phones || undefined,
                web: data?.web || undefined,
            },
        };

        // Dispatch para crear la Obra Social
        const resultAction = await dispatch(
            createHealthcareSystem(healthcareSystem),
        );

        // Si la creación fue exitosa, cierra el diálogo o redirige
        if (createHealthcareSystem.fulfilled.match(resultAction)) {
            const createdId = resultAction.payload?._id; // Asumiendo que el _id es parte del payload
            if (mode === 'dialog') {
                onClose(createdId); // Pasa el _id al cerrar el diálogo
            } else {
                navigate('/healthcare'); // Redirige si está en modo "page"
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onCreateHealthcare)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            variant='h4'
                            component='h4'
                            textAlign='center'
                        >
                            Cargar Obra Social
                        </Typography>
                        <Chip
                            label={`${
                                error === 'Bad Request error'
                                    ? 'Registro existente'
                                    : 'Error creando el registro'
                            }`}
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{ display: hasError ? 'flex' : 'none' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Código de Obra Social'
                            variant='filled'
                            fullWidth
                            {...register('code', {
                                required: 'Este campo es requerido',
                                minLength: {
                                    value: 2,
                                    message: 'Mínimo 2 caracteres',
                                },
                            })}
                            error={!!errors.code}
                            helperText={errors.code?.message}
                        />
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
                            label='Correo electrónico'
                            type='email'
                            variant='filled'
                            fullWidth
                            {...register('email', {
                                validate: (value) => {
                                    if (!value) return true;
                                    return (
                                        isValidEmail(value) ||
                                        'El correo no parece ser válido'
                                    );
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PhoneField
                            register={register}
                            errors={errors}
                            setValue={setValue}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Dirección'
                            variant='filled'
                            fullWidth
                            {...register('address')}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Sitio web'
                            variant='filled'
                            fullWidth
                            {...register('web')}
                            error={!!errors.web}
                            helperText={errors.web?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display='flex' justifyContent='space-around'>
                            {mode === 'page' && (
                                <BackButton
                                    link='healthcare'
                                    disabled={isLoading}
                                />
                            )}
                            <Button
                                type='submit'
                                variant='outlined'
                                color='success'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress />
                                ) : (
                                    'Cargar Obra Social'
                                )}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
};
