import { FC } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

type Props = {
    open: boolean;
    handleClose: React.MouseEventHandler<HTMLButtonElement>;
    handleConfirm: React.MouseEventHandler<HTMLButtonElement>;
};

export const DeleteDialog: FC<Props> = ({
    open,
    handleClose,
    handleConfirm,
}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>
                {'Confirmar la operación'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    Si confirma la acción los datos se perderán permanentemente.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Cancelar
                </Button>
                <Button onClick={handleConfirm}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
};
