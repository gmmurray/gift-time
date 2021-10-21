import { ClaimedGiftWithUser } from './ClaimedGift';
import { DbEntity } from './DbEntity';

export const GiftsTable = 'gifts';

export interface Gift extends DbEntity {
    gift_id: number;
    user_id: string;
    name: string;
    description: string;
    price: number;
    web_link: string;
    is_private: boolean;
    priority: number;
}

export interface GiftWithClaim extends Gift {
    claimed_by?: ClaimedGiftWithUser;
}
