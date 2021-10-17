import {
    BottomNavigation,
    BottomNavigationAction,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    useMediaQuery,
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { FC, Fragment, ReactElement } from 'react';
import { Outlet, useLocation } from 'react-router';

import { Link } from 'react-router-dom';

export type TabPageListItem = {
    name: string;
    mobileName: string;
    path: string;
    icon: ReactElement;
};

type ResponsiveSideTabPageProps = {
    listItems: TabPageListItem[];
    getTabRoute: (fullRoute: string) => string;
};

const ResponsiveSideTabPage: FC<ResponsiveSideTabPageProps> = ({
    listItems,
    getTabRoute,
}) => {
    const location = useLocation();
    const tabValue = getTabRoute(location.pathname);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Fragment>
            <Grid container>
                {!isMobile && (
                    <Grid item sm={3}>
                        <List component="nav">
                            {listItems.map(({ name, path, icon }) => (
                                <ListItemButton
                                    key={`${name}-list-item`}
                                    selected={tabValue === path}
                                    component={Link}
                                    to={path}
                                >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Grid>
                )}
                <Grid
                    item
                    xs={12}
                    sm={9}
                    sx={isMobile ? undefined : { pl: 2, mt: 1 }}
                >
                    <Outlet />
                </Grid>
            </Grid>
            {isMobile && (
                <Box sx={{ pb: 7 }}>
                    <Paper
                        elevation={3}
                        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                    >
                        <BottomNavigation value={tabValue}>
                            {listItems.map(
                                ({ name, path, icon, mobileName }) => (
                                    <BottomNavigationAction
                                        key={`${name}-bottom-nav-action`}
                                        label={mobileName}
                                        icon={icon}
                                        component={Link}
                                        to={path}
                                        value={path}
                                    />
                                ),
                            )}
                        </BottomNavigation>
                    </Paper>
                </Box>
            )}
        </Fragment>
    );
};

export default ResponsiveSideTabPage;
