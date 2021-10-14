import { CircularProgress, Grid, Paper } from '@mui/material';

import { FC } from 'react';
import { SxProps } from '@mui/system';

type DataLoadingSpinnerProps = {
    showBackground?: boolean;
    additionalSx?: SxProps;
};

const DataLoadingSpinner: FC<DataLoadingSpinnerProps> = ({
    additionalSx,
    showBackground = true,
}) => {
    return (
        <Grid
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
            direction="column"
            component={showBackground ? Paper : 'div'}
            sx={{ ...additionalSx, minHeight: '50vh' }}
        >
            <Grid item xs={6}>
                <CircularProgress />
            </Grid>
        </Grid>
    );
};

export default DataLoadingSpinner;
