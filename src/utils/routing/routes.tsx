import { Location, State } from 'history';
import { Navigate, RouteObject } from 'react-router';

import Dashboard from '../../pages/dashboard/Dashboard';
import LandingPage from '../../pages/landingPage/LandingPage';
import Layout from '../../components/layout/Layout';
import Login from '../../pages/login/Login';
import { ReactElement } from 'react';
import Register from '../../pages/register/Register';

const elementWithLayout = (element: ReactElement) => <Layout>{element}</Layout>;

const privateElement = (
    isAuthenticated: boolean,
    isRegistered: boolean,
    location: Location<State>,
    element: ReactElement,
) => {
    if (!isAuthenticated)
        return <Navigate to="/login" state={{ from: location }} />;

    if (!isRegistered)
        return <Navigate to="/register" state={{ from: location }} />;
    return elementWithLayout(element);
};

const publicOnlyElement = (isAuthenticated: boolean, element: ReactElement) => {
    if (isAuthenticated) return <Navigate to="/home" />;
    return element;
};

export const getRoutes = (
    isAuthenticated: boolean,
    isRegistered: boolean,
    location: Location<State>,
): RouteObject[] => [
    {
        path: '/',
        element: publicOnlyElement(isAuthenticated, <LandingPage />),
    },
    {
        path: '/login',
        element: publicOnlyElement(isAuthenticated, <Login />),
    },
    {
        path: '/register',
        element: isAuthenticated ? (
            isRegistered ? (
                <Navigate to="/home" state={{ from: location }} />
            ) : (
                elementWithLayout(<Register />)
            )
        ) : (
            publicOnlyElement(isAuthenticated, <Login />)
        ),
    },
    {
        path: '/home',
        element: privateElement(
            isAuthenticated,
            isRegistered,
            location,
            <Dashboard />,
        ),
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    },
];
