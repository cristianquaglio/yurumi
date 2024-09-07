// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

export const MainList = () => {
    return (
        <>
            <>
                <ListItemButton>
                    <Link
                        to='/dependences'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box sx={{ display: 'flex' }}>
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
                        <Box sx={{ display: 'flex' }}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary='Usuarios' />
                        </Box>
                    </Link>
                </ListItemButton>
            </>
        </>
    );
};
