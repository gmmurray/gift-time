import { CircularProgress, Grid, Paper } from '@mui/material';

import { FC } from 'react';

type DataLoadingSpinnerProps = {
    showBackground?: boolean;
};

const DataLoadingSpinner: FC<DataLoadingSpinnerProps> = ({
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
            sx={{ minHeight: '50vh' }}
        >
            <Grid item xs={6}>
                <CircularProgress />
            </Grid>
        </Grid>
    );
};

export default DataLoadingSpinner;
