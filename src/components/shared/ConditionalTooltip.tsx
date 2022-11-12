import React, { PropsWithChildren, ReactElement } from 'react';

import { Tooltip } from '@mui/material';

type Props = {
    visible: boolean;
    title?: string;
};

const ConditionalTooltip = ({
    visible,
    title,
    children,
}: PropsWithChildren<Props>) => {
    if (visible && title && children) {
        return <Tooltip title={title}>{children as ReactElement}</Tooltip>;
    }
    return children as ReactElement;
};

export default ConditionalTooltip;
