import {
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    SwipeableDrawer,
    useTheme,
} from '@mui/material';
import { FC, Fragment, ReactElement, useCallback, useState } from 'react';

import Add from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupAdd from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import People from '@mui/icons-material/People';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import { useNavigate } from 'react-router';

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

type NavDrawerProps = {
    open: boolean;
    onToggle: (value: boolean) => void;
};

type FolderState = {
    [key: string]: boolean;
};

const defaultFolderState: FolderState = {};

type DrawerFolder = {
    name: string;
    icon: ReactElement;
    links: {
        name: string;
        route: string;
        icon: ReactElement;
    }[];
};

const folders: DrawerFolder[] = [
    {
        name: 'groups',
        icon: <GroupsIcon />,
        links: [
            {
                name: 'new group',
                route: '/groups/new',
                icon: <Add />,
            },
            {
                name: 'my groups',
                route: '/groups/owned',
                icon: <People />,
            },
            {
                name: 'joined groups',
                route: '/groups/joined',
                icon: <PeopleOutline />,
            },
            {
                name: 'invitations',
                route: '/groups/invited',
                icon: <GroupAdd />,
            },
        ],
    },
];

const NavDrawer: FC<NavDrawerProps> = ({ open, onToggle }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [folderState, setFolderState] =
        useState<FolderState>(defaultFolderState);

    const handleRouteClick = useCallback(
        (route: string) => {
            onToggle(false);
            navigate(route);
        },
        [navigate, onToggle],
    );

    const handleFolderToggle = useCallback(
        (key: string) => {
            const prevValue = folderState[key];
            setFolderState(state => ({ ...state, [key]: !prevValue }));
        },
        [folderState],
    );

    return (
        <SwipeableDrawer
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            anchor="left"
            open={open}
            onClose={() => onToggle(false)}
            onOpen={() => onToggle(true)}
        >
            <List
                component="nav"
                subheader={
                    <ListSubheader
                        color="inherit"
                        sx={{
                            ...theme.mixins.toolbar,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: 'primary.contrastText',
                        }}
                    >
                        menu
                    </ListSubheader>
                }
                sx={{ width: 250 }}
            >
                <ListItem button onClick={() => handleRouteClick('/home')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="home" />
                </ListItem>
                {folders.map(folder => (
                    <Fragment key={folder.name}>
                        <ListItem
                            button
                            onClick={() => handleFolderToggle(folder.name)}
                        >
                            <ListItemIcon>{folder.icon}</ListItemIcon>
                            <ListItemText primary={folder.name} />
                            {folderState[folder.name] ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItem>
                        <Collapse
                            in={folderState[folder.name]}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                {folder.links.map(link => (
                                    <ListItem
                                        key={link.name}
                                        button
                                        onClick={() =>
                                            handleRouteClick(link.route)
                                        }
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon>{link.icon}</ListItemIcon>
                                        <ListItemText primary={link.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </Fragment>
                ))}
            </List>
        </SwipeableDrawer>
    );
};

export default NavDrawer;
