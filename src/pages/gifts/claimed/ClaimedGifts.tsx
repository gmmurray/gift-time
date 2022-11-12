import { useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import ClaimedGiftTable from '../../../components/gifts/ClaimedGiftTable';
import { useGetUserClaimed } from '../../../domain/services/claimedGiftService';

const ClaimedGifts = () => {
    const { user } = Auth.useUser();
    const [showRecentOnly, setShowRecentOnly] = useState(true);
    const { data, isLoading } = useGetUserClaimed(user?.id, showRecentOnly);

    const handleRecentOnlyToggle = useCallback(() => {
        setShowRecentOnly(state => !state);
    }, []);

    return (
        <ClaimedGiftTable
            title="claimed or purchased gifts"
            data={data}
            isLoading={isLoading}
            showRecentOnly={showRecentOnly}
            onRecentOnlyToggle={handleRecentOnlyToggle}
        />
    );
};

export default ClaimedGifts;
