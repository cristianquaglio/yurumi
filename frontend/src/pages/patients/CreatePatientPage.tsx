import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

import { MainLayout } from '../../components/layouts';
import { BackButton } from '../../components/ui';
import {
    listBloodTypes,
    listDocumentTypes,
    listGenders,
    listNationalities,
} from '../../utils';
import { isValidEmail } from '../../utils/validators';

type formData = {
    firstName: string;
    lastName: string;
    gender: string;
    bloodType: string;
    birthDay: string; // String para almacenar en y-m-d
    birthTime: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
    healthcareSystem: string;
    healthcareNumber: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
};

export const CreatePatientPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        control,
    } = useForm<formData>();

    const onCreatePatient = (data: formData) => {
        console.log(data);
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit(onCreatePatient)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography
                                variant='h4'
                                component='h4'
                                textAlign='center'
                            >
                                Cargar paciente
                            </Typography>
                        </Grid>

                        {/* Nombre */}
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

                        {/* Apellido */}
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

                        {/* Género */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                label='Género'
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                {...register('gender', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.gender}
                                helperText={errors.gender?.message}
                            >
                                {listGenders().map(({ id, value }) => (
                                    <MenuItem key={id} value={id}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Grupo Sanguíneo */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                label='Grupo sanguíneo'
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                {...register('bloodType', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.bloodType}
                                helperText={errors.bloodType?.message}
                            >
                                {listBloodTypes().map(({ id, value }) => (
                                    <MenuItem key={id} value={id}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Fecha de Nacimiento */}
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name='birthDay'
                                    control={control}
                                    defaultValue={''}
                                    rules={{
                                        required:
                                            'La fecha de nacimiento es requerida',
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            label='Fecha de nacimiento'
                                            value={
                                                field.value
                                                    ? dayjs(field.value)
                                                    : null
                                            }
                                            onChange={(date: Dayjs | null) => {
                                                const formattedDate = date
                                                    ? date.format('YYYY-MM-DD')
                                                    : null;
                                                field.onChange(formattedDate); // Guardar como y-m-d
                                            }}
                                            format='DD-MM-YYYY' // Mostrar como d-m-y
                                            slotProps={{
                                                textField: {
                                                    variant: 'filled',
                                                    fullWidth: true,
                                                    error: !!errors.birthDay,
                                                    helperText:
                                                        errors.birthDay
                                                            ?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Hora de Nacimiento */}
                        <Grid item xs={12}>
                            <TextField
                                label='Hora nacimiento'
                                variant='filled'
                                fullWidth
                                {...register('birthTime')}
                                error={!!errors.birthTime}
                                helperText={errors.birthTime?.message}
                            />
                        </Grid>

                        {/* Nacionalidad */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                label='Nacionalidad'
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                {...register('nationality', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.nationality}
                                helperText={errors.nationality?.message}
                            >
                                {listNationalities().map(({ id, value }) => (
                                    <MenuItem key={id} value={id}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Tipo de documento */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                label='Tipo de documento'
                                key=''
                                variant='filled'
                                defaultValue=''
                                fullWidth
                                {...register('documentType', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.documentType}
                                helperText={errors.documentType?.message}
                            >
                                {listDocumentTypes().map(
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

                        {/* Número de documento */}
                        <Grid item xs={12}>
                            <TextField
                                label='Número de documento'
                                variant='filled'
                                fullWidth
                                {...register('documentNumber', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.documentNumber}
                                helperText={errors.documentNumber?.message}
                            />
                        </Grid>

                        {/* TODO: add healthcareSystem */}

                        {/* Número de OS */}
                        <Grid item xs={12}>
                            <TextField
                                label='Número de OS'
                                variant='filled'
                                fullWidth
                                {...register('healthcareNumber', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.healthcareNumber}
                                helperText={errors.healthcareNumber?.message}
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
                            <TextField
                                label='Teléfono'
                                variant='filled'
                                fullWidth
                                {...register('phoneNumber')}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Pais'
                                variant='filled'
                                fullWidth
                                {...register('country')}
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Provincia'
                                variant='filled'
                                fullWidth
                                {...register('state')}
                                error={!!errors.state}
                                helperText={errors.state?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Ciudad'
                                variant='filled'
                                fullWidth
                                {...register('city')}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Código Postal'
                                variant='filled'
                                fullWidth
                                {...register('zipCode')}
                                error={!!errors.zipCode}
                                helperText={errors.zipCode?.message}
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
                            {/* <Box display='flex' justifyContent='space-around'>
                                <BackButton link='' disabled={isLoading} />
                                <Button
                                    type='submit'
                                    variant='outlined'
                                    color='success'
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <CircularProgress />
                                    ) : (
                                        'Cargar paciente'
                                    )}
                                </Button>
                            </Box> */}
                            <Box display='flex' justifyContent='space-around'>
                                <BackButton link='' disabled={false} />
                                <Button
                                    type='submit'
                                    variant='outlined'
                                    color='success'
                                    disabled={false}
                                >
                                    {false ? (
                                        <CircularProgress />
                                    ) : (
                                        'Cargar paciente'
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </MainLayout>
    );
};
