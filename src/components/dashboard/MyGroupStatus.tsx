import { GridSize, Skeleton } from '@mui/material';

import DashboardElement from './DashboardElement';
import { FC } from 'react';

type MyGroupStatusProps = {
    size: GridSize;
};

const MyGroupStatus: FC<MyGroupStatusProps> = ({ size }) => {
    return (
        <DashboardElement row={2} title="my groups" size={size}>
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" />
        </DashboardElement>
    );
};

export default MyGroupStatus;
