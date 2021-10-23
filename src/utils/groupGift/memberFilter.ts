import { GiftWithClaim } from '../../domain/entities/Gift';
import { GroupGiftMember } from '../../domain/entities/GroupMember';

export type OrderBy = 'claimed-gifts' | 'requested-gifts' | 'name' | null;
export type OrderDir = 'asc' | 'desc';
export type Refine = 'available' | 'claimed' | null;

export type MemberFilter = {
    search: string;
    orderBy: OrderBy;
    orderDir: OrderDir;
    refine: Refine;
};

export const defaultMemberFilter: MemberFilter = {
    search: '',
    orderBy: null,
    orderDir: 'asc',
    refine: null,
};

export type FilterMenuState = {
    refine: {
        anchorEl: HTMLElement | null;
    };
    sort: {
        anchorEl: HTMLElement | null;
    };
};

export type FilterMenuItem = {
    text: string;
    icon?: React.ReactElement;
    selected: boolean;
    onClick: () => any;
};

export const getSearchClause = (search: string, display_name: string) =>
    display_name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
export const getRefineClause = (refine: Refine, gifts: GiftWithClaim[]) => {
    if (!refine) return true;
    else if (refine === 'available') {
        return gifts.some(g => !g.claimed_by);
    } else {
        return gifts.every(g => !!g.claimed_by);
    }
};

export const applyFilter = (
    filter: MemberFilter,
    members: GroupGiftMember[],
) => {
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
