import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme> | undefined> = {
    container: {
        minHeight: '100vh',
    },
    input: {
        minWidth: '50%',
        maxWidth: '50%',
        mt: 2,
    },
    iconRoot: {
        textAlign: 'center',
    },
};
