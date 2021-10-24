import {
    Avatar,
    Badge,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
} from '@mui/material';
import { Fragment, useCallback, useState } from 'react';

import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Logout } from '@mui/icons-material';
import UpdateUserProfileModal from '../auth/UpdateUserProfileModal';
import { supabaseClient } from '../../utils/config/supabase';
import { useAppContext } from '../../utils/contexts/appContext';
import { useGetGroupInvitesByUser } from '../../domain/services/groupInviteService';
import { useNavigate } from 'react-router';

const UserMenu = () => {
    const { user } = useAppContext() ?? {};
    const { data: userInvites, isLoading: isUserInvitesLoading } =
        useGetGroupInvitesByUser(user?.profile?.user_id);
    const navigate = useNavigate();
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

    const handleLogout = useCallback(async () => {
        await supabaseClient.auth.signOut();
        navigate('/login');
    }, [navigate]);

    const handleUserInvitesClick = useCallback(() => {
        navigate('/groups/invited');
    }, [navigate]);

    const showUserInvites =
        !isUserInvitesLoading && userInvites && userInvites.length > 0;

    return (
        <Fragment>
            <IconButton onClick={handleUserMenuOpen}>
                <Badge
                    variant="dot"
                    invisible={!showUserInvites}
                    color="info"
                    overlap="circular"
                >
                    <Avatar src={user?.profile?.avatar_url ?? undefined} />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={userMenuAnchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
            >
                {showUserInvites && (
                    <MenuItem onClick={handleUserInvitesClick} selected>
                        <ListItemIcon>
                            <Badge
                                badgeContent={userInvites.length}
                                color="info"
                            >
                                <GroupAddIcon sx={{ color: 'primary.main' }} />
                            </Badge>
                        </ListItemIcon>
                        invites
                    </MenuItem>
                )}
                <MenuItem onClick={handleUserProfileModalOpen}>
                    <ListItemIcon>
                        <AccountCircle sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    logout
                </MenuItem>
            </Menu>
            <UpdateUserProfileModal
                open={userProfileModalOpen}
                onClose={handleUserProfileModalClose}
            />
        </Fragment>
    );
};

export default UserMenu;
