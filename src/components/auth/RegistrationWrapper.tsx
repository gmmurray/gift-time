import { Backdrop, CircularProgress } from '@mui/material';
import { FC, Fragment, useCallback } from 'react';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../utils/config/snackbar';

import { Auth } from '@supabase/ui';
import RegisterForm from './RegisterForm';
import ResponsiveDialog from '../shared/ResponsiveDialog';
import { UserProfile } from '../../domain/entities/UserProfile';
import { noop } from '../../utils/helpers/noop';
import { useAddUserProfile } from '../../domain/services/userProfileService';
import { useAppContext } from '../../utils/contexts/appContext';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { userProfileSchema } from '../../utils/config/formSchema/userProfile';
import { yupResolver } from '@hookform/resolvers/yup';

const RegistrationWrapper: FC = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = Auth.useUser();
    const navigate = useNavigate();
    const { user: { loading, profile } = { loading: true, profile: null } } =
        useAppContext() || {};

    const createMutation = useAddUserProfile();
    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        watch,
    } = useForm({
        resolver: yupResolver(userProfileSchema),
        defaultValues:
            user && user.user_metadata && user.user_metadata.avatar_url
                ? { avatar_url: user.user_metadata.avatar_url }
                : undefined,
    });

    const handleFormSubmit = useCallback(
        (data: Partial<UserProfile>) => {
            createMutation.mutate(
                { ...data, user_id: user?.id, email: user?.email },
                {
                    onSuccess: async () => {
                        navigate('/home');
                        createSuccessMessage(
                            enqueueSnackbar,
                            'user profile created',
                        );
                    },
                    onError: async () =>
                        createFailureMessage(
                            enqueueSnackbar,
                            'error creating user profile',
                        ),
                },
            );
        },
        [createMutation, enqueueSnackbar, navigate, user?.email, user?.id],
    );

    if (loading) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    } else if (!profile) {
        const watchAvatarUrl = watch('avatar_url');
        return (
            <ResponsiveDialog
                open={true}
                onClose={noop}
                title="first create a user profile"
                text="you'll need this to use the app"
            >
                <RegisterForm
                    onFormSubmit={handleSubmit(handleFormSubmit)}
                    onFieldRegister={register}
                    formErrors={formErrors}
                    loading={createMutation.isLoading}
                    watchAvatarUrl={watchAvatarUrl}
                />
            </ResponsiveDialog>
        );
    }
    return <Fragment>{children}</Fragment>;
};

export default RegistrationWrapper;
