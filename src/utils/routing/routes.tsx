import { Location, State } from 'history';
import { Navigate, RouteObject } from 'react-router';

import Dashboard from '../../pages/dashboard/Dashboard';
import Groups from '../../pages/groups';
import InvitedGroups from '../../pages/groups/invited/InvitedGroups';
import JoinedGroups from '../../pages/groups/joined/JoinedGroups';
import LandingPage from '../../pages/landingPage/LandingPage';
import Layout from '../../components/layout/Layout';
import Login from '../../pages/login/Login';
import NewGroup from '../../pages/groups/new/NewGroup';
import NotFound from '../../pages/notFound/NotFound';
import OwnedGroups from '../../pages/groups/owned/OwnedGroups';
import { ReactElement } from 'react';
import ViewGroup from '../../pages/groups/view/ViewGroup';

const elementWithLayout = (element: ReactElement) => <Layout>{element}</Layout>;

const privateElement = (
    isAuthenticated: boolean,
    location: Location<State>,
    element: ReactElement,
) => {
    if (!isAuthenticated)
        return <Navigate to="/login" state={{ from: location }} />;

    return elementWithLayout(element);
};

const nestedPrivateElement = (
    isAuthenticated: boolean,
    location: Location<State>,
    element: ReactElement,
) => {
    if (!isAuthenticated)
        return <Navigate to="/login" state={{ from: location }} />;
    return element;
};

const publicOnlyElement = (isAuthenticated: boolean, element: ReactElement) => {
    if (isAuthenticated) return <Navigate to="/home" />;
    return element;
};

export const getRoutes = (
    isAuthenticated: boolean,
    location: Location<State>,
): RouteObject[] => {
    const showPrivateElement = (element: ReactElement) =>
        privateElement(isAuthenticated, location, element);
    const showNestedPrivateElement = (element: ReactElement) =>
        nestedPrivateElement(isAuthenticated, location, element);
    const showPublicOnlyElement = (element: ReactElement) =>
        publicOnlyElement(isAuthenticated, element);
    return [
        {
            path: '/',
            element: <LandingPage />,
        },
        {
            path: '/login',
            element: showPublicOnlyElement(<Login />),
        },
        {
            path: '/groups',
            element: showPrivateElement(<Groups />),
            children: [
                {
                    path: 'new',
                    element: showNestedPrivateElement(<NewGroup />),
                },
                {
                    path: 'owned',
                    element: showNestedPrivateElement(<OwnedGroups />),
                },
                {
                    path: 'joined',
                    element: showNestedPrivateElement(<JoinedGroups />),
                },
                {
                    path: 'invited',
                    element: showNestedPrivateElement(<InvitedGroups />),
                },
                {
                    path: 'view/:group_id',
                    element: showNestedPrivateElement(<ViewGroup />),
                },
            ],
        },
        {
            path: '/home',
            element: showPrivateElement(<Dashboard />),
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ];
};
