import {
    ButtonBase,
    Divider,
    Grid,
    GridSize,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import { FC, Fragment, useCallback } from 'react';

import { Auth } from '@supabase/ui';
import DashboardElement from './DashboardElement';
import { useGetUpcomingGroups } from '../../domain/services/groupService';
import { useNavigate } from 'react-router';

type UpcomingGroupsProps = {
    size: GridSize;
};

const UpcomingGroups: FC<UpcomingGroupsProps> = ({ size }) => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetUpcomingGroups(user?.id);
    const navigate = useNavigate();

    const handleGroupNavigate = useCallback(
        (group_id: number) => navigate(`/group-gift/${group_id}`),
        [navigate],
    );

    const isNoData = !isLoading && (!data || data.length === 0);

    return (
        <DashboardElement
            row={1}
            title="upcoming groups"
            size={size}
            isLoading={isLoading}
            isNoData={isNoData}
        >
            <List sx={{ pt: 0 }}>
                <ListItem component={Grid} container spacing={1}>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">group</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography fontWeight="bold" sx={{ ml: 'auto' }}>
                            date
                        </Typography>
                    </Grid>
                </ListItem>
                <Divider />
                {(data ?? []).map(({ name, due_date, group_id }, index) => {
                    const hideDivider = index === (data?.length ?? 0) - 1;
                    const onClick = () => handleGroupNavigate(group_id);
                    return (
                        <Fragment key={group_id}>
                            <ListItem component={Grid} container spacing={1}>
                                <Grid
                                    item
                                    xs={6}
                                    textAlign="left"
                                    component={ButtonBase}
                                    onClick={onClick}
                                    sx={{ display: 'block' }}
                                >
                                    <Typography
                                        sx={{
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} textAlign="right">
                                    <Typography>{due_date}</Typography>
                                </Grid>
                            </ListItem>
                            {!hideDivider && <Divider />}
                        </Fragment>
                    );
                })}
            </List>
        </DashboardElement>
    );
};

export default UpcomingGroups;
