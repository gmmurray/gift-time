import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

const DEFAULT_TITLE = 'confirm';
const DEFAULT_MESSAGE = 'are you sure?';

type ConfirmationDialogProps = {
    title?: string;
    message?: string;
    onConfirm: () => any;
};

const ConfirmationDialog = forwardRef(
    (
        {
            onConfirm,
            title = DEFAULT_TITLE,
            message = DEFAULT_MESSAGE,
        }: ConfirmationDialogProps,
        ref,
    ) => {
        const [open, setOpen] = useState(false);
        const handleOpen = useCallback(() => setOpen(true), []);
        useImperativeHandle(ref, () => ({
            onOpen() {
                handleOpen();
            },
        }));
        const handleClose = useCallback(() => setOpen(false), []);
        const handleConfirm = useCallback(() => {
            onConfirm();
            handleClose();
        }, [handleClose, onConfirm]);

        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>{message}</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>cancel</Button>
                    <Button onClick={handleConfirm}>yes</Button>
                </DialogActions>
            </Dialog>
        );
    },
);

export default ConfirmationDialog;
