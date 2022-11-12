import { useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import GiftTable from '../../../components/gifts/GiftTable';
import { useGetOwnGifts } from '../../../domain/services/giftService';

const PrivateGifts = () => {
    const { user } = Auth.useUser();
    const [showArchived, setShowArchived] = useState(false);
    const { data, isLoading } = useGetOwnGifts(user?.id, true, showArchived);

    const handleShowArchivedToggle = useCallback(
        () => setShowArchived(state => !state),
        [],
    );

    return (
        <GiftTable
            title="my private gifts"
            data={data}
            isLoading={isLoading}
            showArchived={showArchived}
            onShowArchivedToggle={handleShowArchivedToggle}
        />
    );
};

export default PrivateGifts;
