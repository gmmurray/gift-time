import {
    AppBar,
    Avatar,
    Divider,
    IconButton,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import { FC, useCallback, useState } from 'react';

import AccountCircle from '@mui/icons-material/AccountCircle';
import { Box } from '@mui/system';
import { Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import UpdateUserProfileModal from '../auth/UpdateUserProfileModal';
import { useAppContext } from '../../utils/contexts/appContext';

type NavBarProps = {
    onMenuClick: (value: boolean) => void;
    onLogout: () => Promise<void>;
};

const NavBar: FC<NavBarProps> = ({ onMenuClick, onLogout }) => {
    const { user } = useAppContext() ?? {};

    const [userMenuAnchorEl, setUserMenuAnchorEl] =
        useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(userMenuAnchorEl);

    const handleUserMenuOpen = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) =>
            setUserMenuAnchorEl(event.currentTarget),
        [],
    );
    const handleUserMenuClose = useCallback(
        () => setUserMenuAnchorEl(null),
        [],
    );

    const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
    const handleUserProfileModalOpen = useCallback(
        () => setUserProfileModalOpen(true),
        [],
    );
    const handleUserProfileModalClose = useCallback(
        () => setUserProfileModalOpen(false),
        [],
    );

    return (
        <Box sx={{ flexGrow: 1, mb: 2 }}>
            <AppBar color="primary" position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        sx={{ mr: 2 }}
                        color="inherit"
                        onClick={() => onMenuClick(true)}
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link
                            component={RouterLink}
                            to="/home"
                            color="inherit"
                            underline="none"
                        >
                            gift time
                        </Link>
                    </Typography>
                    <IconButton onClick={handleUserMenuOpen}>
                        <Avatar src={user?.profile?.avatar_url ?? undefined} />
                    </IconButton>
                    <Menu
                        anchorEl={userMenuAnchorEl}
                        open={userMenuOpen}
                        onClose={handleUserMenuClose}
                    >
                        <MenuItem onClick={handleUserProfileModalOpen}>
                            <ListItemIcon>
                                <AccountCircle sx={{ color: 'primary.main' }} />
                            </ListItemIcon>
                            profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={onLogout}>
                            <ListItemIcon>
                                <Logout sx={{ color: 'primary.main' }} />
                            </ListItemIcon>
                            logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <UpdateUserProfileModal
                open={userProfileModalOpen}
                onClose={handleUserProfileModalClose}
            />
        </Box>
    );
};

export default NavBar;
