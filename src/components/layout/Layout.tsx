import { FC, Fragment } from 'react';

import { Container } from '@mui/material';
import LayoutProvider from '../../utils/providers/LayoutProvider';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';
import PageTitleWrapper from './PageTitleWrapper';
import RegistrationWrapper from '../auth/RegistrationWrapper';
import ScrollTopButton from './ScrollTopButton';
import VersionNoticeWrapper from '../auth/VersionNoticeWrapper';

const Layout: FC = ({ children }) => (
    <LayoutProvider>
        <PageTitleWrapper>
            <NavBar />
            <NavDrawer />
            <main>
                <RegistrationWrapper>
                    <VersionNoticeWrapper>
                        <Container maxWidth="xl">
                            <Fragment>{children}</Fragment>
                        </Container>
                        <ScrollTopButton />
                    </VersionNoticeWrapper>
                </RegistrationWrapper>
            </main>
        </PageTitleWrapper>
    </LayoutProvider>
);

export default Layout;
