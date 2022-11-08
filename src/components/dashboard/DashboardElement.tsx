import {
    Box,
    Divider,
    Grid,
    GridSize,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import {
    FC,
    Fragment,
    MouseEvent,
    ReactNode,
    useCallback,
    useState,
} from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const FIRST_ROW_HEIGHT = 290;
const SECOND_ROW_HEIGHT = 240;

const ROW_HEIGHTS = {
    1: FIRST_ROW_HEIGHT,
    2: SECOND_ROW_HEIGHT,
};

export type DashboardElementMenuItem = {
    selected?: boolean;
    onClick?: () => any;
    text?: string;
    isDivider?: boolean;
};

export type DashboardElementProps = {
    row: keyof typeof ROW_HEIGHTS;
    title: string;
    size: GridSize;
    isLoading?: boolean;
    isNoData?: boolean;
    loadingComponents?: ReactNode;
    menuItems?: DashboardElementMenuItem[];
};

const DashboardElement: FC<DashboardElementProps> = ({
    row,
    title,
    size,
    children,
    isLoading,
    isNoData,
    loadingComponents,
    menuItems,
}) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const handleMenuOpen = useCallback(
        (event: MouseEvent<HTMLButtonElement>) =>
            setMenuAnchorEl(event.currentTarget),
        [],
    );

    const handleMenuClose = useCallback(() => setMenuAnchorEl(null), []);

    const renderContent = () => {
        if (isLoading) {
            if (loadingComponents) return loadingComponents;

            return (
                <Fragment>
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 2 }} />
                    <Skeleton variant="text" />
                </Fragment>
            );
        } else if (isNoData)
            return (
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    sx={{ mt: 4 }}
                >
                    <Grid item xs={6}>
                        <Typography variant="body1">no data</Typography>
                    </Grid>
                </Grid>
            );
        else return children;
    };
    const menuEnabled = !isLoading && menuItems && menuItems.length > 0;
    return (
        <Grid item xs={12} md={size} columnSpacing={3}>
            <Paper elevation={2} sx={{ height: ROW_HEIGHTS[row], p: 2 }}>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6">{title}</Typography>
                    {menuEnabled && (
                        <Box sx={{ ml: 'auto' }}>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreHorizIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
                {renderContent()}
            </Paper>
            {menuEnabled && (
                <Menu
                    anchorEl={menuAnchorEl}
                    open={!!menuAnchorEl}
                    onClose={handleMenuClose}
                >
                    {menuItems.map(
                        ({ text, onClick, selected, isDivider }, index) => {
                            if (isDivider && index !== 0)
                                return <Divider key={index} />;

                            const handleClick = () => {
                                if (onClick) {
                                    onClick();
                                    handleMenuClose();
                                }
                            };

                            return (
                                <MenuItem
                                    key={index}
                                    selected={selected}
                                    onClick={handleClick}
                                >
                                    {text}
                                </MenuItem>
                            );
                        },
                    )}
                </Menu>
            )}
        </Grid>
    );
};

export default DashboardElement;
