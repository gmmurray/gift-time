import { Gift, GiftWithClaim, GiftsTable } from '../entities/Gift';
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

export const getGroupGifts = async (member_ids: string[], user_id?: string) => {
    const { data, error } = await supabaseClient
        .from<GiftWithClaim>(GiftsTable)
        .select(
            '*, claimed_by:claimed_gift_id(*, claimed_by_user:claimed_by (*))',
        )
        .match({ is_private: false })
        .not('user_id', 'eq', user_id)
        .in('user_id', member_ids);

    if (error) throw error.message;

    return data ?? [];
};

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
                queryClient.invalidateQueries(getOwnGiftsKey());
            },
        },
    );
//#endregion
