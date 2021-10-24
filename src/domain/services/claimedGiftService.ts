import { useMutation, useQuery } from 'react-query';

import { ClaimedGiftWithGift } from '../entities/ClaimedGift';
import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { getGroupGiftKey } from './groupService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';

export const ClaimedGiftsTable = 'claimed_gifts';

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
const getMostRecentPurchaseKey = getMostRecentPurchase.name + 'key';

export const useGetMostRecentPurchase = (user_id?: string) =>
    useQuery(getMostRecentPurchaseKey, () => getMostRecentPurchase(user_id), {
        staleTime: defaultQueryCacheTime,
        retry: 0,
        enabled: !!user_id,
    });

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
        onSuccess: () => queryClient.invalidateQueries(getGroupGiftKey()),
    });
