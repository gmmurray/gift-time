import { GridSize, Skeleton } from '@mui/material';

import DashboardElement from './DashboardElement';
import { FC } from 'react';

type RecentMembersProps = {
    size: GridSize;
};

const RecentMembers: FC<RecentMembersProps> = ({ size }) => {
    return (
        <DashboardElement row={2} title="new members" size={size}>
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" />
        </DashboardElement>
    );
};

export default RecentMembers;
