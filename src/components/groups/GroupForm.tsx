import {
    Control,
    Controller,
    FieldError,
    FieldValues,
    UseFormRegister,
} from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Grid, TextField, Typography } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FC } from 'react';
import { Group } from '../../domain/entities/Group';
import LoadableButton from '../shared/LoadableButton';
import { parseISO } from 'date-fns';

type GroupFormProps = {
    onFormSubmit: (data: any) => any;
    onRegister: UseFormRegister<Group>;
    control: Control<FieldValues, object>;
    formErrors: {
        [key: string]: FieldError | undefined;
    };
    useAutoFocus: boolean;
    saveLoading: boolean;
    deleteLoading?: boolean;
    isAddMode: boolean;
    onDelete?: () => any;
    group?: Group;
    watchImageUrl: string | null;
};

const GroupForm: FC<GroupFormProps> = ({
    onFormSubmit,
    onRegister,
    control,
    formErrors,
    useAutoFocus,
    saveLoading,
    deleteLoading,
    isAddMode,
    onDelete,
    group,
    watchImageUrl,
}) => (
    <form onSubmit={onFormSubmit}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                    {...onRegister('name')}
                    label="name*"
                    error={!!formErrors.name}
                    helperText={formErrors.name?.message}
                    fullWidth
                    autoFocus={useAutoFocus}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="due_date"
                    control={control}
                    defaultValue={isAddMode ? new Date() : group?.due_date}
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="due date*"
                                inputFormat="MM/dd/yyy"
                                {...field}
                                value={
                                    isAddMode
                                        ? field.value
                                        : parseISO(field.value as any)
                                }
                                renderInput={(props: any) => (
                                    <TextField
                                        {...props}
                                        error={!!formErrors.due_date}
                                        helperText={
                                            formErrors.due_date?.message
                                        }
                                        fullWidth
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    {...onRegister('image_url')}
                    label="image url"
                    error={!!formErrors.image_url}
                    helperText={formErrors.image_url?.message}
                    fullWidth
                />
            </Grid>
            {watchImageUrl && (
                <Grid item xs={12}>
                    <Typography variant="subtitle2">preview</Typography>
                    <img
                        src={watchImageUrl}
                        width="100"
                        height="56"
                        alt="preview"
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <LoadableButton
                    type="submit"
                    color="secondary"
                    variant="contained"
                    loading={saveLoading}
                >
                    save
                </LoadableButton>
                {!isAddMode && (
                    <LoadableButton
                        sx={{ ml: 2 }}
                        loading={!!deleteLoading}
                        onClick={onDelete}
                    >
                        delete
                    </LoadableButton>
                )}
            </Grid>
        </Grid>
    </form>
);

export default GroupForm;
