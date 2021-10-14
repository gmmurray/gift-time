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
import { Fragment, ReactElement } from 'react';
import { Outlet, useLocation } from 'react-router';

import Add from '@mui/icons-material/Add';
import GroupAdd from '@mui/icons-material/GroupAdd';
import { Link } from 'react-router-dom';
import People from '@mui/icons-material/People';
import PeopleOutline from '@mui/icons-material/PeopleOutline';

const getGroupRoute = (fullRoute: string) => {
    return fullRoute.replace('/groups/', '');
};

type GroupPageListItem = {
    name: string;
    mobileName: string;
    path: string;
    icon: ReactElement;
};

const listItems: GroupPageListItem[] = [
    {
        name: 'new group',
        mobileName: 'new',
        path: 'new',
        icon: <Add />,
    },
    {
        name: 'my groups',
        mobileName: 'owned',
        path: 'owned',
        icon: <People />,
    },
    {
        name: 'joined groups',
        mobileName: 'joined',
        path: 'joined',
        icon: <PeopleOutline />,
    },
    {
        name: 'invitations',
        mobileName: 'invited',
        path: 'invited',
        icon: <GroupAdd />,
    },
];

const Groups = () => {
    const location = useLocation();
    const tabValue = getGroupRoute(location.pathname);
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
                        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                        elevation={3}
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

export default Groups;
