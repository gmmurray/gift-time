import { DbEntity } from './DbEntity';
import { GiftWithClaimUser } from './Gift';
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
    user: UserProfile;
}

export interface GroupGiftMember extends GroupMember {
    user: UserProfile;
    gifts: GiftWithClaimUser[];
}

export interface GroupMemberWithGroup extends GroupMember {
    group: GroupWithUser;
}

export interface GroupMemberWithGroupAndUser extends GroupMemberWithGroup {
    user: UserProfile;
}
