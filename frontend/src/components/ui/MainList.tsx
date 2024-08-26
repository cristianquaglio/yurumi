// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

export const MainList = () => {
    return (
        <>
            <>
                <ListItemButton>
                    <Link
                        to='/companies'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemIcon>
                            <AccountBalanceOutlinedIcon />
                        </ListItemIcon>
                    </Link>
                    <ListItemText primary='Organismos' />
                </ListItemButton>
                <ListItemButton>
                    <Link
                        to='/admin-users'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                    </Link>
                    <ListItemText primary='Usuarios admin' />
                </ListItemButton>
            </>
            <>
                <ListItemButton>
                    <Link
                        to='/users'
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                    </Link>
                    <ListItemText primary='Usuarios' />
                </ListItemButton>
            </>
        </>
    );
};
