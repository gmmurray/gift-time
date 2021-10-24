import { AppBar, IconButton, Link, Toolbar, Typography } from '@mui/material';

import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useLayoutContext } from '../../utils/contexts/layoutContext';

const NavBar = () => {
    const { onNavDrawerToggle } = useLayoutContext();
    return (
        <Box sx={{ flexGrow: 1, mb: 2 }} id="nav-menu">
            <AppBar color="primary" position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        sx={{ mr: 2 }}
                        color="inherit"
                        onClick={() => onNavDrawerToggle(true)}
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
                    <UserMenu />
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
};

export default NavBar;
