import { DbEntity } from './DbEntity';
import { GroupWithUser } from './Group';
import { UserProfile } from './UserProfile';

export const GroupInvitesTable = 'group_invites';

export interface GroupInvite extends DbEntity {
    group_invite_id: number;
    user_id: string;
    group_id: number;
}

export interface GroupInviteWithProfile extends GroupInvite {
    user: UserProfile;
}

export interface GroupInviteWithGroup extends GroupInvite {
    groups: GroupWithUser;
}
