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
                Operaciones
            </ListSubheader>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Lista de usuarios' />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Lista de organismos' />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Actividades recientes' />
            </ListItemButton>
        </Fragment>
    );
};
