import { GridSize, Skeleton } from '@mui/material';

import DashboardElement from './DashboardElement';
import { FC } from 'react';

type SpendingProps = {
    size: GridSize;
};

const Spending: FC<SpendingProps> = ({ size }) => {
    return (
        <DashboardElement row={2} title="spending" size={size}>
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" />
        </DashboardElement>
    );
};

export default Spending;
