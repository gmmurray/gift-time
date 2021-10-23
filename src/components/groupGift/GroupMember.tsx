import {
    AppBar,
    Avatar,
    Card,
    CardContent,
    Chip,
    Grid,
    InputAdornment,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';
import {
    GiftFilter,
    applyDefaultFilter,
    applyFilter,
    defaultGiftFilter,
} from '../../utils/groupGift/giftFilter';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Auth } from '@supabase/ui';
import GiftList from './GiftList';
import { GiftWithClaim } from '../../domain/entities/Gift';
import { Navigate } from 'react-router';
import SearchIcon from '@mui/icons-material/Search';
import SelectedGift from './SelectedGift';
import TooltipButton from '../shared/TooltipButton';
import { useGroupGiftContext } from '../../utils/contexts/groupGiftContext';

const GroupMember = () => {
    const { selectedMember, onSelectMember, group_Id } = useGroupGiftContext();
    const { user } = Auth.useUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resolvedGifts = selectedMember?.gifts ?? [];

    const [filteredGifts, setFilteredGifts] = useState(
        applyDefaultFilter(resolvedGifts, user!.id),
    );
    const [filter, setFilter] = useState<GiftFilter>(defaultGiftFilter);

    const [selectedGift, setSelectedGift] = useState<GiftWithClaim | null>(
        null,
    );

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFilter(state => ({ ...state, search: e.target.value }));
        },
        [],
    );

    const handleApplyFilter = useCallback(
        (name: keyof GiftFilter) =>
            setFilter(state => ({ ...state, [name]: true })),
        [],
    );
    const handleDisableFilter = useCallback(
        (name: keyof GiftFilter) =>
            setFilter(state => ({ ...state, [name]: false })),
        [],
    );

    useEffect(() => {
        const result = applyFilter(filter, resolvedGifts, user!.id);

        setFilteredGifts(result);
    }, [filter, resolvedGifts, user]);

    const handleSelectedGiftChange = useCallback(
        (gift_id: number | null) => {
            const associatedGift =
                selectedMember?.gifts.find(g => g.gift_id === gift_id) ?? null;
            setSelectedGift(associatedGift);
        },
        [selectedMember?.gifts],
    );

    useEffect(() => {
        if (selectedGift) {
            setSelectedGift(
                selectedMember?.gifts.find(
                    g => g.gift_id === selectedGift.gift_id,
                ) ?? null,
            );
        }
    }, [selectedGift, selectedMember?.gifts]);

    if (!selectedMember) {
        return <Navigate to={`/group-gift/${group_Id}`} />;
    }
    const claimedGiftsCount = selectedMember.gifts.filter(
        g => !!g.claimed_by,
    ).length;

    const chipFilters: { label: string; filterKey: keyof GiftFilter }[] = [
        {
            label: 'available',
            filterKey: 'available',
        },
        {
            label: 'claimed by me',
            filterKey: 'claimedByUser',
        },
        {
            label: 'high priority',
            filterKey: 'priority',
        },
    ];

    const renderCardContent = () => {
        if (selectedGift) {
            return (
                <SelectedGift
                    onDeselect={() => handleSelectedGiftChange(null)}
                    gift={selectedGift}
                    currentUserId={user!.id}
                />
            );
        } else {
            return (
                <Fragment>
                    <TextField
                        value={filter.search}
                        onChange={handleSearch}
                        variant="standard"
                        fullWidth
                        placeholder="search"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container spacing={1} sx={{ mt: 2, mb: 2 }}>
                        {chipFilters
                            .sort((a, b) => (filter[a.filterKey] ? -1 : 1))
                            .map(({ label, filterKey }) => {
                                const isSelected = filter[filterKey];
                                return (
                                    <Grid item key={label}>
                                        <Chip
                                            label={label}
                                            color={
                                                isSelected
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            onClick={() =>
                                                handleApplyFilter(filterKey)
                                            }
                                            onDelete={
                                                isSelected
                                                    ? () =>
                                                          handleDisableFilter(
                                                              filterKey,
                                                          )
                                                    : undefined
                                            }
                                        />
                                    </Grid>
                                );
                            })}
                    </Grid>
                    <GiftList
                        gifts={filteredGifts}
                        onSelect={handleSelectedGiftChange}
                    />
                </Fragment>
            );
        }
    };
    return (
        <Card>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar>
                    <TooltipButton
                        edge="start"
                        color="primary"
                        text="back"
                        icon={ArrowBackIcon}
                        onClick={() => onSelectMember()}
                    />
                </Toolbar>
            </AppBar>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={4}>
                    <Avatar
                        src={selectedMember.user.avatar_url ?? undefined}
                        sx={{ mx: 'auto', height: 75, width: 75 }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h4">
                        {selectedMember.user.display_name}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="subtitle1" color="text.secondary">
                        {claimedGiftsCount} / {selectedMember.gifts.length}{' '}
                        gift(s) claimed
                    </Typography>
                </Grid>
            </Grid>
            <CardContent>{renderCardContent()}</CardContent>
        </Card>
    );
};

export default GroupMember;
