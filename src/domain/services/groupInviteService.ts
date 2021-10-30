import {
    GroupInvite,
    GroupInviteWithGroup,
    GroupInviteWithProfile,
    GroupInvitesTable,
} from '../entities/GroupInvite';
import { useMutation, useQuery } from 'react-query';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { getUserProfileByEmail } from './userProfileService';
import { groupQueryKeys } from './groupService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

export const groupInviteQueryKeys = {
    all: [GroupInvitesTable] as const,
    lists: () => [...groupInviteQueryKeys.all, 'list'] as const,
    query: (...args: any[]) =>
        [...groupInviteQueryKeys.lists(), { ...args }] as const,
    list: (name: string, ...args: any[]) =>
        [...groupInviteQueryKeys.lists(), { name, ...args }] as const,
    details: () => [...groupInviteQueryKeys.all, 'detail'] as const,
    detail: (id?: number) => [...groupInviteQueryKeys.details(), id] as const,
};

//#region get
const getGroupInvitesByGroup = async (group_id?: number) => {
    if (!group_id) return;
    const { data, error } = await supabaseClient
        .from<GroupInviteWithProfile>(GroupInvitesTable)
        .select(`*, user:user_id (*)`)
        .match({ group_id });

    if (error) throw error.message;
    return data;
};

export const useGetGroupInvitesByGroup = (group_id?: number) =>
    useQuery(
        groupInviteQueryKeys.query(group_id),
        () => getGroupInvitesByGroup(group_id),
        {
            staleTime: defaultQueryCacheTime,
            retry: 2,
            enabled: !!group_id,
        },
    );

const getGroupInvitesByUser = async (user_id?: string) => {
    if (!user_id) return;
    const { data, error } = await supabaseClient
        .from<GroupInviteWithGroup>(GroupInvitesTable)
        .select('*, groups (*, user:owner_id (*))')
        .match({ user_id });

    if (error) throw error.message;
    return data;
};

export const useGetGroupInvitesByUser = (user_id?: string) =>
    useQuery(
        groupInviteQueryKeys.query(user_id),
        () => getGroupInvitesByUser(user_id),
        {
            staleTime: defaultQueryCacheTime,
            retry: 2,
        },
    );
//#endregion

//#region delete
export const deleteGroupInvite = async (group_invite_id: number) => {
    const { data, error } = await supabaseClient
        .from<GroupInvite>(GroupInvitesTable)
        .delete()
        .match({ group_invite_id });

    if (error) throw error.message;
    return data;
};

export const useDeleteGroupInvite = () =>
    useMutation(
        (group_invite_id: number) => deleteGroupInvite(group_invite_id),
        {
            onSuccess: () =>
                queryClient.invalidateQueries(groupInviteQueryKeys.all),
        },
    );
//#endregion

//#region other
const inviteUserToGroup = async (email: string, group_id: number) => {
    const userProfile = await getUserProfileByEmail(email);

    if (userProfile === null) throw Error('user could not be found');

    const { data: inviteData, error: inviteError } = await supabaseClient
        .from<GroupInvite>(GroupInvitesTable)
        .insert({ group_id, user_id: userProfile.user_id });

    if (inviteError) throw inviteError.message;

    return inviteData;
};

export const useInviteUserToGroup = () =>
    useMutation(
        (params: { email: string; group_id: number }) =>
            inviteUserToGroup(params.email, params.group_id),
        {
            onSuccess: data => {
                queryClient.invalidateQueries(
                    groupQueryKeys.owned(data![0].user_id),
                );
                queryClient.invalidateQueries(groupInviteQueryKeys.lists());
            },
        },
    );
//#endregion
