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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
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
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
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
        { field: '_id', headerName: 'ID', width: 70 },
        {
            field: 'type',
            headerName: 'Tipo',
            width: 70,
            renderCell: (params) => dependenceTypes(params.value),
        },
        { field: 'tributaryType', headerName: '', width: 70 },
        { field: 'tributaryId', headerName: 'CUIT', width: 130 },
        { field: 'shortName', headerName: 'Nombre', width: 200 },
        {
            field: 'status',
            headerName: 'Estado',
            width: 130,
            renderCell: (params) => dependenceStatus(params.value),
        },
        {
            field: 'detail',
            headerName: '',
            sortable: false,
            width: 60,
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Button
                    href={`/dependences/${row._id}`}
                    startIcon={<VisibilityOutlinedIcon />}
                />
            ),
        },
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            width: 60,
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Button
                    href={`/dependences/update/${row._id}`}
                    startIcon={<EditOutlinedIcon />}
                />
            ),
        },
        {
            field: 'delete',
            headerName: '',
            sortable: false,
            width: 60,
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Button
                    onClick={() => handleOpenDeleteDialog(row._id)}
                    startIcon={<DeleteOutlineOutlinedIcon />}
                />
            ),
        },
    ];

    return (
        <MainLayout>
            <Grid>
                <Typography
                    variant='h6'
                    noWrap
                    component='div'
                    sx={{ flexGrow: 1, display: { sm: 'block' } }}
                >
                    Dependencias
                </Typography>
                <Grid display={'flex'} sx={{ mb: '.5rem' }}>
                    <Search sx={{ flexGrow: 1, marginRight: '.5rem' }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder='Buscar...'
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Button
                        href={`/dependences/create`}
                        startIcon={<AddOutlinedIcon />}
                        variant='outlined'
                        color='success'
                    >
                        Agregar
                    </Button>
                </Grid>
            </Grid>
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
                    />
                    <DeleteDialog
                        open={isOpenDeleteDialog}
                        handleClose={handleCloseDeleteDialog}
                        handleConfirm={handleConfirmDelete}
                    />
                </Grid>
            )}
        </MainLayout>
    );
};
