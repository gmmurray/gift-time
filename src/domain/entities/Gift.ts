import { ClaimedGiftWithUser } from './ClaimedGift';
import { DbEntity } from './DbEntity';
import { PriorityTypeEnum } from '../../lib/constants/priorityTypes';

export const GiftsTable = 'gifts';

export interface Gift extends DbEntity {
    gift_id: number;
    user_id: string;
    name: string;
    description: string;
    price: number;
    web_link: string;
    is_private: boolean;
    priority: PriorityTypeEnum;
}

export interface GiftWithClaim extends Gift {
    claimed_by?: ClaimedGiftWithUser;
}
