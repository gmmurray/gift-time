import { FC, Fragment, useCallback, useState } from 'react';

import { Container } from '@mui/material';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';
import ScrollTopButton from './ScrollTopButton';
import { supabaseClient } from '../../utils/config/supabase';
import { useNavigate } from 'react-router';

const Layout: FC = ({ children }) => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = useCallback(
        (value: boolean) => setDrawerOpen(value),
        [],
    );

    const handleLogout = useCallback(async () => {
        await supabaseClient.auth.signOut();
        navigate('/login');
    }, [navigate]);

    return (
        <Fragment>
            <NavBar onMenuClick={handleDrawerToggle} onLogout={handleLogout} />
            <NavDrawer
                onToggle={(value: boolean) => handleDrawerToggle(value)}
                open={drawerOpen}
            />
            <main>
                <Container maxWidth="xl">
                    <Fragment>{children}</Fragment>
                </Container>
                <ScrollTopButton />
            </main>
        </Fragment>
    );
};

export default Layout;
