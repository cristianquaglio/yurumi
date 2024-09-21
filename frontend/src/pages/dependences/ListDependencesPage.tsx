import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    CircularProgress,
    Grid,
    InputBase,
    Typography,
    alpha,
    styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

import { AppDispatch, RootState } from '../../store/store';
import { MainLayout } from '../../components/layouts';
import {
    deleteDependence,
    findAllDependences,
} from '../../redux/slices/dependenceSlice';
import { dependenceStatus, dependenceTypes, IDependence } from '../../utils';
import { DeleteDialog } from '../../components/ui/DeleteDialog';

// Estilos del componente de búsqueda
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

export const ListDependencesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, dependences, isDeleted } = useSelector(
        (state: RootState) => state.dependence,
    );

    const [rows, setRows] = useState<IDependence[]>([]);
    const [isOpenDeleteDialog, setIsOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState('');

    const handleOpenDeleteDialog = (dependenceId: string) => {
        setIsOpenDialog(true);
        setSelectedId(dependenceId);
    };

    const handleCloseDeleteDialog = () => {
        setIsOpenDialog(false);
        setSelectedId('');
    };

    const handleConfirmDelete = () => {
        dispatch(deleteDependence(selectedId));
        setIsOpenDialog(false);
    };

    useEffect(() => {
        dispatch(findAllDependences());
    }, []);

    useEffect(() => {
        if (isDeleted) dispatch(findAllDependences());
    }, [isDeleted]);

    useEffect(() => {
        if (dependences) setRows(dependences);
    }, [dependences]);

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', flex: 0.5 }, // Responsive width
        {
            field: 'type',
            headerName: 'Tipo',
            flex: 1,
            renderCell: (params) => dependenceTypes(params.value),
        },
        { field: 'tributaryType', headerName: '', flex: 0.5 },
        { field: 'tributaryId', headerName: 'CUIT', flex: 1 },
        { field: 'shortName', headerName: 'Nombre', flex: 1.5 },
        {
            field: 'status',
            headerName: 'Estado',
            flex: 1,
            renderCell: (params) => dependenceStatus(params.value),
        },
        {
            field: 'detail',
            headerName: '',
            sortable: false,
            flex: 0.3,
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Button
                    href={`/dependences/${row._id}`}
                    startIcon={<VisibilityOutlinedIcon />}
                    sx={{ minWidth: 'auto' }}
                />
            ),
        },
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            flex: 0.3,
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Button
                    href={`/dependences/update/${row._id}`}
                    startIcon={<EditOutlinedIcon />}
                    sx={{ minWidth: 'auto' }}
                />
            ),
        },
        {
            field: 'delete',
            headerName: '',
            sortable: false,
            flex: 0.3,
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Button
                    onClick={() => handleOpenDeleteDialog(row._id)}
                    startIcon={<DeleteOutlineOutlinedIcon />}
                    sx={{ minWidth: 'auto' }}
                />
            ),
        },
    ];

    return (
        <MainLayout>
            <Grid container direction='column'>
                <Typography
                    variant='h6'
                    noWrap
                    component='div'
                    sx={{ flexGrow: 1, display: { sm: 'block' } }}
                >
                    Dependencias
                </Typography>

                <Grid
                    container
                    sx={{ mb: '.5rem', alignItems: 'center' }}
                    spacing={2}
                    style={{ width: '100%' }}
                >
                    {/* Búsqueda */}
                    <Grid item xs={12} md={9}>
                        <Search sx={{ marginRight: '.5rem', width: '100%' }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder='Buscar...'
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Grid>

                    {/* Botón agregar */}
                    <Grid item xs={12} md={3}>
                        <Button
                            href={`/dependences/create`}
                            startIcon={<AddOutlinedIcon />}
                            variant='outlined'
                            color='success'
                            style={{ width: '100%' }}
                        >
                            Agregar
                        </Button>
                    </Grid>
                </Grid>

                {/* Cargando */}
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Grid style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        _id: false,
                                    },
                                },
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row) => row._id}
                            autoHeight
                        />
                        <DeleteDialog
                            open={isOpenDeleteDialog}
                            handleClose={handleCloseDeleteDialog}
                            handleConfirm={handleConfirmDelete}
                        />
                    </Grid>
                )}
            </Grid>
        </MainLayout>
    );
};
