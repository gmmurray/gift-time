import { FC, Fragment, ReactNode } from 'react';
import { Grid, GridSize, Paper, Skeleton, Typography } from '@mui/material';

const FIRST_ROW_HEIGHT = 290;
const SECOND_ROW_HEIGHT = 240;

const ROW_HEIGHTS = {
    1: FIRST_ROW_HEIGHT,
    2: SECOND_ROW_HEIGHT,
};

type DashboardElementProps = {
    row: keyof typeof ROW_HEIGHTS;
    title: string;
    size: GridSize;
    isLoading?: boolean;
    isNoData?: boolean;
    loadingComponents?: ReactNode;
};

const DashboardElement: FC<DashboardElementProps> = ({
    row,
    title,
    size,
    children,
    isLoading,
    isNoData,
    loadingComponents,
}) => {
    const renderContent = () => {
        if (isLoading) {
            if (loadingComponents) return loadingComponents;

            return (
                <Fragment>
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" />
                </Fragment>
            );
        } else if (isNoData)
            return (
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    sx={{ mt: 4 }}
                >
                    <Grid item xs={6}>
                        <Typography variant="body1">no data</Typography>
                    </Grid>
                </Grid>
            );
        else return children;
    };
    return (
        <Grid item xs={12} md={size} columnSpacing={3}>
            <Paper elevation={2} sx={{ height: ROW_HEIGHTS[row], p: 2 }}>
                <Typography variant="h6">{title}</Typography>
                {renderContent()}
            </Paper>
        </Grid>
    );
};

export default DashboardElement;
