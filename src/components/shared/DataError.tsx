import { FC, ReactNode } from 'react';
import { Grid, Paper, Typography } from '@mui/material';

import { SxProps } from '@mui/system';

type DataErrorProps = {
    message: string;
    additionalSx?: SxProps;
    children?: ReactNode;
};

const DataError: FC<DataErrorProps> = ({ message, additionalSx, children }) => {
    return (
        <Grid
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
            direction="column"
            component={Paper}
            elevation={3}
            sx={{ ...additionalSx, minHeight: '50vh' }}
        >
            <Grid item xs={6}>
                <Typography variant="h6">{message}</Typography>
            </Grid>
            {children && (
                <Grid item xs={6}>
                    {children}
                </Grid>
            )}
        </Grid>
    );
};

export default DataError;
