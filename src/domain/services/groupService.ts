import * as giftService from './giftService';
import * as groupMemberService from './groupMemberService';

import { GiftWithClaimUser, GiftWithGroupMembers } from '../entities/Gift';
import { Group, GroupGiftResult, GroupsTable } from '../entities/Group';
import { GroupInvite, GroupInvitesTable } from '../entities/GroupInvite';
import {
    GroupMember,
    GroupMemberWithGroup,
    GroupMembersTable,
} from '../entities/GroupMember';
import { useMutation, useQuery } from 'react-query';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { groupInviteQueryKeys } from './groupInviteService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

export const groupQueryKeys = {
    all: [GroupsTable] as const,
    lists: () => [...groupQueryKeys.all, 'list'] as const,
    list: (name: string, ...args: any[]) =>
        [...groupQueryKeys.lists(), { name, ...args }] as const,
    query: (...args: any[]) =>
        [...groupQueryKeys.lists(), { ...args }] as const,
    owned: (owner_id?: string) =>
        [...groupQueryKeys.list('owned', owner_id)] as const,
    joined: (user_id?: string) =>
        [...groupQueryKeys.list('joined', user_id)] as const,
    groupGift: (group_id?: number) =>
        [...groupQueryKeys.list('group-gift', group_id)] as const,
    upcoming: (user_id?: string) =>
        [...groupQueryKeys.list('upcoming', user_id)] as const,
    statuses: (user_id?: string) =>
        [...groupQueryKeys.list('statuses', user_id)] as const,
    details: () => [...groupQueryKeys.all, 'detail'] as const,
    detail: (id?: number) => [...groupQueryKeys.details(), id] as const,
};

//#region get
const getGroup = async (group_id: number, owner_id?: string) => {
    if (!owner_id) return;
    const { data, error } = await supabaseClient
        .from<Group>(GroupsTable)
        .select()
        .match({ group_id, owner_id })
        .single();

    if (error) throw error.message;

    return data;
};

export const useGetGroup = (group_id: number, owner_id?: string) =>
    useQuery(
        groupQueryKeys.detail(group_id),
        () => getGroup(group_id, owner_id),
        {
            enabled: !!owner_id,
            retry: 2,
            staleTime: defaultQueryCacheTime,
        },
    );

const getOwnedGroups = async (owner_id?: string) => {
    if (!owner_id) return;
    const groups = await supabaseClient
        .from<Group>(GroupsTable)
        .select()
        .match({ owner_id });

    if (groups.error) throw groups.error.message;

    if (groups.data === null) return null;

    const groupIds = groups.data.map(g => g.group_id);

    const membersTask = supabaseClient
        .from<GroupMember>(GroupMembersTable)
        .select(
            `
      group_id,
      created_at,
      user:user_id (
        display_name,
        avatar_url
      )`,
        )
        .in('group_id', groupIds);

    const invitesTask = supabaseClient
        .from<GroupInvite>(GroupInvitesTable)
        .select(
            `
    group_id,
    created_at,
    user:user_id (
      display_name,
      avatar_url
    )`,
        )
        .in('group_id', groupIds);

    const tasks = [membersTask, invitesTask];

    const [
        //@ts-ignore
        { data: memberData, error: memberError },
        //@ts-ignore
        { data: inviteData, error: inviteError },
        //@ts-ignore
    ] = await Promise.all(tasks);

    if (memberError || inviteError) throw [memberError, inviteError].join(';');

    return groups.data.map(g => ({
        ...g,
        members:
            (memberData as GroupMember[] | null)?.filter(
                m => m.group_id === g.group_id,
            ) ?? [],
        invitations:
            (inviteData as GroupInvite[] | null)?.filter(
                i => i.group_id === g.group_id,
            ) ?? [],
    }));
};

export const useGetOwnedGroups = (owner_id?: string) =>
    useQuery(groupQueryKeys.owned(owner_id), () => getOwnedGroups(owner_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!owner_id,
    });

const getJoinedGroup = async (group_id?: number, user_id?: string) => {
    if (!group_id || !user_id) return null;
    const { data, error } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, group:group_id (*, user:owner_id (*))')
        .match({ user_id, group_id })
        .single();

    if (error) throw error.message;

    return data;
};

const getJoinedGroups = async (user_id?: string) => {
    if (!user_id) return [];

    const { data: memberData, error: memberError } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, group:group_id (*, user:owner_id (*))')
        .match({ user_id, is_owner: false });

    if (memberError) throw memberError.message;

    if (!memberData || memberData.length === 0) return [];

    return memberData.map(m => m.group);
};

export const useGetJoinedGroups = (user_id?: string) =>
    useQuery(groupQueryKeys.joined(user_id), () => getJoinedGroups(user_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!user_id,
    });

const getGroupGift = async (group_id?: number, user_id?: string) => {
    if (!group_id || !user_id) return null;

    // first get the group
    const groupMemberWithGroup = await getJoinedGroup(group_id, user_id);

    if (!groupMemberWithGroup) return null;

    // then get the group members (not including the user)
    const groupMembers = await groupMemberService.getGroupGiftMembers(
        group_id,
        user_id,
    );

    // get their gifts
    const gifts = await giftService.getGroupGifts(
        groupMembers.map(gm => gm.user_id),
        user_id,
    );

    const members = groupMembers.map(gm => ({
        ...gm,
        gifts: [] as GiftWithClaimUser[],
    }));

    // assign gifts to respective members
    gifts.forEach(g => {
        const member = members.find(m => m.user_id === g.user_id);
        if (member) {
            member.gifts = [...member.gifts, g];
        }
    });

    const result: GroupGiftResult = {
        ...groupMemberWithGroup.group,
        members,
    };

    return result;
};

export const useGetGroupGift = (group_id?: number, user_id?: string) =>
    useQuery(
        groupQueryKeys.groupGift(group_id),
        () => getGroupGift(group_id, user_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!group_id && !!user_id,
            retry: 0,
        },
    );

const getUpcomingGroups = async (user_id?: string) => {
    if (!user_id) return [];
    const groupMembers = await groupMemberService.getUpcomingGroupMembers(
        user_id,
        5,
    );
    return groupMembers.map(m => m.group);
};

export const useGetUpcomingGroups = (user_id?: string) =>
    useQuery(
        groupQueryKeys.upcoming(user_id),
        () => getUpcomingGroups(user_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!user_id,
            retry: 0,
        },
    );

// get the status of the groups owned by the given user
const getMyGroupsStatuses = async (user_id?: string) => {
    if (!user_id) return [];

    // get all the groups the current user is a member of
    const memberships = await groupMemberService.getGroupMembersByUser(user_id);
    const groups = memberships.map(m => m.group);

    const group_ids = groups.map(g => g.group_id);

    // get all the gifts (not including user) related to users in these groups
    const gifts = await giftService.getAllGiftsInGroups(group_ids, user_id);

    const result: { group: Group; gifts: GiftWithGroupMembers[] }[] = (
        groups ?? []
    )
        .filter(g => new Date(g.due_date) >= new Date())
        .map(g => ({
            group: { ...g },
            gifts: gifts
                .filter(gift =>
                    gift.members.some(m => m.group_id === g.group_id),
                )
                .filter(
                    (value, index, self) =>
                        self.findIndex(gm => gm.gift_id === value.gift_id) ===
                        index,
                ),
        }))
        .sort((a, b) => (a.gifts.length > b.gifts.length ? -1 : 1))
        .slice(0, 3);
    return result;
};

export const useGetMyGroupStatuses = (user_id?: string) =>
    useQuery(
        groupQueryKeys.statuses(user_id),
        () => getMyGroupsStatuses(user_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!user_id,
            retry: 0,
        },
    );

//#endregion

//#region create
const createGroup = async (group: Partial<Group>) => {
    const { data, error } = await supabaseClient
        .from<Group>(GroupsTable)
        .insert(group);

    if (error) throw error.message;

    const { group_id, owner_id } = data![0];

    await groupMemberService.createGroupMember(group_id, owner_id, true);

    return data;
};

export const useCreateGroup = () =>
    useMutation((group: Partial<Group>) => createGroup(group), {
        onSuccess: () => queryClient.invalidateQueries(groupQueryKeys.lists()),
    });
//#endregion

//#region update
const updateGroup = async (group: Group) => {
    const { data, error } = await supabaseClient
        .from<Group>(GroupsTable)
        .upsert(group);

    if (error) throw error.message;

    return data;
};

export const useUpdateGroup = () =>
    useMutation((group: Group) => updateGroup(group), {
        onSuccess: group => {
            queryClient.invalidateQueries(
                groupQueryKeys.detail(group![0].group_id),
            );
            queryClient.invalidateQueries(groupQueryKeys.lists());
        },
    });
//#endregion

//#region delete
const deleteGroup = async (group_id: number) => {
    const { data, error } = await supabaseClient.rpc('delete_group', {
        input_group_id: group_id,
    });

    if (error) throw error.message;

    return data;
};

export const useDeleteGroup = () =>
    useMutation((group_id: number) => deleteGroup(group_id), {
        onSettled: () => {
            queryClient.invalidateQueries(groupQueryKeys.all);
            queryClient.invalidateQueries(groupInviteQueryKeys.all);
        },
    });
//#endregion

//#region other
// returns the group if the user is the owner; else null
const getGroupWithEditAccess = async (group_id?: number, user_id?: string) => {
    if (!group_id || !user_id) return null;
    const { data, error } = await supabaseClient
        .from<Group>(GroupsTable)
        .select()
        .match({ group_id, owner_id: user_id });

    if (error) throw error.message;

    return data ? data[0] : null;
};

export const useGetGroupWithEditAccess = (
    group_id?: number,
    user_id?: string,
) =>
    useQuery(
        groupQueryKeys.query(group_id, user_id),
        () => getGroupWithEditAccess(group_id, user_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!user_id && !!group_id,
            retry: 0,
        },
    );
//#endregion
