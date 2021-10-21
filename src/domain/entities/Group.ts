import { GroupGiftMember, GroupMember } from './GroupMember';

import { DbEntity } from './DbEntity';
import { GroupInvite } from './GroupInvite';
import { UserProfile } from './UserProfile';

export const GroupsTable = 'groups';

export interface Group extends DbEntity {
    group_id: number;
    name: string;
    owner_id: string;
    due_date: Date;
    image_url: string | null;
}

export interface OwnedGroup extends Group {
    members: Partial<GroupMember & { user: Partial<UserProfile> }>[];
    invites: Partial<GroupInvite & { user: Partial<UserProfile> }>[];
}

export interface GroupWithUser extends Group {
    user: UserProfile;
}

export interface GroupGiftResult extends GroupWithUser {
    members: GroupGiftMember[];
}
