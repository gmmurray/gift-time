import { Avatar, Grid, TextField, Typography } from '@mui/material';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { FC } from 'react';
import LoadableButton from '../shared/LoadableButton';
import { UserProfile } from '../../domain/entities/UserProfile';

type RegisterFormProps = {
    onFormSubmit: (data: any) => any;
    onFieldRegister: UseFormRegister<UserProfile>;
    formErrors: {
        [key: string]: FieldError | undefined;
    };
    loading: boolean;
    isAddMode?: boolean;
    watchAvatarUrl: string | null;
};

const RegisterForm: FC<RegisterFormProps> = ({
    onFormSubmit,
    onFieldRegister,
    formErrors,
    loading,
    watchAvatarUrl,
    isAddMode = false,
}) => (
    <form onSubmit={onFormSubmit}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    {...onFieldRegister('display_name')}
                    label="display name*"
                    error={!!formErrors.display_name}
                    helperText={formErrors.display_name?.message}
                    fullWidth
                    autoFocus={isAddMode}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    {...onFieldRegister('avatar_url')}
                    label="avatar url"
                    error={!!formErrors.avatar_url}
                    helperText={formErrors.avatar_url?.message}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2">preview</Typography>
                <Avatar src={watchAvatarUrl ?? undefined} />
            </Grid>
            <Grid item xs={12}>
                <LoadableButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    loading={loading}
                >
                    save
                </LoadableButton>
            </Grid>
        </Grid>
    </form>
);

export default RegisterForm;
