import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { FC, ReactElement, Ref, forwardRef } from 'react';

import { TransitionProps } from '@mui/material/transitions/transition';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

type ResponsiveDialogProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    text?: string;
};

const ResponsiveDialog: FC<ResponsiveDialogProps> = ({
    open,
    onClose,
    title,
    text,
    children,
}) => {
    const theme = useTheme();
    const showFullscreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Dialog
            fullScreen={showFullscreen}
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>{text}</DialogContentText>

                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResponsiveDialog;
