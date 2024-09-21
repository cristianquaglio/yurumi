// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';

export const MainList = () => {
    return (
        <>
            <>
                <ListItemButton>
                    <Link
                        to='/dependences'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box display='flex'>
                            <ListItemIcon>
                                <AccountBalanceOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary='Dependencias' />
                        </Box>
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <Link
                        to='/users'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box display='flex'>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary='Usuarios' />
                        </Box>
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <Link
                        to='/patients'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box display='flex'>
                            <ListItemIcon>
                                <LocalHotelIcon />
                            </ListItemIcon>
                            <ListItemText primary='Pacientes' />
                        </Box>
                    </Link>
                </ListItemButton>
            </>
        </>
    );
};
