import { useLocation, useRoutes } from 'react-router';

import { Auth } from '@supabase/ui';
import DataLoadingSpinner from './components/shared/DataLoadingSpinner';
import { Fragment } from 'react';
import { getRoutes } from './utils/routing/routes';
import { useAppContext } from './utils/contexts/appContext';

const App = () => {
    const location = useLocation();
    const { user } = Auth.useUser();
    const appContext = useAppContext();

    const isAuthenticated = !!user;

    const routing = useRoutes(getRoutes(isAuthenticated, location));
    if (appContext?.user.loading ?? true)
        return <DataLoadingSpinner showBackground={false} />;
    return <Fragment>{routing}</Fragment>;
};

export default App;
