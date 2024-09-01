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
} from '@mui/material';

import { AppDispatch, RootState } from '../../store/store';
import { MainLayout } from '../../components/layouts';
import {
    deleteDependence,
    findDependence,
} from '../../redux/slices/dependenceSlice';
import {
    dependenceStatus,
    dependenceTypes,
} from '../../utils/handlers/dependences';
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
                <CircularProgress />
            ) : (
                <Card sx={{ minWidth: 275 }}>
                    {dependence ? (
                        <>
                            <CardContent>
                                <Typography variant='h5' component='div'>
                                    {dependence?.shortName}
                                </Typography>
                                <Divider
                                    sx={{ padding: '.5rem', margin: '1rem' }}
                                />
                                <Grid container display='grid'>
                                    <Grid item display='flex'>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{
                                                padding: '.5rem',
                                                width: '30%',
                                            }}
                                        >
                                            Tipo de dependencia
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{ padding: '.5rem' }}
                                            color='text.secondary'
                                        >
                                            {dependenceTypes(
                                                dependence?.type
                                                    ? dependence.type
                                                    : '',
                                            )}
                                        </Typography>
                                    </Grid>
                                    <Grid item display='flex'>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{
                                                padding: '.5rem',
                                                width: '30%',
                                            }}
                                        >
                                            Tipo documento
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{ padding: '.5rem' }}
                                            color='text.secondary'
                                        >
                                            {dependence?.tributaryType}
                                        </Typography>
                                    </Grid>
                                    <Grid item display='flex'>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{
                                                padding: '.5rem',
                                                width: '30%',
                                            }}
                                        >
                                            Doc. fiscal
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{ padding: '.5rem' }}
                                            color='text.secondary'
                                        >
                                            {dependence?.tributaryId}
                                        </Typography>
                                    </Grid>
                                    <Grid item display='flex'>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{
                                                padding: '.5rem',
                                                width: '30%',
                                            }}
                                        >
                                            Nombre completo
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{ padding: '.5rem' }}
                                            color='text.secondary'
                                        >
                                            {dependence?.fullName}
                                        </Typography>
                                    </Grid>
                                    <Grid item display='flex'>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{
                                                padding: '.5rem',
                                                width: '30%',
                                            }}
                                        >
                                            Estado
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            component='h6'
                                            sx={{ padding: '.5rem' }}
                                            color='text.secondary'
                                        >
                                            {dependenceStatus(
                                                dependence?.status
                                                    ? dependence.status
                                                    : '',
                                            )}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'end',
                                    margin: '1rem',
                                }}
                            >
                                <BackButton
                                    link='dependences'
                                    disabled={false}
                                />
                                <Button
                                    variant='outlined'
                                    color='success'
                                    href={`/dependences/update/${dependenceId}`}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='error'
                                    onClick={handleOpenDeleteDialog}
                                >
                                    Eliminar
                                </Button>
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
