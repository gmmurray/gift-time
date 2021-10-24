import {
    GroupGiftContext,
    IGroupGiftContext,
} from '../../utils/contexts/groupGiftContext';
import {
    getGroupGiftKey,
    useGetGroupGift,
} from '../../domain/services/groupService';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Auth } from '@supabase/ui';
import { Button } from '@mui/material';
import DataError from '../../components/shared/DataError';
import DataLoadingSpinner from '../../components/shared/DataLoadingSpinner';
import { GroupGiftMember } from '../../domain/entities/GroupMember';
import GroupMember from '../../components/groupGift/GroupMember';
import { Link } from 'react-router-dom';
import MainContent from '../../components/groupGift/MainContent';
import { queryClient } from '../../utils/config/queryClient';
import { usePageQuery } from '../../lib/hooks/usePageQuery';

const GroupGift = () => {
    const { user } = Auth.useUser();
    const { group_id } = useParams();
    const pageQuery = usePageQuery();
    const queryMemberId = pageQuery.get('group_member_id');
    const queryUserId = pageQuery.get('user_id');
    const navigate = useNavigate();

    const [selectedMember, setSelectedMember] =
        useState<GroupGiftMember | null>(null);

    const resolvedGroupId = group_id ? parseInt(group_id) : undefined;
    const resolvedQueryMemberId = queryMemberId
        ? parseInt(queryMemberId)
        : undefined;

    const { data, isLoading } = useGetGroupGift(resolvedGroupId, user?.id);

    const handleSelectMember = useCallback(
        (member?: GroupGiftMember) => {
            setSelectedMember(member ?? null);
            // update the query params to match the selected member
            if (member)
                navigate(
                    `/group-gift/${resolvedGroupId}?group_member_id=${member.group_member_id}`,
                );
            else navigate(`/group-gift/${resolvedGroupId}`);
        },
        [navigate, resolvedGroupId],
    );

    const handleReloadGroup = useCallback(
        () => queryClient.invalidateQueries(getGroupGiftKey(resolvedGroupId)),
        [resolvedGroupId],
    );

    // manage the selectedMember state when the url includes a group_member_id in the query
    useEffect(() => {
        if (resolvedQueryMemberId && data) {
            const selected = data.members.find(
                m => m.group_member_id === resolvedQueryMemberId,
            );
            setSelectedMember(selected ?? null);
            if (!selected) navigate(`/group-gift/${resolvedGroupId}`);
        }
    }, [data, navigate, resolvedGroupId, resolvedQueryMemberId]);

    useEffect(() => {
        if (queryUserId && data) {
            const selected = data.members.find(m => m.user_id === queryUserId);
            navigate(
                `/group-gift/${resolvedGroupId}?group_member_id=${selected?.group_member_id}`,
            );
        }
    }, [data, navigate, queryUserId, resolvedGroupId]);

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
        group_Id: resolvedGroupId ?? null,
        reloadGroupGift: handleReloadGroup,
    };

    const renderContent = () => {
        if (selectedMember) {
            return (
                <div>
                    <GroupMember />
                </div>
            );
        }
        return (
            <MainContent
                ownerProfile={data.user}
                groupImage={data.image_url}
                groupName={data.name}
                groupDate={data.due_date}
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
