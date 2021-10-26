import {
    ButtonBase,
    Divider,
    Grid,
    GridSize,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import { FC, useCallback } from 'react';

import { Auth } from '@supabase/ui';
import DashboardElement from './DashboardElement';
import { ellipsisOverflow } from '../../lib/constants/styles';
import { useGetNewMembers } from '../../domain/services/groupMemberService';
import { useNavigate } from 'react-router';

type RecentMembersProps = {
    size: GridSize;
};

const RecentMembers: FC<RecentMembersProps> = ({ size }) => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetNewMembers(user?.id);
    const navigate = useNavigate();

    const handleGroupNavigate = useCallback(
        (group_id: number) => navigate(`/group-gift/${group_id}`),
        [navigate],
    );

    const isNoData = !data || data.length === 0;
    return (
        <DashboardElement
            row={2}
            title="new members"
            size={size}
            isLoading={isLoading}
            isNoData={isNoData}
        >
            <List sx={{ pt: 0 }}>
                <ListItem component={Grid} container sx={{ pt: 0 }}>
                    <Grid item xs={6} component={Typography} fontWeight="bold">
                        member
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        component={Typography}
                        fontWeight="bold"
                        textAlign="right"
                    >
                        group
                    </Grid>
                </ListItem>
                <Divider />
                {(data ?? []).map(
                    (
                        {
                            group_member_id,
                            group: { name: groupName, group_id },
                            user: { display_name },
                        },
                        index,
                    ) => {
                        const isFirstElement = index === 0;
                        const onGroupClick = () =>
                            handleGroupNavigate(group_id);
                        return (
                            <ListItem
                                key={group_member_id}
                                component={Grid}
                                container
                                sx={{
                                    pt: isFirstElement ? 1 : 0,
                                    pb: 0,
                                }}
                            >
                                <Grid
                                    item
                                    xs={6}
                                    component={Typography}
                                    sx={{ ...ellipsisOverflow }}
                                >
                                    {display_name}
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    component={ButtonBase}
                                    onClick={onGroupClick}
                                    sx={{ display: 'block' }}
                                    textAlign="right"
                                >
                                    <Typography
                                        sx={{
                                            ...ellipsisOverflow,
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {groupName}
                                    </Typography>
                                </Grid>
                            </ListItem>
                        );
                    },
                )}
            </List>
        </DashboardElement>
    );
};

export default RecentMembers;
