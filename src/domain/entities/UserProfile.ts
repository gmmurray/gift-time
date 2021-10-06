export interface UserProfile {
    user_id: string;
    created_at: Date;
    display_name: string;
    avatar_url: string | null;
}

export const UserProfilesTable = 'user_profiles';
