import {
    Avatar,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../../utils/config/snackbar';
import {
    useDeleteGroupMember,
    useGetGroupMembersByGroup,
} from '../../../domain/services/groupMemberService';

import { Auth } from '@supabase/ui';
import ClearIcon from '@mui/icons-material/Clear';
import { defaultBgColor } from '../../../lib/constants/styles';
import { formatDistanceToNow } from 'date-fns';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const MemberTab = () => {
    const { user } = Auth.useUser();
    const { group_id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { data, isLoading } = useGetGroupMembersByGroup(
        group_id ? parseInt(group_id) : undefined,
    );

    const deleteMemberMutation = useDeleteGroupMember();

    const handleDelete = useCallback(
        (group_member_id: number) =>
            deleteMemberMutation.mutate(group_member_id, {
                onSuccess: async () =>
                    createSuccessMessage(
                        enqueueSnackbar,
                        'removed group member',
                    ),
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error removing group member',
                    ),
            }),
        [deleteMemberMutation, enqueueSnackbar],
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <Stack spacing={2}>
                    {[...Array(3)].map(() => (
                        <Skeleton variant="text" />
                    ))}
                </Stack>
            );
        } else if (!data || data.length === 0) {
            return (
                <Typography sx={{ textAlign: 'center', pb: 2 }} variant="h5">
                    no members yet
                </Typography>
            );
        } else {
            return (
                <Grid container rowSpacing={2} sx={{ mt: 1 }}>
                    {data.map(member => {
                        const isGroupOwner = member.user_id === user?.id;
                        const avatar_url = member.user_profiles.avatar_url;
                        const avatarSrc =
                            !avatar_url || avatar_url === ''
                                ? undefined
                                : avatar_url;

                        return (
                            <Grid
                                item
                                xs={12}
                                container
                                component={Paper}
                                sx={{ bgcolor: defaultBgColor, mb: 1, pb: 1 }}
                            >
                                <Grid item sx={{ ml: 1 }}>
                                    <Avatar src={avatarSrc} />
                                </Grid>
                                <Grid item sx={{ ml: 1 }}>
                                    <Typography variant="body1">
                                        {member.user_profiles.display_name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        {member.user_profiles.email}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        joined{' '}
                                        {formatDistanceToNow(
                                            new Date(member.created_at),
                                            { addSuffix: true },
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item sx={{ ml: 'auto' }}>
                                    {isGroupOwner ? (
                                        <Typography
                                            variant="body1"
                                            sx={{ mr: 1 }}
                                        >
                                            owner
                                        </Typography>
                                    ) : (
                                        <IconButton
                                            color="error"
                                            disabled={
                                                deleteMemberMutation.isLoading
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    member.group_member_id,
                                                )
                                            }
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            );
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 2, bgcolor: defaultBgColor }}>
            <Typography variant="h4">group members</Typography>
            {renderContent()}
        </Paper>
    );
};

export default MemberTab;
