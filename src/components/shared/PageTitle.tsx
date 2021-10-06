import { Typography, TypographyProps } from '@mui/material';

import { FC } from 'react';

type PageTitleProps = {} & TypographyProps;

const PageTitle: FC<PageTitleProps> = ({ children, ...props }) => (
    <Typography {...props} variant="h3" sx={{ mb: 2 }}>
        {children}
    </Typography>
);

export default PageTitle;
