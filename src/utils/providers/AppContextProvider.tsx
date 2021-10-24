import { AppContext, IAppContext } from '../contexts/appContext';
import { FC, useEffect, useState } from 'react';
import {
    getCurrentUserProfileKey,
    useGetCurrentUserProfile,
} from '../../domain/services/userProfileService';

import { Auth } from '@supabase/ui';
import { getGroupInvitesByUserKey } from '../../domain/services/groupInviteService';
import { queryClient } from '../config/queryClient';
import { supabaseClient } from '../config/supabase';

const DEFAULT_USER_STATE = { profile: null, loading: true };

export const AppContextProvider: FC = ({ children }) => {
    const [appState, setAppState] = useState<IAppContext | null>({
        user: { ...DEFAULT_USER_STATE },
    });
    const { user } = Auth.useUser();

    const { data, isLoading } = useGetCurrentUserProfile(user?.id);

    useEffect(() => {
        setAppState(state => ({
            ...state,
            user: { profile: data ?? null, loading: isLoading },
        }));
        if (data) queryClient.invalidateQueries(getGroupInvitesByUserKey);
    }, [data, isLoading]);

    useEffect(() => {
        queryClient.invalidateQueries(getCurrentUserProfileKey);
    }, [user]);

    useEffect(() => {
        const { data: listener } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    setAppState(state => ({
                        ...state,
                        user: { profile: null, loading: false },
                    }));
                }
            },
        );

        return () => {
            listener?.unsubscribe();
        };
    }, []);

    return (
        <AppContext.Provider value={appState}>{children}</AppContext.Provider>
    );
};
