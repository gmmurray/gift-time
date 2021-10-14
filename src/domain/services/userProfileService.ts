import { UserProfile, UserProfilesTable } from '../entities/UserProfile';
import { useMutation, useQuery } from 'react-query';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

//#region get
export const getCurrentUserProfileKey = 'get-current-user-profile';
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
    useQuery(getCurrentUserProfileKey, () => getUserProfile(user_id), {
        staleTime: defaultQueryCacheTime,
        enabled: !!user_id,
        retry: 2,
    });
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
            queryClient.invalidateQueries(getCurrentUserProfileKey),
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
            queryClient.invalidateQueries(getCurrentUserProfileKey),
    });
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
