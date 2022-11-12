import {
    ClaimedGiftWithGift,
    DEFAULT_CLAIMED_GIFT_DISPLAY_MONTHS,
} from '../entities/ClaimedGift';
import { SpendingRange, UserSpending } from '../../lib/types/UserSpending';
import { useMutation, useQuery } from 'react-query';

import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { getDateMonthsAgo } from '../../utils/helpers/dateHelpers';
import { getDateRange } from '../../utils/helpers/dateRange';
import { groupQueryKeys } from './groupService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

export const ClaimedGiftsTable = 'claimed_gifts';

export const claimedGiftQueryKeys = {
    all: [ClaimedGiftsTable] as const,
    lists: () => [...claimedGiftQueryKeys.all, 'list'] as const,
    list: (name: string, ...args: any[]) =>
        [...claimedGiftQueryKeys.lists(), { name, ...args }] as const,
    mostRecentPurchase: (user_id?: string) => [
        ...claimedGiftQueryKeys.list('', 'most-recent-purchase', user_id),
    ],
    userSpending: (range: SpendingRange, user_id?: string) => [
        ...claimedGiftQueryKeys.list('user-spending', range, user_id),
    ],
    userClaimed: (user_id?: string, showRecentOnly?: boolean) => [
        ...claimedGiftQueryKeys.list('user-claimed', user_id, showRecentOnly),
    ],
    details: () => [...claimedGiftQueryKeys.all, 'detail'] as const,
    detail: (id?: number) => [...claimedGiftQueryKeys.details(), id] as const,
};

const getMostRecentPurchase = async (user_id?: string) => {
    if (!user_id) return null;

    const { data, error } = await supabaseClient
        .from<ClaimedGiftWithGift>(ClaimedGiftsTable)
        .select('*, gift:gift_id (*, user:user_id(*))')
        .match({ claimed_by: user_id, status_id: StatusTypeEnum.purchased })
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) throw error.message;

    return data && data.length > 0 ? data[0] : null;
};

export const useGetMostRecentPurchase = (user_id?: string) =>
    useQuery(
        claimedGiftQueryKeys.mostRecentPurchase(user_id),
        () => getMostRecentPurchase(user_id),
        {
            staleTime: defaultQueryCacheTime,
            retry: 0,
            enabled: !!user_id,
        },
    );

const getUserSpending = async (
    range: SpendingRange,
    user_id?: string,
): Promise<UserSpending | null> => {
    if (!user_id) return null;

    const dateRange = getDateRange(range);

    const { data, error } = await supabaseClient
        .from<ClaimedGiftWithGift>(ClaimedGiftsTable)
        .select('*, gift:gift_id (*)')
        .match({ claimed_by: user_id, status_id: StatusTypeEnum.purchased })
        .gte('modified_at', dateRange.start.toISOString())
        .lt('modified_at', dateRange.end.toISOString())
        .order('modified_at', { ascending: true });

    if (error) throw error.message;

    if (!data || data.length === 0) return null;

    return {
        range,
        user_id,
        total: data
            .map(cg => cg.gift.price)
            .reduce((total, current) => total + current),
        dataPoints: data.map(cg => ({
            date: cg.modified_at,
            amount: cg.gift.price,
            name: cg.gift.name,
        })),
    };
};
export const useGetUserSpending = (range: SpendingRange, user_id?: string) =>
    useQuery(
        claimedGiftQueryKeys.userSpending(range),
        () => getUserSpending(range, user_id),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!user_id,
        },
    );

const getUserClaimed = async (user_id?: string, showRecentOnly = false) => {
    if (!user_id) return [];

    let q = supabaseClient
        .from<ClaimedGiftWithGift>(ClaimedGiftsTable)
        .select('*, gift:gift_id (*, user:user_id(*))');

    if (showRecentOnly) {
        q = q.filter(
            'modified_at',
            'gt',
            getDateMonthsAgo(
                DEFAULT_CLAIMED_GIFT_DISPLAY_MONTHS,
                new Date(),
            ).toISOString(),
        );
    }

    const { data, error } = await q
        .match({ claimed_by: user_id })
        .order('modified_at', { ascending: true });

    if (error) throw error.message;

    return (data ?? []).filter(gift => !gift.gift.is_archived);
};
export const useGetUserClaimed = (user_id?: string, showRecentOnly?: boolean) =>
    useQuery(
        claimedGiftQueryKeys.userClaimed(user_id, showRecentOnly),
        () => getUserClaimed(user_id, showRecentOnly),
        {
            staleTime: defaultQueryCacheTime,
            enabled: !!user_id,
        },
    );

type UpdateGiftStatusParams = {
    input_status_id: StatusTypeEnum | null;
    input_gift_id?: number;
    input_user_id?: string;
};

const claimPurchaseGift = async ({
    input_status_id,
    input_gift_id,
    input_user_id,
}: UpdateGiftStatusParams) =>
    await supabaseClient.rpc('update_gift_status', {
        input_user_id,
        input_gift_id,
        input_status_id,
    });

const unclaimGift = async ({ input_gift_id }: UpdateGiftStatusParams) =>
    await supabaseClient.rpc('unclaim_gift', { input_gift_id });

const updateGiftStatus = async (params: UpdateGiftStatusParams) => {
    if (!params.input_gift_id || !params.input_user_id) return null;
    const request =
        params.input_status_id === null ? unclaimGift : claimPurchaseGift;
    const { data, error } = await request(params);

    if (error) throw error.message;

    return data;
};

export const useUpdateGiftStatus = () =>
    useMutation((params: UpdateGiftStatusParams) => updateGiftStatus(params), {
        onSuccess: () => {
            queryClient.invalidateQueries(groupQueryKeys.groupGift());
            queryClient.invalidateQueries(claimedGiftQueryKeys.lists());
        },
    });
