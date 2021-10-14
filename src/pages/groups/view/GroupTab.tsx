import { Button, Paper, Typography } from '@mui/material';
import { Control, FieldValues, useForm } from 'react-hook-form';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../../utils/config/snackbar';
import { useCallback, useEffect, useRef } from 'react';
import {
    useDeleteGroup,
    useGetGroup,
    useUpdateGroup,
} from '../../../domain/services/groupService';
import { useNavigate, useParams } from 'react-router';

import { Auth } from '@supabase/ui';
import ConfirmationDialog from '../../../components/shared/ConfirmationDialog';
import DataError from '../../../components/shared/DataError';
import DataLoadingSpinner from '../../../components/shared/DataLoadingSpinner';
import { Group } from '../../../domain/entities/Group';
import GroupForm from '../../../components/groups/GroupForm';
import { Link } from 'react-router-dom';
import { addGroupSechma } from '../../../utils/config/formSchema/group';
import { defaultBgColor } from '../../../lib/constants/styles';
import { noop } from '../../../utils/helpers/noop';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const GroupTab = () => {
    const { user } = Auth.useUser();
    const { enqueueSnackbar } = useSnackbar();
    const { group_id } = useParams();
    const navigate = useNavigate();

    const deleteConfirmationDialogRef = useRef<{ onOpen: () => any }>();
    const handleOpenDeleteConfirmationDialog = useCallback(
        () => deleteConfirmationDialogRef.current?.onOpen() ?? noop(),
        [],
    );

    const { data, isLoading } = useGetGroup(
        parseInt(group_id ?? '0'),
        user?.id,
    );
    const updateGroupMutation = useUpdateGroup();
    const deleteGroupMutation = useDeleteGroup();

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        control,
        setValue,
    } = useForm({
        resolver: yupResolver(addGroupSechma),
    });

    const handleFormSubmit = useCallback(
        (data: Group) => {
            if (!user) return;
            updateGroupMutation.mutate(data, {
                onSuccess: async () =>
                    createSuccessMessage(enqueueSnackbar, 'group updated'),
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error updating group',
                    ),
            });
        },
        [enqueueSnackbar, updateGroupMutation, user],
    );

    useEffect(() => {
        if (data) {
            (Object.keys(data) as (keyof Group)[]).forEach(key =>
                setValue(key, data![key]),
            );
        }
    }, [data, setValue]);

    const handleDeleteGroup = useCallback(() => {
        if (!group_id) return;
        deleteGroupMutation.mutate(parseInt(group_id), {
            onSuccess: async () => {
                createSuccessMessage(enqueueSnackbar, 'group deleted');
                navigate('/groups/owned');
            },
            onError: async () =>
                createFailureMessage(enqueueSnackbar, 'error deleting group'),
        });
    }, [deleteGroupMutation, enqueueSnackbar, group_id, navigate]);

    if (isLoading) {
        return (
            <DataLoadingSpinner additionalSx={{ bgcolor: defaultBgColor }} />
        );
    } else if (!data) {
        return (
            <DataError
                message="no group found"
                additionalSx={{ bgcolor: defaultBgColor }}
            >
                <Button component={Link} to="/groups/owned" variant="contained">
                    back to list
                </Button>
            </DataError>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 2, bgcolor: defaultBgColor }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                change group details
            </Typography>
            <GroupForm
                onFormSubmit={handleSubmit(handleFormSubmit)}
                onRegister={register}
                control={control as Control<FieldValues, object>}
                formErrors={formErrors}
                useAutoFocus={false}
                saveLoading={updateGroupMutation.isLoading}
                isAddMode={false}
                group={isLoading ? undefined : data!}
                onDelete={handleOpenDeleteConfirmationDialog}
                deleteLoading={deleteGroupMutation.isLoading}
            />
            <ConfirmationDialog
                onConfirm={handleDeleteGroup}
                ref={deleteConfirmationDialogRef}
            />
        </Paper>
    );
};

export default GroupTab;
