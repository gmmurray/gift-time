import {
    Button,
    ButtonTypeMap,
    CircularProgress,
    ExtendButtonBase,
} from '@mui/material';
import { FC, ReactNode } from 'react';

type LoadableButtonProps = {
    children: ReactNode;
    loading: boolean;
    [key: string]: any | ExtendButtonBase<ButtonTypeMap<{}, 'button'>>;
};

const LoadableButton: FC<LoadableButtonProps> = ({
    children,
    loading = false,
    ...props
}) => {
    if (loading)
        return (
            <Button {...props} disabled>
                <CircularProgress size={20} />
            </Button>
        );

    return <Button {...props}>{children}</Button>;
};

export default LoadableButton;
