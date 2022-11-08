import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    InputAdornment,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import {
    FilterMenuItem,
    FilterMenuState,
    MemberFilter,
    OrderBy,
    OrderDir,
    Refine,
    applyFilter,
    defaultMemberFilter,
} from '../../utils/groupGift/memberFilter';
import { Sort, Tune } from '@mui/icons-material';

import { Box } from '@mui/system';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import GroupMemberList from './GroupMemberList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SearchIcon from '@mui/icons-material/Search';
import { UserProfile } from '../../domain/entities/UserProfile';
import { useGroupGiftContext } from '../../utils/contexts/groupGiftContext';

const DEFAULT_IMAGE_PATH = '/images/group-gifts/default_group_image.jpg';

type MainContentProps = {
    ownerProfile: UserProfile;
    groupImage: string | null;
    groupName: string;
    groupDate: Date;
};

const MainContent: FC<MainContentProps> = ({
    ownerProfile,
    groupImage,
    groupName,
    groupDate,
}) => {
    const { members } = useGroupGiftContext();
    const [filteredMembers, setFilteredMembers] = useState(
        applyFilter(defaultMemberFilter, members),
    );

    const [filter, setFilter] = useState<MemberFilter>(defaultMemberFilter);
    const [menuState, setMenuState] = useState<FilterMenuState>({
        refine: { anchorEl: null },
        sort: { anchorEl: null },
    });

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFilter(state => ({ ...state, search: e.target.value }));
        },
        [],
    );

    const handleRefineChange = useCallback(
        (refine: Refine) => setFilter(state => ({ ...state, refine })),
        [],
    );

    const handleSortChange = useCallback(
        (field: OrderBy) => {
            const { orderBy, orderDir } = filter;
            let newOrderDir: OrderDir;

            if (orderBy !== field) {
                newOrderDir = 'asc';
            } else {
                if (orderDir === 'asc') newOrderDir = 'desc';
                else newOrderDir = 'asc';
            }

            setFilter(state => ({
                ...state,
                orderBy: field,
                orderDir: newOrderDir,
            }));
        },
        [filter],
    );

    useEffect(() => {
        const result = applyFilter(filter, members);

        setFilteredMembers(result);
    }, [filter, members]);

    const handleMenuOpen = useCallback(
        (e: React.MouseEvent<HTMLElement>, name: keyof FilterMenuState) =>
            setMenuState(state => ({
                ...state,
                [name]: { ...state[name], anchorEl: e.currentTarget },
            })),
        [],
    );

    const handleMenuClose = useCallback(
        (name: keyof FilterMenuState) =>
            setMenuState(state => ({
                ...state,
                [name]: { ...state[name], anchorEl: null },
            })),
        [],
    );

    const handleResetFilters = useCallback(
        () => setFilter(defaultMemberFilter),
        [],
    );

    let headerImage;
    if (!!groupImage && groupImage !== '') headerImage = groupImage;
    else headerImage = DEFAULT_IMAGE_PATH;

    const refineMenuItems: FilterMenuItem[] = [
        {
            text: 'gifts available',
            onClick: () => handleRefineChange('available'),
            selected: filter.refine === 'available',
            icon: <CardGiftcardIcon />,
        },
        {
            text: 'all claimed',
            onClick: () => handleRefineChange('claimed'),
            selected: filter.refine === 'claimed',
            icon: <PlaylistAddCheckIcon />,
        },
    ];

    const arrowIcon =
        filter.orderDir === 'asc' ? (
            <KeyboardArrowUpIcon />
        ) : (
            <KeyboardArrowDownIcon />
        );

    const sortMenuItems: FilterMenuItem[] = [
        {
            text: 'name',
            onClick: () => handleSortChange('name'),
            selected: filter.orderBy === 'name',
            icon: arrowIcon,
        },
        {
            text: 'claimed gifts',
            onClick: () => handleSortChange('claimed-gifts'),
            selected: filter.orderBy === 'claimed-gifts',
            icon: arrowIcon,
        },
        {
            text: 'requested gifts',
            onClick: () => handleSortChange('requested-gifts'),
            selected: filter.orderBy === 'requested-gifts',
            icon: arrowIcon,
        },
    ];

    const refineFilterApplied = filter.refine !== defaultMemberFilter.refine;
    const sortFilterApplied =
        filter.orderBy !== defaultMemberFilter.orderBy ||
        filter.orderDir !== defaultMemberFilter.orderDir;

    return (
        <Card>
            <CardHeader
                avatar={
                    <Tooltip title={`${ownerProfile.display_name}'s group`}>
                        <Avatar src={ownerProfile.avatar_url ?? undefined} />
                    </Tooltip>
                }
                title={groupName}
                titleTypographyProps={{
                    variant: 'h5',
                }}
                subheader={`${members.length + 1} member(s)`}
                subheaderTypographyProps={{
                    variant: 'subtitle1',
                }}
                action={
                    <Box sx={{ mr: 1, fontStyle: 'italic' }}>
                        ends {groupDate}
                    </Box>
                }
            />
            <CardMedia
                component="img"
                src={headerImage}
                alt="group image"
                sx={{
                    maxHeight: '250px',
                    mx: 'auto',
                    objectFit: 'contain'
                }}
            />
            <CardContent>
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
                <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2 }}>
                    <Chip
                        color={refineFilterApplied ? 'primary' : undefined}
                        icon={<Tune />}
                        label="refine"
                        onClick={(e: React.MouseEvent<HTMLElement>) =>
                            handleMenuOpen(e, 'refine')
                        }
                    />
                    <Chip
                        color={sortFilterApplied ? 'primary' : undefined}
                        icon={<Sort />}
                        label="sort"
                        onClick={(e: React.MouseEvent<HTMLElement>) =>
                            handleMenuOpen(e, 'sort')
                        }
                    />
                    <Chip
                        label="clear filters"
                        onDelete={handleResetFilters}
                        disabled={
                            !refineFilterApplied &&
                            !sortFilterApplied &&
                            filter.search === ''
                        }
                    />
                </Stack>
                <GroupMemberList members={filteredMembers} />
            </CardContent>
            <Menu
                open={Boolean(menuState.refine.anchorEl)}
                onClose={() => handleMenuClose('refine')}
                anchorEl={menuState.refine.anchorEl}
            >
                {refineMenuItems.map(({ text, selected, onClick, icon }) => (
                    <MenuItem onClick={onClick} selected={selected} key={text}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText>{text}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
            <Menu
                open={Boolean(menuState.sort.anchorEl)}
                onClose={() => handleMenuClose('sort')}
                anchorEl={menuState.sort.anchorEl}
            >
                {sortMenuItems.map(({ text, selected, onClick, icon }) => (
                    <MenuItem onClick={onClick} selected={selected} key={text}>
                        <ListItemIcon>{selected ? icon : null}</ListItemIcon>
                        <ListItemText>{text}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </Card>
    );
};

export default MainContent;
