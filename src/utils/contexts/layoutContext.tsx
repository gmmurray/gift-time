import { createContext, useContext } from 'react';

import { noop } from '../helpers/noop';

export interface ILayoutContext {
    isNavDrawerOpen: boolean;
    onNavDrawerToggle: (value: boolean) => any;
}

export const defaultLayoutContext: ILayoutContext = {
    isNavDrawerOpen: false,
    onNavDrawerToggle: noop,
};

export const LayoutContext =
    createContext<ILayoutContext>(defaultLayoutContext);

export const useLayoutContext = () => useContext(LayoutContext);
