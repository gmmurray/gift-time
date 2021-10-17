import { Auth } from '@supabase/ui';
import GiftTable from '../../../components/gifts/GiftTable';
import { useGetOwnGifts } from '../../../domain/services/giftService';

const PrivateGifts = () => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetOwnGifts(user?.id, true);

    return (
        <GiftTable title="my private gifts" data={data} isLoading={isLoading} />
    );
};

export default PrivateGifts;
