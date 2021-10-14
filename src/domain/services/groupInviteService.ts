import {
    GroupInvite,
    GroupInviteWithGroup,
    GroupInviteWithProfile,
    GroupInvitesTable,
} from '../entities/GroupInvite';
import { useMutation, useQuery } from 'react-query';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { getOwnedGroupsKey } from './groupService';
import { getUserProfileByEmail } from './userProfileService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

//#region get
export const getGroupInvitesByGroupKey = (group_id?: number) =>
    group_id
        ? `get-group-invites-by-group-${group_id}`
        : 'get-group-invites-by-group';
const getGroupInvitesByGroup = async (group_id?: number) => {
    if (!group_id) return;
    const { data, error } = await supabaseClient
        .from<GroupInviteWithProfile>(GroupInvitesTable)
        .select(`*, user_profiles (*)`)
        .match({ group_id });

    if (error) throw error.message;
    return data;
};

export const useGetGroupInvitesByGroup = (group_id?: number) =>
    useQuery(
        getGroupInvitesByGroupKey(group_id),
        () => getGroupInvitesByGroup(group_id),
        {
            staleTime: defaultQueryCacheTime,
            retry: 2,
            enabled: !!group_id,
        },
    );

export const getGroupInvitesByUserKey = 'get-group-invites-by-user';
const getGroupInvitesByUser = async (user_id?: string) => {
    if (!user_id) return;
    const { data, error } = await supabaseClient
        .from<GroupInviteWithGroup>(GroupInvitesTable)
        .select('*, groups (*, user_profiles:owner_id (*))')
        .match({ user_id });

    if (error) throw error.message;
    return data;
};

export const useGetGroupInvitesByUser = (user_id?: string) =>
    useQuery(getGroupInvitesByUserKey, () => getGroupInvitesByUser(user_id), {
        staleTime: defaultQueryCacheTime,
        retry: 2,
    });
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
            onSuccess: () => {
                queryClient.invalidateQueries(getGroupInvitesByUserKey);
                queryClient.invalidateQueries(getGroupInvitesByGroupKey());
            },
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
                queryClient.invalidateQueries(getOwnedGroupsKey);
                queryClient.invalidateQueries(
                    getGroupInvitesByGroupKey(data![0].group_id),
                );
            },
        },
    );
//#endregion
