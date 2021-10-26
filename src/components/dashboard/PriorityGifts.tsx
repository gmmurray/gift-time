import {
    ButtonBase,
    Divider,
    Grid,
    GridSize,
    List,
    ListItem,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';

import { Auth } from '@supabase/ui';
import DashboardElement from './DashboardElement';
import { GiftWithUserAndGroups } from '../../domain/entities/Gift';
import { useGetPriorityGifts } from '../../domain/services/giftService';
import { useNavigate } from 'react-router-dom';

type PriorityGiftsProps = {
    size: GridSize;
};

const PriorityGifts: FC<PriorityGiftsProps> = ({ size }) => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetPriorityGifts(user?.id);
    const navigate = useNavigate();

    const [menuAnchors, setMenuAnchors] = useState<{
        [key: number]: HTMLElement | null;
    }>({});

    useEffect(() => {
        if (data && data.length > 0) {
            data.forEach(g => {
                if (g.groups.length > 1) {
                    setMenuAnchors(state => ({ ...state, [g.gift_id]: null }));
                }
            });
        }
    }, [data]);

    const handleGroupNavigate = useCallback(
        (user_id: string, group_id: number) =>
            navigate(`/group-gift/${group_id}?user_id=${user_id}`),
        [navigate],
    );
    const handleMenuOpen = useCallback(
        (gift_id: number, anchorEl: HTMLElement) =>
            setMenuAnchors(state => ({ ...state, [gift_id]: anchorEl })),
        [],
    );
    const handleMenuClose = useCallback(
        (gift_id: number) =>
            setMenuAnchors(state => ({ ...state, [gift_id]: null })),
        [],
    );
    const isNoData = !isLoading && (!data || data.length === 0);

    return (
        <DashboardElement
            row={1}
            title="priority gifts"
            size={size}
            isLoading={isLoading}
            isNoData={isNoData}
        >
            <List
                sx={{
                    pt: 0,
                }}
            >
                <ListItem component={Grid} container sx={{ pt: 0 }}>
                    <Grid item xs={4}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                            gift
                        </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                        <Typography sx={{ fontWeight: 'bold' }}>
                            user
                        </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                        <Typography sx={{ fontWeight: 'bold' }}>
                            group
                        </Typography>
                    </Grid>
                </ListItem>
                <Divider />
                {(data ?? []).map((g: GiftWithUserAndGroups) => {
                    const {
                        gift_id,
                        name,
                        user: { display_name, user_id },
                        groups,
                    } = g;
                    const hasMultipleMutualGroups = groups.length > 1;
                    const groupContent = hasMultipleMutualGroups
                        ? 'multiple'
                        : groups[0].name;
                    const onClick = hasMultipleMutualGroups
                        ? (e: MouseEvent<HTMLButtonElement>) =>
                              handleMenuOpen(gift_id, e.currentTarget)
                        : () => handleGroupNavigate(user_id, groups[0].id);

                    return (
                        <ListItem key={g.gift_id} sx={{ pb: 0 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <Typography
                                        sx={{
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="right">
                                    <Typography
                                        sx={{
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {display_name}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={4}
                                    textAlign="right"
                                    component={ButtonBase}
                                    onClick={onClick}
                                    sx={{
                                        display: 'block',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {groupContent}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {hasMultipleMutualGroups && (
                                <Menu
                                    anchorEl={menuAnchors[gift_id]}
                                    open={!!menuAnchors[gift_id]}
                                    onClose={() => handleMenuClose(gift_id)}
                                >
                                    {groups.map(g => (
                                        <MenuItem
                                            key={g.id}
                                            onClick={() =>
                                                handleGroupNavigate(
                                                    user_id,
                                                    g.id,
                                                )
                                            }
                                        >
                                            {g.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </DashboardElement>
    );
};

export default PriorityGifts;
