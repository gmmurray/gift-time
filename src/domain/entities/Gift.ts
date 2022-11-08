import { ClaimedGift, ClaimedGiftWithUser } from './ClaimedGift';

import { DbEntity } from './DbEntity';
import { GroupMember } from './GroupMember';
import { PriorityTypeEnum } from '../../lib/constants/priorityTypes';
import { UserProfile } from './UserProfile';

export const GiftsTable = 'gifts';

export interface Gift extends DbEntity {
    gift_id: number;
    user_id: string;
    name: string;
    description: string;
    price: number;
    web_link: string;
    is_private: boolean;
    is_archived: boolean;
    priority: PriorityTypeEnum;
}

export interface GiftWithClaimUser extends Gift {
    claimed_by?: ClaimedGiftWithUser;
}

export interface GiftWithClaim extends Gift {
    claimed_by?: ClaimedGift;
}

export interface GiftWithUser extends Gift {
    user: UserProfile;
}

export interface GiftWithUserAndGroups extends GiftWithUser {
    groups: { id: number; name: string }[];
}

export interface GiftWithGroupMembers extends GiftWithClaim {
    members: GroupMember[];
}
