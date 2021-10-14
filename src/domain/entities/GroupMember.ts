import { DbEntity } from './DbEntity';
import { GroupWithUser } from './Group';
import { UserProfile } from './UserProfile';

export const GroupMembersTable = 'group_members';

export interface GroupMember extends DbEntity {
    group_member_id: number;
    user_id: string;
    group_id: number;
    is_owner: boolean;
}

export interface GroupMemberWithProfile extends GroupMember {
    user_profiles: UserProfile;
}

export interface GroupMemberWithGroup extends GroupMember {
    groups: GroupWithUser;
}
