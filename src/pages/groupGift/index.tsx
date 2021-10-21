import {
    GroupGiftContext,
    IGroupGiftContext,
} from '../../utils/contexts/groupGiftContext';
import { useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import { Button } from '@mui/material';
import DataError from '../../components/shared/DataError';
import DataLoadingSpinner from '../../components/shared/DataLoadingSpinner';
import { GroupGiftMember } from '../../domain/entities/GroupMember';
import { Link } from 'react-router-dom';
import MainContent from '../../components/groupGift/MainContent';
import { useGetGroupGift } from '../../domain/services/groupService';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const GroupGift = () => {
    const { user } = Auth.useUser();
    const { enqueueSnackbar } = useSnackbar();
    const { group_id } = useParams();

    const [selectedMember, setSelectedMember] =
        useState<GroupGiftMember | null>(null);

    const resolvedGroupId = group_id ? parseInt(group_id) : undefined;

    const { data, isLoading } = useGetGroupGift(resolvedGroupId, user?.id);

    const handleSelectMember = useCallback((member?: GroupGiftMember) => {
        setSelectedMember(member ?? null);
    }, []);

    if (isLoading) {
        return <DataLoadingSpinner />;
    } else if (!data) {
        return (
            <DataError message="could not find this group">
                <Button
                    component={Link}
                    to="/groups/joined"
                    variant="contained"
                >
                    back to groups
                </Button>
            </DataError>
        );
    }

    const providerValue: IGroupGiftContext = {
        selectedMember,
        members: data.members,
        onSelectMember: handleSelectMember,
    };

    const renderContent = () => {
        if (selectedMember) {
            return <div onClick={() => handleSelectMember()}>hi</div>;
        }
        return (
            <MainContent
                ownerProfile={data.user}
                groupImage={data.image_url}
                groupName={data.name}
            />
        );
    };

    return (
        <GroupGiftContext.Provider value={providerValue}>
            {renderContent()}
        </GroupGiftContext.Provider>
    );
};

export default GroupGift;
