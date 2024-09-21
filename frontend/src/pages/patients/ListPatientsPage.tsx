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
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

import { MainLayout } from '../../components/layouts';
import { documentTypes, IPatient } from '../../utils';
import { AppDispatch, RootState } from '../../store/store';
import { findAllPatients } from '../../redux/slices/patientSlice';

// Search component styles
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

export const ListPatientsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, patients } = useSelector(
        (state: RootState) => state.patient,
    );

    const [rows, setRows] = useState<IPatient[]>([]);

    useEffect(() => {
        dispatch(findAllPatients());
    }, []);

    useEffect(() => {
        if (patients) setRows(patients);
    }, [patients]);

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', flex: 1 }, // Responsive column width
        { field: 'firstName', headerName: 'Nombre', flex: 1 },
        { field: 'lastName', headerName: 'Apellido', flex: 1 },
        {
            field: 'documentType',
            headerName: 'Tipo doc',
            flex: 1,
            renderCell: (params) => documentTypes(params.value),
        },
        { field: 'documentNumber', headerName: 'Documento', flex: 1 },
        {
            field: 'healthcareSystem',
            headerName: 'Obra Social',
            flex: 1,
            renderCell: (params) => {
                return params.value ? params.value.shortName : 'N/A';
            },
        },
        {
            field: 'detail',
            headerName: '',
            sortable: false,
            flex: 0.5, // Makes this column take less space
            renderCell: ({ row }: Partial<GridRowParams>) => (
                <Grid
                    container
                    justifyContent='flex-end'
                    alignItems='center'
                    style={{ height: '100%' }}
                >
                    <Button
                        href={`/patients/${row._id}`}
                        startIcon={<VisibilityOutlinedIcon />}
                        sx={{
                            minWidth: 'auto', // Adjust width based on content
                        }}
                    />
                </Grid>
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
                    Pacientes
                </Typography>

                <Grid
                    container
                    sx={{ mb: '.5rem', alignItems: 'center' }}
                    spacing={2}
                    style={{ width: '100%' }}
                >
                    {/* Search input */}
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

                    {/* Add button */}
                    <Grid item xs={12} md={3}>
                        <Button
                            href={`/patients/create`}
                            startIcon={<AddOutlinedIcon />}
                            variant='outlined'
                            color='success'
                            style={{ width: '100%' }}
                        >
                            Agregar
                        </Button>
                    </Grid>
                </Grid>

                {/* Loading state */}
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Grid style={{ height: '400px', width: '100%' }}>
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
                            autoHeight // Auto height for responsive design
                        />
                    </Grid>
                )}
            </Grid>
        </MainLayout>
    );
};
