import {
    IconButton,
    IconButtonProps,
    SvgIconTypeMap,
    Tooltip,
} from '@mui/material';

import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type TooltipButtonProps = {
    text: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
    onClick: () => any;
} & IconButtonProps;
const TooltipButton: FC<TooltipButtonProps> = ({
    text,
    icon: Icon,
    onClick,
    ...buttonProps
}) => (
    <Tooltip title={text}>
        <IconButton onClick={onClick} {...buttonProps}>
            <Icon />
        </IconButton>
    </Tooltip>
);
export default TooltipButton;
