import * as groupMemberService from './groupMemberService';

import {
    Gift,
    GiftWithClaimUser,
    GiftWithGroupMembers,
    GiftWithUser,
    GiftWithUserAndGroups,
    GiftsTable,
} from '../entities/Gift';
import { useMutation, useQuery } from 'react-query';

import { GroupMember } from '../entities/GroupMember';
import { PriorityTypeEnum } from '../../lib/constants/priorityTypes';
import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

export const giftQueryKeys = {
    all: [GiftsTable] as const,
    lists: () => [...giftQueryKeys.all, 'list'] as const,
    list: (name: string, ...args: any[]) =>
        [...giftQueryKeys.lists(), { name, ...args }] as const,
    priorityGifts: (user_id?: string) =>
        [...giftQueryKeys.list('priority', user_id)] as const,
    ownSingle: (gift_id?: number, user_id?: string) =>
        [...giftQueryKeys.list('own-single', gift_id, user_id)] as const,
    own: (is_private?: boolean, user_id?: string) => [
        ...giftQueryKeys.list('own', is_private, user_id),
    ],
    details: () => [...giftQueryKeys.all, 'detail'] as const,
    detail: (id?: number) => [...giftQueryKeys.details(), id] as const,
};

//#region get
export const getAllGiftsInGroups = async (
    group_ids: number[],
    user_id?: string,
) => {
    if (!user_id) return [];
    // get all the users that are in these groups minus the current user
    const otherMembers =
        await groupMemberService.getGroupMembersByGroupsWithoutCurrUser(
            group_ids,
            user_id,
        );

    const memberLookup: { [id: string]: GroupMember[] } = {};

    otherMembers.forEach(m => {
        memberLookup[m.user_id] = [...(memberLookup[m.user_id] ?? []), m];
    });

    const otherUserIds = [...Object.keys(memberLookup)];

    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .select('*, claimed_by:claimed_gift_id(*)')
        .in('user_id', otherUserIds)
        .match({ is_private: false, is_archived: false });

    if (error) throw error.message;

    return (data ?? []).map(gift => ({
        ...gift,
        members: memberLookup[gift.user_id],
    })) as GiftWithGroupMembers[];
};

// gets all the high priority gifts (not including the current user) that belong to
// users with which the current user shares a group membership
const getPriorityGifts = async (user_id?: string) => {
    if (!user_id) return [];
    // get all the groups the current user is a member of
    const memberships = await groupMemberService.getGroupMembersByUser(user_id);
    const groupIds = memberships.map(m => m.group_id);

    // get all the users that are in those groups minus the current user
    const otherMembers =
        await groupMemberService.getGroupMembersByGroupsWithoutCurrUser(
            groupIds,
            user_id,
        );
    const otherUserIds = otherMembers.map(m => m.user_id);

    // get all the gifts belonging to those users where priority = high and not private
    const { data, error } = await supabaseClient
        .from<GiftWithUser>(GiftsTable)
        .select('*, user:user_id (*)')
        .in('user_id', otherUserIds)
        .match({
            is_private: false,
            priority: PriorityTypeEnum.high,
            is_archived: false,
        })
        .limit(5)
        .order('created_at', { ascending: false });

    if (error) throw error.message;

    const mutuals: { [key: string]: { id: number; name: string }[] } = {};
    otherMembers.forEach(
        m =>
            (mutuals[m.user_id] = [
                ...(mutuals[m.user_id] ?? []),
                { id: m.group_id, name: m.group.name },
            ]),
    );

    return (data ?? []).map(gift => ({
        ...gift,
        groups: mutuals[gift.user_id],
    })) as GiftWithUserAndGroups[];
};

export const useGetPriorityGifts = (user_id?: string) =>
    useQuery(
        giftQueryKeys.priorityGifts(user_id),
        () => getPriorityGifts(user_id),
        {
            enabled: !!user_id,
            staleTime: defaultQueryCacheTime,
        },
    );

const getOwnSingleGift = async (gift_id?: number, user_id?: string) => {
    if (!user_id || !gift_id) return null;

    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .select(
            'gift_id, created_at, user_id, name, description, price, web_link, priority, is_private, is_archived',
        )
        .match({ user_id, gift_id })
        .single();

    if (error) throw error.message;

    return data;
};

export const useGetOwnSingleGift = (gift_id?: number, user_id?: string) =>
    useQuery(
        giftQueryKeys.ownSingle(gift_id, user_id),
        () => getOwnSingleGift(gift_id, user_id),
        {
            enabled: !!user_id && !!gift_id,
            retry: 2,
            staleTime: defaultQueryCacheTime,
        },
    );

const getOwnGifts = async (user_id?: string, is_private?: boolean) => {
    if (!user_id) return [];

    const { data, error } = await supabaseClient
        .from<Gift>(GiftsTable)
        .select(
            'gift_id, created_at, user_id, name, description, price, web_link, priority, is_private, is_archived',
        )
        .match({ user_id, is_private });

    if (error) throw error.message;

    return data ?? [];
};

export const useGetOwnGifts = (user_id?: string, is_private?: boolean) =>
    useQuery(
        giftQueryKeys.own(is_private, user_id),
        () => getOwnGifts(user_id, is_private),
        {
            enabled: !!user_id,
            retry: 2,
            staleTime: defaultQueryCacheTime,
        },
    );

export const getGroupGifts = async (member_ids: string[], user_id?: string) => {
    const { data, error } = await supabaseClient
        .from<GiftWithClaimUser>(GiftsTable)
        .select(
            '*, claimed_by:claimed_gift_id(*, claimed_by_user:claimed_by (*))',
        )
        .match({ is_private: false, is_archived: false })
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
            const { gift_id, is_private, user_id } = gift ?? {};
            queryClient.invalidateQueries(
                giftQueryKeys.own(is_private, user_id),
            );
            queryClient.invalidateQueries(
                giftQueryKeys.ownSingle(gift_id, user_id),
            );
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
            queryClient.invalidateQueries(
                giftQueryKeys.own(
                    gift?.is_private ?? undefined,
                    gift?.user_id ?? undefined,
                ),
            ),
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
                queryClient.invalidateQueries(giftQueryKeys.lists());
            },
        },
    );
//#endregion
