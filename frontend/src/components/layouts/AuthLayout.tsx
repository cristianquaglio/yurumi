import { FC } from 'react';
import { Box } from '@mui/material';

interface Props {
    children: React.ReactNode;
}

export const AuthLayout: FC<Props> = ({ children }) => {
    return (
        <main>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 1rem)'
                flexWrap='wrap'
            >
                {children}
            </Box>
        </main>
    );
};
