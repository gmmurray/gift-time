import { FC, Fragment } from 'react';

import { Container } from '@mui/material';
import LayoutProvider from '../../utils/providers/LayoutProvider';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';
import RegistrationWrapper from '../auth/RegistrationWrapper';
import ScrollTopButton from './ScrollTopButton';

const Layout: FC = ({ children }) => (
    <LayoutProvider>
        <NavBar />
        <NavDrawer />
        <main>
            <RegistrationWrapper>
                <Container maxWidth="xl">
                    <Fragment>{children}</Fragment>
                </Container>
                <ScrollTopButton />
            </RegistrationWrapper>
        </main>
    </LayoutProvider>
);

export default Layout;
