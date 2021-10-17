import * as groupMemberService from './groupMemberService';

import { Gift, GiftsTable, GroupGift } from '../entities/Gift';
import { useMutation, useQuery } from 'react-query';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

//#region get
const getOwnSingleGiftKey = (gift_id?: number) =>
    `get-own-single-gift${gift_id ? `-${gift_id}` : ''}`;
const getOwnSingleGift = async (gift_id?: number, user_id?: string) => {
    if (!user_id || !gift_id) return null;

    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .select(
            'gift_id, created_at, user_id, name, description, price, web_link, priority, is_private',
        )
        .match({ user_id, gift_id })
        .single();

    if (error) throw error.message;

    return data;
};

export const useGetOwnSingleGift = (gift_id?: number, user_id?: string) =>
    useQuery(
        getOwnSingleGiftKey(gift_id),
        () => getOwnSingleGift(gift_id, user_id),
        {
            enabled: !!user_id && !!gift_id,
            retry: 2,
            staleTime: defaultQueryCacheTime,
        },
    );

const getOwnGiftsKey = (is_private?: boolean) =>
    is_private === undefined
        ? 'get-own-gifts'
        : `get-own-gifts?q=is_private=${
              is_private === true ? 'true' : 'false'
          }`;
const getOwnGifts = async (user_id?: string, is_private?: boolean) => {
    if (!user_id) return [];

    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .select(
            'gift_id, created_at, user_id, name, description, price, web_link, priority, is_private',
        )
        .match({ user_id, is_private });

    if (error) throw error.message;

    return data ?? [];
};

export const useGetOwnGifts = (user_id?: string, is_private?: boolean) =>
    useQuery(
        getOwnGiftsKey(is_private),
        () => getOwnGifts(user_id, is_private),
        {
            enabled: !!user_id,
            retry: 2,
            staleTime: defaultQueryCacheTime,
        },
    );

const getGroupGiftsKey = 'get-group-gifts';
const getGroupGifts = async (user_id?: string, group_id?: number) => {
    if (!user_id || !group_id) return [];

    const groupMember = await groupMemberService.getGroupMember(
        user_id,
        group_id,
    );

    if (!groupMember) throw Error('you do not have access');

    const { data, error } = await supabaseClient
        .from<GroupGift>(GiftsTable)
        .select(
            'gift_id, created_at, name, description, price, web_link, priority, is_private, priority, claimed_by, user_profiles (*)',
        )
        .match({ group_id, user_id: !user_id });

    if (error) throw error.message;

    return data ?? [];
};

export const useGetGroupGifts = (user_id?: string, group_id?: number) =>
    useQuery(getGroupGiftsKey, () => getGroupGifts(user_id, group_id), {
        enabled: !!user_id && !!group_id,
        retry: 2,
        staleTime: defaultQueryCacheTime,
    });
//#endregion

//#region create
const createGift = async (gift: Partial<Gift>) => {
    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .insert(gift)
        .single();

    if (error) throw error.message;

    return data;
};

export const useCreateGift = () =>
    useMutation((gift: Partial<Gift>) => createGift(gift), {
        onSuccess: gift => {
            queryClient.invalidateQueries(getOwnGiftsKey(gift?.is_private));
            queryClient.invalidateQueries(getOwnSingleGiftKey(gift?.gift_id));
        },
    });
//#endregion

//#region update
const updateGift = async (gift: Gift) => {
    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .upsert(gift)
        .single();

    if (error) throw error.message;

    return data;
};

export const useUpdateGift = () =>
    useMutation((gift: Gift) => updateGift(gift), {
        onSuccess: gift =>
            queryClient.invalidateQueries(getOwnGiftsKey(gift?.is_private)),
    });

const patchGroupGift = async (
    key: keyof GroupGift,
    value: GroupGift,
    gift_id?: number,
) => {
    if (!gift_id) return null;

    const { data, error } = await supabaseClient
        .from<GroupGift>(GiftsTable)
        .update({ [key]: value[key] })
        .match({ gift_id })
        .single();

    if (error) throw error.message;

    return data;
};

type patchGroupGiftParams = {
    key: keyof GroupGift;
    value: GroupGift;
    gift_id?: number;
};
export const usePatchGroupGift = () =>
    useMutation(
        ({ key, value, gift_id }: patchGroupGiftParams) =>
            patchGroupGift(key, value, gift_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(getGroupGiftsKey);
                queryClient.invalidateQueries(getOwnGiftsKey());
            },
        },
    );
//#endregion

//#region delete
const deleteGift = async (gift_id?: number, user_id?: string) => {
    if (!gift_id || !user_id) return null;

    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .delete()
        .match({ gift_id, user_id })
        .single();

    if (error) throw error.message;
    return data;
};

type deleteGiftParams = { gift_id?: number; user_id?: string };
export const useDeleteGift = () =>
    useMutation(
        ({ gift_id, user_id }: deleteGiftParams) =>
            deleteGift(gift_id, user_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(getGroupGiftsKey);
                queryClient.invalidateQueries(getOwnGiftsKey());
            },
        },
    );
//#endregion
