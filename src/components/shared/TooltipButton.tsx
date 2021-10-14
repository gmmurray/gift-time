import { IconButton, SvgIconTypeMap, Tooltip } from '@mui/material';

import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type TooltipButtonProps = {
    text: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
    onClick: () => any;
};
const TooltipButton: FC<TooltipButtonProps> = ({
    text,
    icon: Icon,
    onClick,
}) => (
    <Tooltip title={text}>
        <IconButton onClick={onClick}>
            <Icon />
        </IconButton>
    </Tooltip>
);
export default TooltipButton;
