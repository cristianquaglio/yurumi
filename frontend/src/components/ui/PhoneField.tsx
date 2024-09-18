import { useState } from 'react';
import {
    Button,
    TextField,
    Grid,
    Chip,
    Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';

interface PhoneFieldProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
    register,
    errors,
    setValue,
}) => {
    const [phones, setPhones] = useState<string[]>([]);
    const [phoneInput, setPhoneInput] = useState('');

    const handleAddPhone = () => {
        if (phoneInput.trim() !== '') {
            const newPhones = [...phones, phoneInput.trim()];
            setPhones(newPhones);
            setPhoneInput('');
            setValue('phones', newPhones);
        }
    };

    const handleRemovePhone = (index: number) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones);
        setValue('phones', newPhones);
    };

    return (
        <Grid container spacing={2} direction='column'>
            <Grid item>
                <Typography variant='h6' gutterBottom>
                    Números de Teléfono
                </Typography>
                <TextField
                    label='Agregar Número de Teléfono'
                    variant='outlined'
                    fullWidth
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleAddPhone}
                                sx={{ ml: 1 }}
                            >
                                <Add />
                            </Button>
                        ),
                    }}
                />
            </Grid>
            <Grid item>
                {phones.length > 0 ? (
                    phones.map((phone, index) => (
                        <Chip
                            key={index}
                            label={phone}
                            onDelete={() => handleRemovePhone(index)}
                            deleteIcon={<Delete />}
                            sx={{ mb: 1 }}
                        />
                    ))
                ) : (
                    <Typography variant='body2' color='textSecondary'>
                        No hay teléfonos añadidos.
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};
