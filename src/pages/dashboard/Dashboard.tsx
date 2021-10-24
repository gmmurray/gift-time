import { Fragment } from 'react';
import { Grid } from '@mui/material';
import PendingInvites from '../../components/dashboard/PendingInvites';
import PriorityGifts from '../../components/dashboard/PriorityGifts';
import RecentMembers from '../../components/dashboard/RecentMembers';
import RecentPurchase from '../../components/dashboard/RecentPurchase';
import UpcomingGroups from '../../components/dashboard/UpcomingGroups';

const Dashboard = () => {
    return (
        <Fragment>
            <Grid container spacing={3} sx={{ pt: 1 }}>
                <PriorityGifts size={7} />
                <UpcomingGroups size={5} />
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
                <RecentPurchase size={4} />
                <PendingInvites size={4} />
                <RecentMembers size={4} />
            </Grid>
        </Fragment>
    );
};

export default Dashboard;
