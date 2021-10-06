import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';

type EnqueueSnackbarType = (
    message: SnackbarMessage,
    options?: OptionsObject | undefined,
) => SnackbarKey;

export const createSuccessMessage = (
    enqueueSnackbar: EnqueueSnackbarType,
    message: string,
) => enqueueSnackbar(message, { variant: 'success' });

export const createFailureMessage = (
    enqueueSnackbar: EnqueueSnackbarType,
    message: string,
) => enqueueSnackbar(message, { variant: 'error' });
