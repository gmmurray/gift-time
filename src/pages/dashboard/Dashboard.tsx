import { Fragment } from 'react';
import { Grid } from '@mui/material';
import MyGroupStatus from '../../components/dashboard/MyGroupStatus';
import PriorityGifts from '../../components/dashboard/PriorityGifts';
import RecentMembers from '../../components/dashboard/RecentMembers';
import RecentPurchase from '../../components/dashboard/RecentPurchase';
import Spending from '../../components/dashboard/Spending';
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
                <MyGroupStatus size={8} />
            </Grid>
            <Grid container spacing={3} sx={{ pt: 3 }}>
                <RecentMembers size={6} />
                <Spending size={6} />
            </Grid>
        </Fragment>
    );
};

export default Dashboard;
