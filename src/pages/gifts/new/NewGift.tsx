import {
    createFailureMessage,
    createSuccessMessage,
} from '../../../utils/config/snackbar';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import { Gift } from '../../../domain/entities/Gift';
import GiftForm from '../../../components/gifts/GiftForm';
import PageTitle from '../../../components/shared/PageTitle';
import { addGiftSchema } from '../../../utils/config/formSchema/gift';
import { useCallback } from 'react';
import { useCreateGift } from '../../../domain/services/giftService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const NewGift = () => {
    const { user } = Auth.useUser();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const createMutation = useCreateGift();

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        control,
    } = useForm({
        resolver: yupResolver(addGiftSchema),
    });

    const handleFormSubmit = useCallback(
        (data: Partial<Gift>) => {
            if (!user) return;
            createMutation.mutate(
                { ...data, user_id: user.id },
                {
                    onSuccess: async result => {
                        if (result === null) return;
                        createSuccessMessage(enqueueSnackbar, 'gift created');
                        navigate(`/gifts/view/${result.gift_id}`);
                    },
                    onError: async () =>
                        createFailureMessage(
                            enqueueSnackbar,
                            'error creating gift',
                        ),
                },
            );
        },
        [enqueueSnackbar, createMutation, user, navigate],
    );

    return (
        <BasicPaperContainer>
            <PageTitle>create a gift</PageTitle>
            <GiftForm
                onFormSubmit={handleSubmit(handleFormSubmit)}
                onRegister={register}
                control={control}
                formErrors={formErrors}
                isAddMode
                saveLoading={createMutation.isLoading}
            />
        </BasicPaperContainer>
    );
};

export default NewGift;
