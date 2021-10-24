import { GridSize, Skeleton } from '@mui/material';

import DashboardElement from './DashboardElement';
import { FC } from 'react';

type PendingInvitesProps = {
    size: GridSize;
};

const PendingInvites: FC<PendingInvitesProps> = ({ size }) => {
    return (
        <DashboardElement row={2} title="pending invites" size={size}>
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 2 }} />
            <Skeleton variant="text" />
        </DashboardElement>
    );
};

export default PendingInvites;
