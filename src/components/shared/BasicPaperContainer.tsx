import React, { FC } from 'react';

import { Paper } from '@mui/material';

const BasicPaperContainer: FC = ({ children }) => (
    <Paper elevation={2} sx={{ p: 2 }}>
        {children}
    </Paper>
);

export default BasicPaperContainer;
