import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import { getGroupGiftKey } from './groupService';
import { queryClient } from '../../utils/config/queryClient';
import { supabaseClient } from '../../utils/config/supabase';
import { useMutation } from 'react-query';

export const claimedGiftTable = 'claimed_gifts';

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
