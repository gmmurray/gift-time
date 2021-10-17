import { Auth } from '@supabase/ui';
import GiftTable from '../../../components/gifts/GiftTable';
import { useGetOwnGifts } from '../../../domain/services/giftService';

const PublicGifts = () => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetOwnGifts(user?.id, false);

    return (
        <GiftTable title="my public gifts" data={data} isLoading={isLoading} />
    );
};

export default PublicGifts;
