import { DbEntity } from './DbEntity';
import { GiftWithUser } from './Gift';
import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import { UserProfile } from './UserProfile';

export interface ClaimedGift extends DbEntity {
    claimed_gift_id: number;
    gift_id: number;
    status_id: StatusTypeEnum;
    claimed_by: string;
    modified_at: Date;
}

export interface ClaimedGiftWithUser extends ClaimedGift {
    claimed_by_user: UserProfile;
}

export interface ClaimedGiftWithGift extends ClaimedGift {
    gift: GiftWithUser;
}
