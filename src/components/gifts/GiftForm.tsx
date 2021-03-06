import {
    Control,
    Controller,
    FieldError,
    FieldValues,
    UseFormRegister,
} from 'react-hook-form';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from '@mui/material';
import {
    transformBooleanInputToString,
    transformStringOutputToBoolean,
} from '../../utils/helpers/formTransform';

import { FC } from 'react';
import { Gift } from '../../domain/entities/Gift';
import LoadableButton from '../shared/LoadableButton';
import { PriorityType } from '../../lib/constants/priorityTypes';

type GiftFormProps = {
    onFormSubmit: (data: any) => any;
    onRegister: UseFormRegister<Gift>;
    control: Control<FieldValues, object>;
    formErrors: {
        [key: string]: FieldError | undefined;
    };
    saveLoading: boolean;
    deleteLoading?: boolean;
    isAddMode: boolean;
    onDelete?: () => any;
    gift?: Gift;
};

const GiftForm: FC<GiftFormProps> = ({
    onFormSubmit,
    onRegister,
    control,
    formErrors,
    saveLoading,
    deleteLoading,
    isAddMode,
    onDelete,
    gift,
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
                    autoFocus={isAddMode}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...onRegister('price')}
                    label="price*"
                    error={!!formErrors.price}
                    helperText={formErrors.price?.message}
                    fullWidth
                    inputProps={{ step: '0.01' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    {...onRegister('description')}
                    label="description"
                    error={!!formErrors.description}
                    helperText={formErrors.description?.message}
                    fullWidth
                    multiline
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    {...onRegister('web_link')}
                    label="link"
                    error={!!formErrors.web_link}
                    helperText={formErrors.web_link?.message}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl error={!!formErrors.priority} fullWidth>
                    <InputLabel>priority*</InputLabel>
                    <Select
                        {...onRegister('priority')}
                        fullWidth
                        defaultValue={gift?.priority ?? PriorityType.low}
                        label="priority*"
                    >
                        {Object.values(PriorityType).map(({ text, value }) => (
                            <MenuItem key={value} value={value}>
                                {text}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        {formErrors.priority?.message}
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="is_private"
                    control={control}
                    defaultValue={isAddMode ? false : gift!.is_private}
                    render={({ field }) => (
                        <FormControl
                            component="fieldset"
                            error={!!formErrors.is_private}
                            fullWidth
                        >
                            <FormLabel component="legend">
                                keep this gift private?
                            </FormLabel>
                            <RadioGroup
                                {...field}
                                onChange={e =>
                                    field.onChange(
                                        transformStringOutputToBoolean(e),
                                    )
                                }
                                value={transformBooleanInputToString(
                                    field.value,
                                )}
                            >
                                <FormControlLabel
                                    value="true"
                                    control={<Radio />}
                                    label="yes"
                                />
                                <FormControlLabel
                                    value="false"
                                    control={<Radio />}
                                    label="no"
                                />
                            </RadioGroup>
                            <FormHelperText>
                                {formErrors.is_private?.message}
                            </FormHelperText>
                        </FormControl>
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

export default GiftForm;
