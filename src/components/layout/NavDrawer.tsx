import { FC, ReactElement, useCallback, useState } from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    SwipeableDrawer,
    useTheme,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
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

const folders: DrawerFolder[] = [];

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
            </List>
        </SwipeableDrawer>
    );
};

export default NavDrawer;
