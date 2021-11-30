import { Auth } from '@supabase/ui';
import ClaimedGiftTable from '../../../components/gifts/ClaimedGiftTable';
import { useGetUserClaimed } from '../../../domain/services/claimedGiftService';

const ClaimedGifts = () => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetUserClaimed(user?.id);

    return (
        <ClaimedGiftTable
            title="claimed or purchased gifts"
            data={data}
            isLoading={isLoading}
        />
    );
};

export default ClaimedGifts;
