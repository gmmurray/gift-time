import { FC, useCallback } from 'react';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../utils/config/snackbar';

import RegisterForm from './RegisterForm';
import ResponsiveDialog from '../shared/ResponsiveDialog';
import { UserProfile } from '../../domain/entities/UserProfile';
import { useAppContext } from '../../utils/contexts/appContext';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useUpdateUserProfile } from '../../domain/services/userProfileService';
import { userProfileSchema } from '../../utils/config/formSchema/userProfile';
import { yupResolver } from '@hookform/resolvers/yup';

type UpdateUserProfileModalProps = {
    open: boolean;
    onClose: () => void;
};

const UpdateUserProfileModal: FC<UpdateUserProfileModalProps> = ({
    open,
    onClose,
}) => {
    const { user } = useAppContext() ?? {};
    const { enqueueSnackbar } = useSnackbar();

    const updateMutation = useUpdateUserProfile();

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(userProfileSchema),
        defaultValues: user && user.profile ? { ...user.profile } : undefined,
    });

    const handleClose = useCallback(() => {
        reset(user?.profile!);
        onClose();
    }, [onClose, reset, user?.profile]);

    const handleFormSubmit = useCallback(
        (data: UserProfile) => {
            updateMutation.mutate(data, {
                onSuccess: async () => {
                    createSuccessMessage(
                        enqueueSnackbar,
                        'user profile updated',
                    );
                },
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error updating user profile',
                    ),
            });
        },
        [enqueueSnackbar, updateMutation],
    );

    const watchAvatarUrl = watch('avatar_url');

    return (
        <ResponsiveDialog
            open={open}
            onClose={handleClose}
            title="update user profile"
        >
            <RegisterForm
                onFormSubmit={handleSubmit(handleFormSubmit)}
                onFieldRegister={register}
                formErrors={formErrors}
                loading={updateMutation.isLoading}
                isAddMode={true}
                watchAvatarUrl={watchAvatarUrl}
            />
        </ResponsiveDialog>
    );
};

export default UpdateUserProfileModal;
