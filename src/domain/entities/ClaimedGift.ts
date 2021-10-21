import { DbEntity } from './DbEntity';
import { UserProfile } from './UserProfile';

export interface ClaimedGift extends DbEntity {
    claimed_gift_id: number;
    gift_id: number;
    status_id: number;
    claimed_by: string;
}

export interface ClaimedGiftWithUser extends ClaimedGift {
    claimed_by_user: UserProfile;
}
