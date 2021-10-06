import { Button, Collapse } from '@mui/material';
import { FC, RefObject, createRef, useCallback } from 'react';
import { SnackbarKey, SnackbarProvider } from 'notistack';

const AlertProvider: FC = ({ children }) => {
    const alertStackRef: RefObject<SnackbarProvider> = createRef();
    const handleDismissAlert = useCallback(
        (key: SnackbarKey) => alertStackRef?.current?.closeSnackbar(key),
        [alertStackRef],
    );
    return (
        <SnackbarProvider
            ref={alertStackRef}
            action={key => (
                <Button
                    color="secondary"
                    onClick={() => handleDismissAlert(key)}
                >
                    dimiss
                </Button>
            )}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            TransitionComponent={Collapse}
        >
            {children}
        </SnackbarProvider>
    );
};

export default AlertProvider;
