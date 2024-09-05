import { FC } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

interface Props {
    data: {
        id: string;
        value: string;
    }[];
    handleSelect:
        | ((
              event: React.ChangeEvent<HTMLInputElement>,
              checked: boolean,
          ) => void)
        | undefined;
}

export const MultipleCheck: FC<Props> = ({ data, handleSelect }) => {
    return data.map(({ id, value }) => (
        <FormControlLabel
            key={id}
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'center',
                alignItems: 'stretch',
            }}
            control={
                <Checkbox
                    key={id}
                    value={id}
                    name={value}
                    onChange={handleSelect}
                />
            }
            label={value}
        />
    ));
};
