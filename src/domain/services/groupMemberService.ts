import * as groupInviteService from './groupInviteService';

import { Group, GroupsTable } from '../entities/Group';
import {
    GroupMember,
    GroupMemberWithGroup,
    GroupMemberWithProfile,
    GroupMembersTable,
} from '../entities/GroupMember';
import { useMutation, useQuery } from 'react-query';

import { GroupInvite } from '../entities/GroupInvite';
import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { getJoinedGroupsKey } from './groupService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

//#region get
export const getGroupMembersByUser = async (user_id?: string) => {
    if (!user_id) return [];
    const { data, error } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, groups:group_id(*)')
        .match({ user_id });

    if (error) throw error.message;

    return data ?? [];
};

export const getGroupMembersByGroupsWithoutCurrUser = async (
    groupIds: number[],
    user_id?: string,
) => {
    if (!user_id) return [];
    const { data, error } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, groups:group_id (*)')
        .in('group_id', groupIds)
        .not('user_id', 'eq', user_id);
    if (error) throw error.message;

    return data ?? [];
};
export const getGroupGiftMembers = async (
    group_id?: number,
    user_id?: string,
) => {
    if (!group_id || !user_id) return [];

    const { data, error } = await supabaseClient
        .from<GroupMemberWithProfile>(GroupMembersTable)
        .select('*, user:user_id (*)')
        .match({ group_id })
        .not('user_id', 'eq', user_id);

    if (error) throw error.message;

    return data ?? [];
};

export const getGroupMembersByGroupKey = (group_id?: number) =>
    group_id
        ? `get-group-members-by-group-${group_id}`
        : 'get-group-members-by-group';
const getGroupMembersByGroup = async (group_id?: number) => {
    if (!group_id) return;
    const { data, error } = await supabaseClient
        .from<GroupMemberWithProfile>(GroupMembersTable)
        .select('*, user:user_id (*)')
        .match({ group_id });

    if (error) throw error.message;

    return data;
};

export const useGetGroupMembersByGroup = (group_id?: number) =>
    useQuery(
        getGroupMembersByGroupKey(group_id),
        () => getGroupMembersByGroup(group_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!group_id,
        },
    );

export const getGroupMember = async (user_id?: string, group_id?: number) => {
    if (!user_id || !group_id) return null;

    const { data, error } = await supabaseClient
        .from<GroupMember>(GroupMembersTable)
        .select()
        .match({ user_id, group_id })
        .single();

    if (error) throw error.message;

    return data;
};

// retrieves group members ordered by their corresponding group due dates
export const getUpcomingGroupMembers = async (
    user_id?: string,
    limit?: number,
) => {
    if (!user_id) return [];

    const { data, error } = await supabaseClient
        .from<GroupMemberWithGroup>(GroupMembersTable)
        .select('*, groups:group_id(*)')
        .match({ user_id })
        // @ts-ignore
        .order('due_date', { foreignTable: 'groups', ascending: false })
        .limit(limit ?? 25);

    if (error) throw error.message;

    return data ?? [];
};
//#endregion

//#region create
export const createGroupMember = async (
    group_id: number,
    user_id: string,
    is_owner: boolean,
) => {
    const { data, error } = await supabaseClient
        .from<GroupMember>(GroupMembersTable)
        .insert({ group_id, user_id, is_owner });

    if (error) throw error.message;

    return data;
};
//#endregion

//#region delete
const deleteGroupMember = async (group_member_id: number) => {
    const { data, error } = await supabaseClient
        .from<GroupMember>(GroupMembersTable)
        .delete()
        .match({ group_member_id });

    if (error) throw error.message;

    return data;
};

export const useDeleteGroupMember = () =>
    useMutation(
        (group_member_id: number) => deleteGroupMember(group_member_id),
        {
            onSuccess: data =>
                queryClient.invalidateQueries(
                    getGroupMembersByGroupKey(data![0].group_id),
                ),
        },
    );
//#endregion

//#region other
const acceptGroupInvite = async (invite: GroupInvite) => {
    const { data: groupData, error: groupError } = await supabaseClient
        .from<Group>(GroupsTable)
        .select()
        .match({ group_id: invite.group_id })
        .single();

    if (groupError) throw groupError.message;

    // delete the invite if the corresponding group was deleted somehow
    if (groupData === null) {
        await groupInviteService.deleteGroupInvite(invite.group_invite_id);
        throw Error('that group could not be found');
    }

    // deletes group invite and create group member in a tx
    const { data: acceptRes, error: acceptError } = await supabaseClient.rpc(
        'accept_invite',
        {
            input_group_id: invite.group_id,
            input_user_id: invite.user_id,
        },
    );

    if (acceptError) throw acceptError.message;

    return acceptRes;
};

export const useAcceptGroupInvite = () =>
    useMutation((invite: GroupInvite) => acceptGroupInvite(invite), {
        onSuccess: () => {
            queryClient.invalidateQueries(
                groupInviteService.getGroupInvitesByUserKey,
            );
            queryClient.invalidateQueries(getJoinedGroupsKey);
        },
    });
//#endregion
