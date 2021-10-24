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
    useDeleteGroupInvite,
    useGetGroupInvitesByUser,
} from '../../../domain/services/groupInviteService';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { GroupInvite } from '../../../domain/entities/GroupInvite';
import PageTitle from '../../../components/shared/PageTitle';
import { defaultBgColor } from '../../../lib/constants/styles';
import { formatDistanceToNow } from 'date-fns';
import { useAcceptGroupInvite } from '../../../domain/services/groupMemberService';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

const InvitedGroups = () => {
    const { user } = Auth.useUser();
    const { enqueueSnackbar } = useSnackbar();
    const { data, isLoading } = useGetGroupInvitesByUser(user?.id);

    const acceptMutation = useAcceptGroupInvite();
    const deleteMutation = useDeleteGroupInvite();

    const handleAccept = useCallback(
        (invite: GroupInvite) => {
            acceptMutation.mutate(invite, {
                onSuccess: async () =>
                    createSuccessMessage(
                        enqueueSnackbar,
                        'successfuly joined group',
                    ),
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error joining group',
                    ),
            });
        },
        [acceptMutation, enqueueSnackbar],
    );

    const handleDelete = useCallback(
        (group_invite_id: number) => {
            deleteMutation.mutate(group_invite_id, {
                onSuccess: async () =>
                    createSuccessMessage(
                        enqueueSnackbar,
                        'invite request denied',
                    ),
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error denying invitation',
                    ),
            });
        },
        [deleteMutation, enqueueSnackbar],
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <Stack spacing={2}>
                    {[...Array(3)].map((e, i) => (
                        <Skeleton variant="text" key={i} />
                    ))}
                </Stack>
            );
        } else if (!data || data.length === 0) {
            return (
                <Typography sx={{ textAlign: 'center' }} variant="h5">
                    no invites yet
                </Typography>
            );
        } else {
            return (
                <Grid container rowSpacing={2} sx={{ mt: 1 }}>
                    {data.map(invite => {
                        const avatar_url = invite.groups.user.avatar_url;
                        const avatarSrc =
                            !avatar_url || avatar_url === ''
                                ? undefined
                                : avatar_url;
                        return (
                            <Grid
                                key={invite.group_invite_id}
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
                                        {invite.groups.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        {invite.groups.user.display_name}
                                    </Typography>
                                </Grid>
                                <Grid item sx={{ ml: 1 }}>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        {formatDistanceToNow(
                                            new Date(invite.groups.due_date),
                                            { addSuffix: true },
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item sx={{ ml: 'auto' }}>
                                    <IconButton
                                        disabled={acceptMutation.isLoading}
                                        onClick={() => handleAccept(invite)}
                                        color="success"
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                        disabled={deleteMutation.isLoading}
                                        onClick={() =>
                                            handleDelete(invite.group_invite_id)
                                        }
                                        color="error"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            );
        }
    };
    return (
        <BasicPaperContainer>
            <PageTitle>my invitations</PageTitle>
            <Paper sx={{ bgcolor: defaultBgColor, mt: 2, p: 2 }} elevation={3}>
                {renderContent()}
            </Paper>
        </BasicPaperContainer>
    );
};

export default InvitedGroups;
