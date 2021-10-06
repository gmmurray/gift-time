import { Fab, Slide, useScrollTrigger } from '@mui/material';
import React, { useCallback } from 'react';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box } from '@mui/system';

const ScrollTopButton = () => {
    const scrollTrigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 300,
    });

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const anchor = (
                (event.target as HTMLDivElement).ownerDocument || document
            ).querySelector('#nav-menu');

            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        [],
    );
    return (
        <Slide in={scrollTrigger} direction="up">
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <Fab variant="extended" color="primary">
                    <ArrowUpwardIcon sx={{ mr: 1 }} />
                    back to top
                </Fab>
            </Box>
        </Slide>
    );
};

export default ScrollTopButton;
