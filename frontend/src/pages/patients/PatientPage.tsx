import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Typography,
    Box,
    Paper,
} from '@mui/material';

import { AppDispatch, RootState } from '../../store/store';
import { MainLayout } from '../../components/layouts';
import { BackButton, NotFoundPage } from '../../components/ui';
import { findPatient } from '../../redux/slices/patientSlice';
import {
    documentTypes,
    genders,
    nationalities,
} from '../../utils/handlers/patients';
import { formatAddress, formatDate } from '../../utils';

export const PatientPage = () => {
    const params = useParams();
    const patientId = params.patientId ? params.patientId : '';
    const dispatch = useDispatch<AppDispatch>();

    const { isLoading, patient } = useSelector(
        (state: RootState) => state.patient,
    );

    useEffect(() => {
        dispatch(findPatient(patientId ? patientId : ''));
    }, [dispatch, patientId]);

    return (
        <MainLayout>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Card
                    sx={{
                        maxWidth: 800,
                        margin: 'auto',
                        mt: 4,
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    {patient ? (
                        <>
                            <CardContent>
                                <Typography
                                    variant='h5'
                                    component='div'
                                    color='primary'
                                    sx={{ textAlign: 'center', mb: 2 }}
                                >
                                    {`Paciente: ${patient.firstName} ${patient.lastName}`}
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Genero:</strong>{' '}
                                            {genders(patient.gender)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Grupo Sanguíneo:</strong>{' '}
                                            {patient.bloodType}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Nacionalidad:</strong>{' '}
                                            {nationalities(patient.nationality)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>{`${documentTypes(
                                                patient.documentType,
                                            )}: `}</strong>
                                            {`${patient.documentNumber}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>
                                                Fecha / Hora de Nacimiento:
                                            </strong>{' '}
                                            {`${formatDate(patient.birthDay)} ${
                                                patient?.birthTime
                                            }`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Obra Social:</strong>{' '}
                                            {`${patient.healthcareSystem.shortName} - ${patient.healthcareNumber}`}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Box mt={4}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            backgroundColor: '#192231',
                                            padding: '1.5rem',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            color='primary'
                                            sx={{ mb: 2 }}
                                        >
                                            Datos de contacto
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant='body1'>
                                                    <strong>Email:</strong>{' '}
                                                    {patient?.contactData
                                                        ?.email || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant='body1'>
                                                    <strong>Teléfono:</strong>{' '}
                                                    {patient?.contactData
                                                        ?.phoneNumber || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant='body1'>
                                                    <strong>Dirección:</strong>{' '}
                                                    {formatAddress(
                                                        patient?.contactData
                                                            ?.address,
                                                        patient?.contactData
                                                            ?.city,
                                                        patient?.contactData
                                                            ?.state,
                                                        patient?.contactData
                                                            ?.country,
                                                    ) || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant='body1'>
                                                    <strong>
                                                        Código Postal:
                                                    </strong>{' '}
                                                    {patient?.contactData
                                                        ?.zipCode || 'N/A'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            </CardContent>

                            <CardActions
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    borderTop: '1px solid #f0f0f0',
                                }}
                            >
                                <BackButton link='patients' disabled={false} />
                            </CardActions>
                        </>
                    ) : (
                        <NotFoundPage />
                    )}
                </Card>
            )}
        </MainLayout>
    );
};
