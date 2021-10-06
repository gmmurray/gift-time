import { FC, useCallback } from 'react';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../utils/config/snackbar';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../components/shared/BasicPaperContainer';
import PageTitle from '../../components/shared/PageTitle';
import RegisterForm from '../../components/auth/RegisterForm';
import { UserProfile } from '../../domain/entities/UserProfile';
import { useAddUserProfile } from '../../domain/services/userProfileService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { userProfileSchema } from '../../utils/config/formSchema/userProfile';
import { yupResolver } from '@hookform/resolvers/yup';

const Register: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = Auth.useUser();
    const navigate = useNavigate();

    const createMutation = useAddUserProfile();
    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm({
        resolver: yupResolver(userProfileSchema),
    });

    const handleFormSubmit = useCallback(
        (data: Partial<UserProfile>) => {
            createMutation.mutate(
                { ...data, user_id: user?.id },
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
        [createMutation, enqueueSnackbar, navigate, user?.id],
    );

    return (
        <BasicPaperContainer>
            <PageTitle>create your user profile</PageTitle>
            <RegisterForm
                onFormSubmit={handleSubmit(handleFormSubmit)}
                onFieldRegister={register}
                formErrors={formErrors}
                loading={createMutation.isLoading}
            />
        </BasicPaperContainer>
    );
};

export default Register;
