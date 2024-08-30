import { Fragment } from 'react';
import {
    ListSubheader,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const SecondaryList = () => {
    return (
        <Fragment>
            <ListSubheader component='div' inset>
                Operaciones recientes
            </ListSubheader>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Dependencias' />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Usuarios' />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='...' />
            </ListItemButton>
        </Fragment>
    );
};
