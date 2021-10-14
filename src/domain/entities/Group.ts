import { DbEntity } from './DbEntity';
import { GroupInvite } from './GroupInvite';
import { GroupMember } from './GroupMember';
import { UserProfile } from './UserProfile';

export const GroupsTable = 'groups';

export interface Group extends DbEntity {
    group_id: number;
    name: string;
    owner_id: string;
    due_date: Date;
}

export interface OwnedGroup extends Group {
    members: Partial<GroupMember & { user: Partial<UserProfile> }>[];
    invites: Partial<GroupInvite & { user: Partial<UserProfile> }>[];
}

export interface GroupWithUser extends Group {
    user_profiles: UserProfile;
}
