import {
    createFailureMessage,
    createSuccessMessage,
} from '../../../utils/config/snackbar';
import { useCallback, useEffect, useRef } from 'react';
import {
    useDeleteGift,
    useGetOwnSingleGift,
    useUpdateGift,
} from '../../../domain/services/giftService';
import { useNavigate, useParams } from 'react-router';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import { Button } from '@mui/material';
import ConfirmationDialog from '../../../components/shared/ConfirmationDialog';
import DataError from '../../../components/shared/DataError';
import DataLoadingSpinner from '../../../components/shared/DataLoadingSpinner';
import { Gift } from '../../../domain/entities/Gift';
import GiftForm from '../../../components/gifts/GiftForm';
import { Link } from 'react-router-dom';
import PageTitle from '../../../components/shared/PageTitle';
import { addGiftSchema } from '../../../utils/config/formSchema/gift';
import { noop } from '../../../utils/helpers/noop';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const ViewGift = () => {
    const { user } = Auth.useUser();
    const { enqueueSnackbar } = useSnackbar();
    const { gift_id } = useParams();
    const navigate = useNavigate();

    const deleteConfirmationDialogRef = useRef<{ onOpen: () => any }>();
    const handleOpenDeleteConfirmationDialog = useCallback(
        () => deleteConfirmationDialogRef.current?.onOpen() ?? noop(),
        [],
    );

    const resolvedGiftId = gift_id ? parseInt(gift_id) : undefined;

    const { data, isLoading } = useGetOwnSingleGift(resolvedGiftId, user?.id);
    const updateMutation = useUpdateGift();
    const deleteMutation = useDeleteGift();

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        control,
        setValue,
    } = useForm({
        resolver: yupResolver(addGiftSchema),
    });

    const handleFormSubmit = useCallback(
        (data: Gift) => {
            if (!user) return;
            updateMutation.mutate(data, {
                onSuccess: async () =>
                    createSuccessMessage(enqueueSnackbar, 'gift updated'),
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error updating gift',
                    ),
            });
        },
        [enqueueSnackbar, updateMutation, user],
    );

    const handleDelete = useCallback(() => {
        if (!resolvedGiftId) return;
        deleteMutation.mutate(
            { gift_id: resolvedGiftId, user_id: user?.id },
            {
                onSuccess: async () => {
                    createSuccessMessage(enqueueSnackbar, 'gift deleted');
                    navigate('/gifts/public');
                },
                onError: async () =>
                    createFailureMessage(
                        enqueueSnackbar,
                        'error deleting gift',
                    ),
            },
        );
    }, [deleteMutation, enqueueSnackbar, resolvedGiftId, navigate, user]);

    useEffect(() => {
        if (data) {
            (Object.keys(data) as (keyof Gift)[]).forEach(key =>
                setValue(key, data![key]),
            );
        }
    }, [data, setValue]);

    if (isLoading) {
        return <DataLoadingSpinner />;
    } else if (!data) {
        return (
            <DataError message="no gift found">
                <Button component={Link} to="/gifts/new" variant="contained">
                    create one
                </Button>
            </DataError>
        );
    }

    return (
        <BasicPaperContainer>
            <PageTitle>update gift</PageTitle>
            <GiftForm
                onFormSubmit={handleSubmit(handleFormSubmit)}
                // @ts-ignore
                onRegister={register}
                control={control}
                formErrors={formErrors}
                isAddMode={false}
                saveLoading={updateMutation.isLoading}
                gift={isLoading ? undefined : data!}
                onDelete={handleOpenDeleteConfirmationDialog}
                deleteLoading={deleteMutation.isLoading}
            />
            <ConfirmationDialog
                onConfirm={handleDelete}
                ref={deleteConfirmationDialogRef}
                title="delete"
                message="are you sure you want to delete this gift? this cannot be undone"
            />
        </BasicPaperContainer>
    );
};

export default ViewGift;
