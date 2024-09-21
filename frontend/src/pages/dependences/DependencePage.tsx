import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Typography,
    Box,
} from '@mui/material';

import { AppDispatch, RootState } from '../../store/store';
import { MainLayout } from '../../components/layouts';
import {
    deleteDependence,
    findDependence,
} from '../../redux/slices/dependenceSlice';
import { dependenceStatus, dependenceTypes } from '../../utils';
import { DeleteDialog } from '../../components/ui/DeleteDialog';
import { BackButton, NotFoundPage } from '../../components/ui';

export const DependencePage = () => {
    const params = useParams();
    const dependenceId = params.dependenceId ? params.dependenceId : '';
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { isLoading, dependence } = useSelector(
        (state: RootState) => state.dependence,
    );

    const [isOpenDeleteDialog, setIsOpenDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setIsOpenDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteDependence(dependenceId));
        navigate('/dependences');
    };

    useEffect(() => {
        dispatch(findDependence(dependenceId ? dependenceId : ''));
    }, []);

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
                    {dependence ? (
                        <>
                            <CardContent>
                                <Typography
                                    variant='h4'
                                    component='div'
                                    color='primary'
                                    sx={{ textAlign: 'center', mb: 2 }}
                                >
                                    {dependence?.shortName}
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>
                                                Tipo de dependencia:
                                            </strong>{' '}
                                            {dependenceTypes(
                                                dependence?.type || '',
                                            )}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Tipo documento:</strong>{' '}
                                            {dependence?.tributaryType}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Doc. fiscal:</strong>{' '}
                                            {dependence?.tributaryId}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant='body1'>
                                            <strong>Nombre completo:</strong>{' '}
                                            {dependence?.fullName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant='body1'>
                                            <strong>Estado:</strong>{' '}
                                            {dependenceStatus(
                                                dependence?.status || '',
                                            )}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>

                            <CardActions
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    borderTop: '1px solid #f0f0f0',
                                }}
                            >
                                <BackButton
                                    link='dependences'
                                    disabled={false}
                                />
                                <div>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        href={`/dependences/update/${dependenceId}`}
                                        sx={{ marginRight: 2 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        onClick={handleOpenDeleteDialog}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </CardActions>
                        </>
                    ) : (
                        <NotFoundPage />
                    )}

                    <DeleteDialog
                        open={isOpenDeleteDialog}
                        handleClose={handleCloseDeleteDialog}
                        handleConfirm={handleConfirmDelete}
                    />
                </Card>
            )}
        </MainLayout>
    );
};
