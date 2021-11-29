import { UserProfile, UserProfilesTable } from '../entities/UserProfile';
import { useMutation, useQuery } from 'react-query';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

export const userProfileQueryKeys = {
    all: [UserProfilesTable] as const,
    lists: () => [...userProfileQueryKeys.all, 'list'] as const,
    list: (name: string, ...args: any[]) =>
        [...userProfileQueryKeys.lists(), { name, ...args }] as const,
    details: () => [...userProfileQueryKeys.all, 'detail'] as const,
    detail: (id?: string) => [...userProfileQueryKeys.details(), id] as const,
};

//#region get
const getUserProfile = async (user_id?: string) => {
    if (!user_id) return;
    const { data, error } = await supabaseClient
        .from<UserProfile>(UserProfilesTable)
        .select()
        .match({ user_id })
        .single();

    if (error) throw error.message;

    return data;
};

export const useGetCurrentUserProfile = (user_id?: string) =>
    useQuery(
        userProfileQueryKeys.detail(user_id),
        () => getUserProfile(user_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!user_id,
            retry: 2,
        },
    );
//#endregion

//#region create
const addUserProfile = async (profile: Partial<UserProfile>) => {
    const { data, error } = await supabaseClient
        .from<UserProfile>(UserProfilesTable)
        .insert(profile);

    if (error) throw error.message;

    return data;
};

export const useAddUserProfile = () =>
    useMutation((profile: Partial<UserProfile>) => addUserProfile(profile), {
        onSuccess: () =>
            queryClient.invalidateQueries(userProfileQueryKeys.details()),
    });
//#endregion

//#region update
const updateUserProfile = async (userProfile: UserProfile) => {
    const { data, error } = await supabaseClient
        .from<UserProfile>(UserProfilesTable)
        .upsert(userProfile);

    if (error) throw error.message;
    return data;
};

export const useUpdateUserProfile = () =>
    useMutation((userProfile: UserProfile) => updateUserProfile(userProfile), {
        onSuccess: () =>
            queryClient.invalidateQueries(userProfileQueryKeys.details()),
    });

const patchUserProfile = async (
    user_id: string,
    userProfile: Partial<UserProfile>,
) => {
    const { data, error } = await supabaseClient
        .from<UserProfile>(UserProfilesTable)
        .update(userProfile)
        .match({ user_id });

    if (error) throw error.message;
    return data;
};

export const usePatchUserProfile = () =>
    useMutation(
        (request: { user_id: string; userProfile: Partial<UserProfile> }) =>
            patchUserProfile(request.user_id, request.userProfile),
        {
            onSuccess: () =>
                queryClient.invalidateQueries(userProfileQueryKeys.details()),
        },
    );
//#endregion

//#region other
export const getUserProfileByEmail = async (email: string) => {
    const { data, error } = await supabaseClient
        .from<UserProfile>(UserProfilesTable)
        .select()
        .match({ email })
        .single();

    if (error) throw error.message;
    return data;
};
//#endregion
