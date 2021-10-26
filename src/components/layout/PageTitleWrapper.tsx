import { FC, Fragment, useEffect } from 'react';

import { getPageTitle } from '../../utils/routing/pageTitles';
import { useLocation } from 'react-router';

const PageTitleWrapper: FC = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        document.title = getPageTitle(location.pathname);
    }, [location]);
    return <Fragment>{children}</Fragment>;
};

export default PageTitleWrapper;
