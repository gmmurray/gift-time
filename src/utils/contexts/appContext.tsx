import { createContext, useContext } from 'react';

import { UserProfile } from '../../domain/entities/UserProfile';

export interface IAppContext {
    user: {
        profile: UserProfile | null;
        loading: boolean;
    };
}

export const AppContext = createContext<IAppContext | null>(null);

export const useAppContext = () => useContext(AppContext);
