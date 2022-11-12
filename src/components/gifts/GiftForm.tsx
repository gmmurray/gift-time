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
import { Gift, GiftWithClaim } from '../../domain/entities/Gift';
import {
    transformBooleanInputToString,
    transformStringOutputToBoolean,
} from '../../utils/helpers/formTransform';

import ConditionalTooltip from '../shared/ConditionalTooltip';
import { FC } from 'react';
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
    gift?: GiftWithClaim;
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
            {gift && (
                <Grid item xs={12} md={6}>
                    <Controller
                        name="is_archived"
                        control={control}
                        defaultValue={isAddMode ? false : gift!.is_archived}
                        render={({ field }) => (
                            <FormControl
                                component="fieldset"
                                error={!!formErrors.is_archived}
                                fullWidth
                            >
                                <FormLabel component="legend">
                                    archive gift
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
                                    {formErrors.is_archived?.message}
                                </FormHelperText>
                            </FormControl>
                        )}
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
                    <ConditionalTooltip
                        title="Cannot delete gift since it is part of one of your groups"
                        visible={!!gift && !!gift.claimed_by}
                    >
                        <span>
                            <LoadableButton
                                sx={{ ml: 2 }}
                                loading={!!deleteLoading}
                                onClick={onDelete}
                                disabled={gift && !!gift.claimed_by}
                            >
                                delete
                            </LoadableButton>
                        </span>
                    </ConditionalTooltip>
                )}
            </Grid>
        </Grid>
    </form>
);

export default GiftForm;
