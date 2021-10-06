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
        error: {
            main: '#ffcccb',
        },
        success: {
            main: '#a9ee91',
        },
    },
    typography: {
        fontFamily: 'Raleway',
    },
});
