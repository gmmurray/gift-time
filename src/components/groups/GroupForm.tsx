import {
    Control,
    Controller,
    FieldError,
    FieldValues,
    UseFormRegister,
} from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Grid, TextField } from '@mui/material';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
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
                        <LocalizationProvider
                            // @ts-ignore
                            dateAdapter={AdapterDateFns}
                        >
                            <DatePicker
                                label="due date*"
                                inputFormat="MM/dd/yyy"
                                {...field}
                                value={
                                    isAddMode
                                        ? field.value
                                        : parseISO(field.value as any)
                                }
                                renderInput={props => (
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
