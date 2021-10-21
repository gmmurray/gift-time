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
import { Sort, Tune } from '@mui/icons-material';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { GiftWithClaim } from '../../domain/entities/Gift';
import { GroupGiftMember } from '../../domain/entities/GroupMember';
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
};

type OrderBy = 'claimed-gifts' | 'requested-gifts' | 'name' | null;
type OrderDir = 'asc' | 'desc';
type Refine = 'available' | 'claimed' | null;

type MemberFilter = {
    search: string;
    orderBy: OrderBy;
    orderDir: OrderDir;
    refine: Refine;
};

const defaultMemberFilter: MemberFilter = {
    search: '',
    orderBy: null,
    orderDir: 'asc',
    refine: null,
};

type FilterMenuState = {
    refine: {
        anchorEl: HTMLElement | null;
    };
    sort: {
        anchorEl: HTMLElement | null;
    };
};

type FilterMenuItem = {
    text: string;
    icon?: React.ReactElement;
    selected: boolean;
    onClick: () => any;
};

const getSearchClause = (search: string, display_name: string) =>
    display_name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
const getRefineClause = (refine: Refine, gifts: GiftWithClaim[]) => {
    if (!refine) return true;
    else if (refine === 'available') {
        return gifts.some(g => !g.claimed_by);
    } else {
        return gifts.every(g => !!g.claimed_by);
    }
};

const applyFilter = (filter: MemberFilter, members: GroupGiftMember[]) => {
    const { search, orderBy, orderDir, refine } = filter;
    let result = [...members];
    result = result
        .filter(
            m =>
                getSearchClause(search, m.user.display_name) &&
                getRefineClause(refine, m.gifts),
        )
        .sort((a, b) => {
            if (!orderBy) return 0;
            const result = orderDir === 'asc' ? 1 : -1;
            if (orderBy === 'claimed-gifts') {
                return a.gifts.filter(g => !!g.claimed_by).length >
                    b.gifts.filter(g => !!g.claimed_by).length
                    ? result
                    : -result;
            } else if (orderBy === 'requested-gifts') {
                return a.gifts.length > b.gifts.length ? result : -result;
            } else {
                return a.user.display_name > b.user.display_name
                    ? result
                    : -result;
            }
        });
    return result;
};

const MainContent: FC<MainContentProps> = ({
    ownerProfile,
    groupImage,
    groupName,
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
                    <Tooltip title={`${ownerProfile.display_name}'s group'`}>
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
            />
            <CardMedia component="img" src={headerImage} alt="group image" />
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
