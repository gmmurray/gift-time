import { FC, Fragment } from 'react';

import { Container } from '@mui/material';
import LayoutProvider from '../../utils/providers/LayoutProvider';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';
import PageTitleWrapper from './PageTitleWrapper';
import RegistrationWrapper from '../auth/RegistrationWrapper';
import ScrollTopButton from './ScrollTopButton';

const Layout: FC = ({ children }) => (
    <LayoutProvider>
        <PageTitleWrapper>
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
        </PageTitleWrapper>
    </LayoutProvider>
);

export default Layout;
