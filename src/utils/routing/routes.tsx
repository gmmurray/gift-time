import { Location, State } from 'history';
import { Navigate, RouteObject } from 'react-router';

import Dashboard from '../../pages/dashboard/Dashboard';
import Gifts from '../../pages/gifts';
import GroupGift from '../../pages/groupGift';
import Groups from '../../pages/groups';
import InvitedGroups from '../../pages/groups/invited/InvitedGroups';
import JoinedGroups from '../../pages/groups/joined/JoinedGroups';
import LandingPage from '../../pages/landingPage/LandingPage';
import Layout from '../../components/layout/Layout';
import Login from '../../pages/login/Login';
import NewGift from '../../pages/gifts/new/NewGift';
import NewGroup from '../../pages/groups/new/NewGroup';
import NotFound from '../../pages/notFound/NotFound';
import OwnedGroups from '../../pages/groups/owned/OwnedGroups';
import PrivateGifts from '../../pages/gifts/private/PrivateGifts';
import PublicGifts from '../../pages/gifts/public/PublicGifts';
import { ReactElement } from 'react';
import ViewGift from '../../pages/gifts/view/ViewGift';
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
                {
                    path: '',
                    element: <Navigate to="/groups/joined" />,
                },
            ],
        },
        {
            path: '/gifts',
            element: showPrivateElement(<Gifts />),
            children: [
                {
                    path: 'new',
                    element: showNestedPrivateElement(<NewGift />),
                },
                {
                    path: 'public',
                    element: showNestedPrivateElement(<PublicGifts />),
                },
                {
                    path: 'private',
                    element: showNestedPrivateElement(<PrivateGifts />),
                },
                {
                    path: 'view/:gift_id',
                    element: showNestedPrivateElement(<ViewGift />),
                },
                {
                    path: '*',
                    element: showNestedPrivateElement(<PublicGifts />),
                },
            ],
        },
        {
            path: '/group-gift/:group_id',
            element: showPrivateElement(<GroupGift />),
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
