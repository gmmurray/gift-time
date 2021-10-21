import {
    createFailureMessage,
    createSuccessMessage,
} from '../../../utils/config/snackbar';
import {
    getGroupKey,
    useCreateGroup,
} from '../../../domain/services/groupService';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import { Group } from '../../../domain/entities/Group';
import GroupForm from '../../../components/groups/GroupForm';
import PageTitle from '../../../components/shared/PageTitle';
import { addGroupSechma } from '../../../utils/config/formSchema/group';
import { queryClient } from '../../../utils/config/queryClient';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const NewGroup = () => {
    const { user } = Auth.useUser();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const createMutation = useCreateGroup();

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        control,
        watch,
    } = useForm({
        resolver: yupResolver(addGroupSechma),
    });

    const handleFormSubmit = useCallback(
        (data: Partial<Group>) => {
            if (!user) return;
            createMutation.mutate(
                {
                    ...data,
                    owner_id: user.id,
                },
                {
                    onSuccess: async result => {
                        if (result === null) return;
                        createSuccessMessage(enqueueSnackbar, 'group created');
                        queryClient.invalidateQueries(getGroupKey());
                        navigate(`/groups/view/${result[0].group_id}`);
                    },
                    onError: async () => {
                        createFailureMessage(
                            enqueueSnackbar,
                            'error creating group',
                        );
                    },
                },
            );
        },
        [createMutation, enqueueSnackbar, navigate, user],
    );

    const watchImageUrl = watch('image_url');
    return (
        <BasicPaperContainer>
            <PageTitle>create a group</PageTitle>
            <GroupForm
                onFormSubmit={handleSubmit(handleFormSubmit)}
                onRegister={register}
                control={control}
                formErrors={formErrors}
                useAutoFocus
                saveLoading={createMutation.isLoading}
                isAddMode
                watchImageUrl={watchImageUrl}
            />
        </BasicPaperContainer>
    );
};

export default NewGroup;
