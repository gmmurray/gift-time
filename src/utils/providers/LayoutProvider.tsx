import { FC, useCallback, useState } from 'react';
import {
    ILayoutContext,
    LayoutContext,
    defaultLayoutContext,
} from '../contexts/layoutContext';

const LayoutProvider: FC = ({ children }) => {
    const [layoutState, setLayoutState] =
        useState<ILayoutContext>(defaultLayoutContext);

    const handleNavDrawerToggle = useCallback(
        (value: boolean) =>
            setLayoutState(state => ({ ...state, isNavDrawerOpen: value })),
        [],
    );

    const contextValue: ILayoutContext = {
        ...layoutState,
        onNavDrawerToggle: handleNavDrawerToggle,
    };

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
};

export default LayoutProvider;
