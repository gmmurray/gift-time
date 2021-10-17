import { DbEntity } from './DbEntity';
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
    priority: number;
}

export interface GroupGift extends DbEntity {
    status_id: number;
    claimed_by: string;
    user_profiles: UserProfile;
}
