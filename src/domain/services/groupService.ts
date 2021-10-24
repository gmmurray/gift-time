import * as giftService from './giftService';
import * as groupMemberService from './groupMemberService';

import { Group, GroupGiftResult, GroupsTable } from '../entities/Group';
import { GroupInvite, GroupInvitesTable } from '../entities/GroupInvite';
import {
    GroupMember,
    GroupMemberWithGroup,
    GroupMembersTable,
} from '../entities/GroupMember';
import { useMutation, useQuery } from 'react-query';

import { GiftWithClaim } from '../entities/Gift';
import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { getGroupInvitesByUserKey } from './groupInviteService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

//#region get
export const getGroupKey = (group_id?: number) =>
    group_id ? `get-group-${group_id}` : 'get-group';
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
    useQuery(getGroupKey(group_id), () => getGroup(group_id, owner_id), {
        enabled: !!owner_id,
        retry: 2,
        staleTime: defaultQueryCacheTime,
    });

export const getOwnedGroupsKey = 'get-owned-groups';
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
    useQuery(getOwnedGroupsKey, () => getOwnedGroups(owner_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!owner_id,
    });

const getJoinedGroup = async (group_id?: number, user_id?: string) => {
    if (!group_id || !user_id) return null;
    const { data, error } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, groups (*, user:owner_id (*))')
        .match({ user_id, group_id })
        .single();

    if (error) throw error.message;

    return data;
};

export const getJoinedGroupsKey = 'get-joined-groups';
const getJoinedGroups = async (user_id?: string) => {
    if (!user_id) return [];

    const { data: memberData, error: memberError } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, groups (*, user:owner_id (*))')
        .match({ user_id, is_owner: false });

    if (memberError) throw memberError.message;

    if (!memberData || memberData.length === 0) return [];

    return memberData.map(m => m.groups);
};

export const useGetJoinedGroups = (user_id?: string) =>
    useQuery(getJoinedGroupsKey, () => getJoinedGroups(user_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!user_id,
    });

export const getGroupGiftKey = (group_id?: number) =>
    'load-group-gift' + (group_id ? `-${group_id}` : '');
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
        gifts: [] as GiftWithClaim[],
    }));

    // assign gifts to respective members
    gifts.forEach(g => {
        const member = members.find(m => m.user_id === g.user_id);
        if (member) {
            member.gifts = [...member.gifts, g];
        }
    });

    const result: GroupGiftResult = {
        ...groupMemberWithGroup.groups,
        members,
    };

    return result;
};

export const useGetGroupGift = (group_id?: number, user_id?: string) =>
    useQuery(getGroupGiftKey(group_id), () => getGroupGift(group_id, user_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!group_id && !!user_id,
        retry: 0,
    });

const getUpcomingGroupsKey = 'get-upcoming-groups';
const getUpcomingGroups = async (user_id?: string) => {
    if (!user_id) return [];
    const groupMembers = await groupMemberService.getUpcomingGroupMembers(
        user_id,
        5,
    );
    return groupMembers.map(m => m.groups);
};

export const useGetUpcomingGroups = (user_id?: string) =>
    useQuery(getUpcomingGroupsKey, () => getUpcomingGroups(user_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!user_id,
        retry: 0,
    });
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
        onSuccess: () => queryClient.invalidateQueries(getOwnedGroupsKey),
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
            queryClient.invalidateQueries(getGroupKey(group![0].group_id));
            queryClient.invalidateQueries(getOwnedGroupsKey);
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
            queryClient.invalidateQueries(getOwnedGroupsKey);
            queryClient.invalidateQueries(getGroupInvitesByUserKey);
        },
    });
//#endregion
