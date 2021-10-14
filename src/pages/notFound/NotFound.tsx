import { Button, Grid, Paper, Typography } from '@mui/material';

import { Link } from 'react-router-dom';

const NotFound = () => (
    <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component={Paper}
        sx={{ minHeight: '50vh' }}
    >
        <Grid item xs={6}>
            <Typography variant="h4">
                the page you requested could not be found
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Button variant="contained" component={Link} to="/home">
                go home
            </Button>
        </Grid>
    </Grid>
);

export default NotFound;
