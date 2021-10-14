import { DbEntity } from './DbEntity';
import { UserProfile } from './UserProfile';

export const GroupMembersTable = 'group_members';

export interface GroupMember extends DbEntity {
    group_member_id: number;
    user_id: string;
    group_id: number;
}

export interface GroupMemberWithProfile extends GroupMember {
    user_profiles: UserProfile;
}
