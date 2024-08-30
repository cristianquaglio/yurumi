import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Divider,
    IconButton,
    List,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { AccountCircle } from '@mui/icons-material';

import { AppBar, Drawer, MainList, SecondaryList } from '../ui';

interface Props {
    children: React.ReactNode;
}

export const MainLayout: FC<Props> = ({ children }) => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const toggleDrawer = () => {
        setOpen(!open);
    };
    const openAccountMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangePassword = () => {
        navigate('/change-password');
    };
    const handleCloseSession = () => {
        handleClose();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position='absolute' open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component='h1'
                        variant='h6'
                        color='inherit'
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        <Link
                            to='/'
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            Yurumi v1.0
                        </Link>
                    </Typography>
                    <IconButton
                        color='inherit'
                        aria-controls={
                            openAccountMenu ? 'basic-menu' : undefined
                        }
                        aria-haspopup='true'
                        aria-expanded={openAccountMenu ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={openAccountMenu}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleChangePassword}>
                            Cambiar mi clave
                        </MenuItem>
                        <MenuItem onClick={handleCloseSession}>
                            Cerrar sesión
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer variant='permanent' open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component='nav'>
                    <MainList />
                    <Divider sx={{ my: 1 }} />
                    <SecondaryList />
                </List>
            </Drawer>
            <Box
                component='main'
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
};
