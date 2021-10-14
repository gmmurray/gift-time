import type {} from '@mui/x-data-grid/themeAugmentation';

import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#5d001e',
        },
        secondary: {
            main: '#123c69',
        },
        background: {
            default: '#e3e2df',
            paper: '#bab2b5',
        },
    },
    typography: {
        fontFamily: 'Raleway',
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#e3e2df',
                },
            },
        },
    },
});
