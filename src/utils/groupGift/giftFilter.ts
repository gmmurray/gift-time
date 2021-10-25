import { GiftWithClaimUser } from '../../domain/entities/Gift';
import { PriorityTypeEnum } from '../../lib/constants/priorityTypes';

export type GiftFilter = {
    search: string;
    available: boolean;
    claimedByUser: boolean;
    priority: boolean;
};

export const defaultGiftFilter: GiftFilter = {
    search: '',
    available: false,
    claimedByUser: false,
    priority: false,
};

const getSearchClause = (search: string, gift: GiftWithClaimUser) =>
    gift.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
const getAvailableClause = (available: boolean, gift: GiftWithClaimUser) =>
    available ? gift.claimed_by === null : true;
const getClaimedByUserClause = (
    claimedByUser: boolean,
    user_id: string,
    gift: GiftWithClaimUser,
) =>
    claimedByUser
        ? gift.claimed_by && gift.claimed_by.claimed_by === user_id
        : true;
const getPriorityClause = (priority: boolean, gift: GiftWithClaimUser) =>
    priority ? gift.priority === PriorityTypeEnum.high : true;

export const applyFilter = (
    filter: GiftFilter,
    gifts: GiftWithClaimUser[],
    user_id: string,
) => {
    const { search, available, claimedByUser, priority } = filter;
    let result = [...gifts];
    return result.filter(
        g =>
            getSearchClause(search, g) &&
            getAvailableClause(available, g) &&
            getClaimedByUserClause(claimedByUser, user_id, g) &&
            getPriorityClause(priority, g),
    );
};

export const applyDefaultFilter = (
    gifts: GiftWithClaimUser[],
    user_id: string,
) => applyFilter(defaultGiftFilter, gifts, user_id);
