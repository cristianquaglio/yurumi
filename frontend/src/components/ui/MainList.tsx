// import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';

export const MainList = () => {
    return (
        <>
            <>
                <ListItemButton
                    component={RouterLink}
                    to='/dependences'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <Box display='flex'>
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='Dependencias' />
                    </Box>
                </ListItemButton>
                <ListItemButton
                    component={RouterLink}
                    to='/users'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <Box display='flex'>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary='Usuarios' />
                    </Box>
                </ListItemButton>
                <ListItemButton
                    component={RouterLink}
                    to='/patients'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <Box display='flex'>
                        <ListItemIcon>
                            <LocalHotelIcon />
                        </ListItemIcon>
                        <ListItemText primary='Pacientes' />
                    </Box>
                </ListItemButton>
            </>
        </>
    );
};
