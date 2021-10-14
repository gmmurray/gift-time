import {
    Avatar,
    Button,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../../utils/config/snackbar';
import {
    useDeleteGroupInvite,
    useGetGroupInvitesByGroup,
    useInviteUserToGroup,
} from '../../../domain/services/groupInviteService';

import ClearIcon from '@mui/icons-material/Clear';
import LoadableButton from '../../../components/shared/LoadableButton';
import ResponsiveDialog from '../../../components/shared/ResponsiveDialog';
import { defaultBgColor } from '../../../lib/constants/styles';
import { formatDistanceToNow } from 'date-fns';
import { inviteUserSchema } from '../../../utils/config/formSchema/invite';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const InviteTab = () => {
    const { group_id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [showNewInviteModal, setShowNewInviteModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        reset,
    } = useForm({
        resolver: yupResolver(inviteUserSchema),
    });

    const handleOpenModal = useCallback(() => setShowNewInviteModal(true), []);
    const handleCloseModal = useCallback(
        () => setShowNewInviteModal(false),
        [],
    );

    useEffect(() => reset(), [showNewInviteModal, reset]);

    const { data, isLoading } = useGetGroupInvitesByGroup(
        group_id ? parseInt(group_id) : undefined,
    );

    const createInviteMutation = useInviteUserToGroup();
    const deleteInviteMutation = useDeleteGroupInvite();

    const handleCreation = useCallback(
        (data: { email: string }) => {
            if (!group_id) return;
            createInviteMutation.mutate(
                { email: data.email, group_id: parseInt(group_id) },
                {
                    onSuccess: async () => {
                        createSuccessMessage(enqueueSnackbar, 'user invited');
                        handleCloseModal();
                    },
                    onError: async () => {
                        createFailureMessage(
                            enqueueSnackbar,
                            'error inviting. user may not exist',
                        );
                    },
                },
            );
        },
        [createInviteMutation, enqueueSnackbar, group_id, handleCloseModal],
    );

    const handleDeletion = useCallback(
        (group_invite_id: number) => {
            deleteInviteMutation.mutate(group_invite_id, {
                onSuccess: async () =>
                    createSuccessMessage(enqueueSnackbar, 'invite removed'),
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error removing invite',
                    ),
            });
        },
        [deleteInviteMutation, enqueueSnackbar],
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <Stack spacing={2}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                </Stack>
            );
        } else if (!data || data.length === 0) {
            return (
                <Typography sx={{ textAlign: 'center', pb: 2 }} variant="h5">
                    no invites yet
                </Typography>
            );
        } else {
            return (
                <Grid container rowSpacing={2} sx={{ mt: 1 }}>
                    {data.map(invite => (
                        <Grid
                            item
                            xs={12}
                            container
                            component={Paper}
                            sx={{ bgcolor: defaultBgColor, mb: 1, pb: 1 }}
                            key={invite.group_invite_id}
                        >
                            <Grid item sx={{ ml: 1 }}>
                                <Avatar
                                    src={
                                        invite.user_profiles?.avatar_url ??
                                        undefined
                                    }
                                />
                            </Grid>
                            <Grid item sx={{ ml: 1 }}>
                                <Typography variant="body1">
                                    {invite.user_profiles.email}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                >
                                    {formatDistanceToNow(
                                        new Date(invite.created_at),
                                        { addSuffix: true },
                                    )}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ ml: 'auto' }}>
                                <IconButton
                                    color="error"
                                    disabled={deleteInviteMutation.isLoading}
                                    onClick={() =>
                                        handleDeletion(invite.group_invite_id)
                                    }
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            );
        }
    };
    return (
        <Fragment>
            <Paper elevation={3} sx={{ p: 2, bgcolor: defaultBgColor }}>
                <Typography variant="h4">invited users</Typography>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleOpenModal}
                    sx={{ mb: 2 }}
                >
                    new invite
                </Button>
                {renderContent()}
            </Paper>
            <ResponsiveDialog
                open={showNewInviteModal}
                onClose={handleCloseModal}
                title="invite a user"
                text="enter the user's email. if that user exists an invite will be sent"
            >
                <form onSubmit={handleSubmit(handleCreation)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register('email')}
                                label="email*"
                                error={!!formErrors.email}
                                helperText={formErrors.email?.message}
                                fullWidth
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadableButton
                                loading={createInviteMutation.isLoading}
                                type="submit"
                                color="secondary"
                                variant="contained"
                            >
                                send
                            </LoadableButton>
                        </Grid>
                    </Grid>
                </form>
            </ResponsiveDialog>
        </Fragment>
    );
};

export default InviteTab;
