import { Box, GridSize } from '@mui/material';
import DashboardElement, { DashboardElementMenuItem } from './DashboardElement';
import { FC, useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import GroupGiftProgress from './GroupGiftProgress';
import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import { useGetMyGroupStatuses } from '../../domain/services/groupService';
import { useNavigate } from 'react-router';

enum ViewType {
    claimed = 1,
    purchased = 2,
    either = 3,
}

const viewTypeNames: { [key: number]: string } = {
    [ViewType.claimed]: 'claimed',
    [ViewType.purchased]: 'purchased',
    [ViewType.either]: 'claimed or purchased',
};

const getStatusQuery = (viewType: ViewType, status_id: StatusTypeEnum) => {
    switch (viewType) {
        case ViewType.claimed:
            return status_id === StatusTypeEnum.claimed;
        case ViewType.purchased:
            return status_id === StatusTypeEnum.purchased;
        case ViewType.either:
            return (
                status_id === StatusTypeEnum.claimed ||
                status_id === StatusTypeEnum.purchased
            );
    }
};

type MyGroupStatusProps = {
    size: GridSize;
};

const MyGroupStatus: FC<MyGroupStatusProps> = ({ size }) => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetMyGroupStatuses(user?.id);
    const [viewType, setViewType] = useState<ViewType>(ViewType.either);
    const navigate = useNavigate();

    const handleGroupNavigate = useCallback(
        (group_id: number) => navigate(`/groups/view/${group_id}`),
        [navigate],
    );

    const title = `group progress - ${viewTypeNames[viewType]}`;
    const isNoData = !data || data.length === 0;

    const menuItems: DashboardElementMenuItem[] = [
        {
            text: 'view groups',
            onClick: () => navigate('/groups/owned'),
            selected: false,
        },
        {
            isDivider: true,
        },
        {
            text: 'claimed/purchased',
            onClick: () => setViewType(ViewType.either),
            selected: viewType === ViewType.either,
        },
        {
            text: 'claimed',
            onClick: () => setViewType(ViewType.claimed),
            selected: viewType === ViewType.claimed,
        },
        {
            text: 'purchased',
            onClick: () => setViewType(ViewType.purchased),
            selected: viewType === ViewType.purchased,
        },
    ];

    return (
        <DashboardElement
            row={2}
            title={title}
            size={size}
            isLoading={isLoading}
            isNoData={isNoData}
            menuItems={menuItems}
        >
            <Box sx={{ mt: 1 }}>
                {(data ?? []).map(({ group, gifts }) => {
                    const onClick = () => handleGroupNavigate(group.group_id);
                    const total = gifts.length;
                    const value = gifts.filter(
                        gift =>
                            gift.claimed_by &&
                            getStatusQuery(viewType, gift.claimed_by.status_id),
                    ).length;
                    return (
                        <GroupGiftProgress
                            key={group.group_id}
                            group={group.name}
                            numerator={value}
                            denominator={total}
                            color="secondary"
                            spacing={1}
                            onGroupClick={onClick}
                        />
                    );
                })}
            </Box>
        </DashboardElement>
    );
};

export default MyGroupStatus;
