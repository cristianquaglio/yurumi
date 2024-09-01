import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

interface Props {
    link: string;
    disabled: boolean;
}

export const BackButton: FC<Props> = ({ link, disabled }) => {
    return (
        <Link to={`/${link}`}>
            <Tooltip title='Volver al listado'>
                <Button variant='outlined' color='primary' disabled={disabled}>
                    {disabled ? (
                        <CircularProgress />
                    ) : (
                        <ArrowBackIosOutlinedIcon />
                    )}
                </Button>
            </Tooltip>
        </Link>
    );
};
