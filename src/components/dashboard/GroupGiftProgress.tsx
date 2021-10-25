import {
    ButtonBase,
    LinearProgress,
    LinearProgressProps,
    Typography,
} from '@mui/material';

import { Box } from '@mui/system';
import { FC } from 'react';

type GroupGiftProgressProps = {
    group: string;
    numerator: number;
    denominator: number;
    spacing: number;
    onGroupClick: () => any;
} & LinearProgressProps;

const GroupGiftProgress: FC<GroupGiftProgressProps> = ({
    group,
    numerator,
    denominator,
    spacing,
    onGroupClick,
    ...progressProps
}) => (
    <Box sx={{ mb: spacing }}>
        <Box
            sx={{ minWidth: 75, maxWidth: '100%' }}
            component={ButtonBase}
            onClick={onGroupClick}
        >
            <Typography
                variant="body2"
                color="initial"
                sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    textDecoration: 'underline',
                }}
            >
                {group}
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                    {...progressProps}
                    variant="determinate"
                    value={(numerator / denominator) * 100}
                />
            </Box>
            <Box sx={{ minWidth: 40 }}>
                <Typography variant="body2" color="initial">
                    {numerator} / {denominator}
                </Typography>
            </Box>
        </Box>
    </Box>
);

export default GroupGiftProgress;
