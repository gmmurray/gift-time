import { DbEntity } from './DbEntity';

export interface UserProfile extends DbEntity {
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    email: string;
    version_id: number | null;
}

export const UserProfilesTable = 'user_profiles';
