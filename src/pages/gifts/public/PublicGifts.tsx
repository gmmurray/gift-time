import { useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import GiftTable from '../../../components/gifts/GiftTable';
import { useGetOwnGifts } from '../../../domain/services/giftService';

const PublicGifts = () => {
    const { user } = Auth.useUser();
    const [showArchived, setShowArchived] = useState(false);
    const { data, isLoading } = useGetOwnGifts(user?.id, false, showArchived);

    const handleShowArchivedToggle = useCallback(
        () => setShowArchived(state => !state),
        [],
    );

    return (
        <GiftTable
            title="my public gifts"
            data={data}
            isLoading={isLoading}
            showArchived={showArchived}
            onShowArchivedToggle={handleShowArchivedToggle}
        />
    );
};

export default PublicGifts;
